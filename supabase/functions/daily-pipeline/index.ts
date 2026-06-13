// ════════════════════════════════════════════════════════════════════════
// Staqd — daily-pipeline Edge Function
//
// Fetches recent arXiv papers, classifies + summarises each with Gemini into
// the Staqd taxonomy, finds an associated GitHub repo, and inserts real rows
// into `papers`. Runs server-side (holds secrets); inserts with the service
// role key so it bypasses RLS.
//
// Auth: requires header `x-cron-secret: <CRON_SECRET>`.
// Invoke manually to test, then schedule with pg_cron (see setup steps).
// ════════════════════════════════════════════════════════════════════════

import { createClient } from 'jsr:@supabase/supabase-js@2';

// ── Config ──────────────────────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-2.5-flash'; // free tier; swap to gemini-3.5-flash if desired
const MAX_NEW_PER_RUN = 8; // keep within Gemini free-tier limits (15 RPM / 1500 RPD)
const ARXIV_MAX = 40; // how many recent papers to pull before dedupe

// Must match the Dashboard's fixed category tabs, or papers won't appear.
const CATEGORIES = [
  'Computer Sciences', 'Electrical', 'Bioengineering', 'Mechanical', 'Civil',
  'Aerospace', 'Psychology', 'Health and Medical Sciences', 'Biomedical',
  'Physics and Chemistry',
];

// arXiv categories spanning our domains.
const ARXIV_CATS = [
  'cs.AI', 'cs.LG', 'cs.CL', 'cs.CV', 'cs.CR', 'cs.SE', 'cs.RO',
  'eess.SP', 'eess.SY', 'q-bio.TO', 'q-bio.BM', 'physics.med-ph', 'cond-mat.mtrl-sci',
];

// Stable category → hero image (Unsplash). Fallback to a generic research image.
const CATEGORY_IMAGE: Record<string, string> = {
  'Computer Sciences': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800',
  'Electrical': 'https://images.unsplash.com/photo-1620283085439-39620a1e21c4?auto=format&fit=crop&q=80&w=800',
  'Bioengineering': 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?auto=format&fit=crop&q=80&w=800',
  'Physics and Chemistry': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800',
  'Biomedical': 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
};
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800';

// ── Types ───────────────────────────────────────────────────────────────
interface ArxivPaper {
  arxivId: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  pdfUrl: string;
}

interface GeminiFields {
  category: string;
  subTopic: string;
  plainTitle: string;
  excerpt: string;
  content: string;
  readTime: string;
}

// ── arXiv ───────────────────────────────────────────────────────────────
function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decodeEntities(m[1]) : '';
}

export function parseArxiv(xml: string): ArxivPaper[] {
  const entries = xml.split('<entry>').slice(1).map((e) => e.split('</entry>')[0]);
  const papers: ArxivPaper[] = [];
  for (const e of entries) {
    const idRaw = tag(e, 'id'); // http://arxiv.org/abs/2401.12345v1
    const arxivId = (idRaw.match(/abs\/([^v]+)(v\d+)?/)?.[1] ?? idRaw).trim();
    const authors = [...e.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((m) => decodeEntities(m[1]));
    const pdfUrl =
      e.match(/<link[^>]*title="pdf"[^>]*href="([^"]+)"/)?.[1] ??
      `https://arxiv.org/pdf/${arxivId}`;
    if (!arxivId || !tag(e, 'title')) continue;
    papers.push({
      arxivId,
      title: tag(e, 'title'),
      summary: tag(e, 'summary'),
      authors,
      published: tag(e, 'published'),
      pdfUrl: pdfUrl.replace(/^http:/, 'https:'),
    });
  }
  return papers;
}

async function fetchArxiv(): Promise<ArxivPaper[]> {
  const q = ARXIV_CATS.map((c) => `cat:${c}`).join('+OR+');
  const url = `https://export.arxiv.org/api/query?search_query=${q}&sortBy=submittedDate&sortOrder=descending&max_results=${ARXIV_MAX}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'StaqdPipeline/1.0' } });
  if (!res.ok) throw new Error(`arXiv ${res.status}`);
  return parseArxiv(await res.text());
}

// ── Gemini ──────────────────────────────────────────────────────────────
export function parseGeminiJson(text: string): GeminiFields | null {
  // Strip ```json fences if present, then parse.
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    const o = JSON.parse(cleaned);
    if (!o.category || !o.plainTitle) return null;
    const category = CATEGORIES.includes(o.category) ? o.category : CATEGORIES[0];
    return {
      category,
      subTopic: String(o.subTopic ?? 'General'),
      plainTitle: String(o.plainTitle),
      excerpt: String(o.excerpt ?? ''),
      content: String(o.content ?? ''),
      readTime: String(o.readTime ?? '5 min read'),
    };
  } catch {
    return null;
  }
}

async function geminiSummarise(paper: ArxivPaper, apiKey: string): Promise<GeminiFields | null> {
  const prompt = `You are a science editor for "Staqd". Rewrite this research paper for a curious technical audience.
Return ONLY a JSON object, no prose, with keys:
  "category"   - EXACTLY one of: ${CATEGORIES.join(' | ')}
  "subTopic"   - a concise 1-3 word sub-field (e.g. "Machine Learning", "Robotics")
  "plainTitle" - a clear, jargon-light title
  "excerpt"    - 1-2 sentence plain-language summary (max ~40 words)
  "content"    - a ~180-word markdown explainer: what it does, why it matters, how it works
  "readTime"   - e.g. "5 min read"

PAPER TITLE: ${paper.title}
ABSTRACT: ${paper.summary}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
      }),
    }
  );
  if (!res.ok) {
    console.error(`Gemini ${res.status}: ${await res.text()}`);
    return null;
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return parseGeminiJson(text);
}

// ── GitHub ──────────────────────────────────────────────────────────────
async function findGithubRepo(title: string, token: string | undefined): Promise<string | null> {
  const keywords = title.split(/\s+/).slice(0, 6).join(' ');
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(keywords)}&sort=stars&order=desc&per_page=1`;
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'StaqdPipeline/1.0' };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const data = await res.json();
    const repo = data?.items?.[0];
    // Only attach if it has some traction (avoids spurious matches).
    return repo && repo.stargazers_count >= 25 ? repo.html_url : null;
  } catch {
    return null;
  }
}

// ── Row mapping ─────────────────────────────────────────────────────────
export function buildRow(paper: ArxivPaper, g: GeminiFields, githubUrl: string | null) {
  return {
    arxiv_id: paper.arxivId,
    title: g.plainTitle || paper.title,
    excerpt: g.excerpt,
    content: g.content,
    category: g.category,
    sub_topic: g.subTopic,
    read_time: g.readTime,
    image_url: CATEGORY_IMAGE[g.category] ?? FALLBACK_IMAGE,
    document_url: paper.pdfUrl,
    github_url: githubUrl,
    author_name: paper.authors[0] ?? 'arXiv',
    author_avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(paper.authors[0] ?? 'arXiv')}`,
    author_role: '[ STΛQD ] · arXiv',
    likes: 0,
    published_at: paper.published || null,
  };
}

// ── Handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  // Auth via shared secret.
  const cronSecret = Deno.env.get('CRON_SECRET');
  if (!cronSecret || req.headers.get('x-cron-secret') !== cronSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  const githubToken = Deno.env.get('GITHUB_API_TOKEN');
  if (!geminiKey) return new Response('Missing GEMINI_API_KEY', { status: 500 });

  try {
    const fetched = await fetchArxiv();

    // Dedupe against existing arxiv_ids.
    const ids = fetched.map((p) => p.arxivId);
    const { data: existing } = await supabase.from('papers').select('arxiv_id').in('arxiv_id', ids);
    const known = new Set((existing ?? []).map((r: { arxiv_id: string }) => r.arxiv_id));
    const fresh = fetched.filter((p) => !known.has(p.arxivId)).slice(0, MAX_NEW_PER_RUN);

    const rows = [];
    for (const paper of fresh) {
      const g = await geminiSummarise(paper, geminiKey);
      if (!g) continue;
      const githubUrl = await findGithubRepo(paper.title, githubToken);
      rows.push(buildRow(paper, g, githubUrl));
    }

    let inserted = 0;
    if (rows.length > 0) {
      const { error, count } = await supabase
        .from('papers')
        .upsert(rows, { onConflict: 'arxiv_id', ignoreDuplicates: true, count: 'exact' });
      if (error) throw error;
      inserted = count ?? rows.length;
    }

    return new Response(
      JSON.stringify({ fetched: fetched.length, new: fresh.length, inserted }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Pipeline failed', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});