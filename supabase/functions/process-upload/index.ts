// ════════════════════════════════════════════════════════════════════════
// Staqd — process-upload Edge Function
//
// Takes an uploaded document (public Storage URL), sends it to Gemini, and
// returns structured article fields for the upload card. Called by logged-in
// users (verify_jwt stays on). Does not write to the DB — the client keeps
// uploads in its own list.
// ════════════════════════════════════════════════════════════════════════

const GEMINI_MODEL = 'gemini-2.5-flash';

const CATEGORIES = [
  'Computer Sciences', 'Electrical', 'Bioengineering', 'Mechanical', 'Civil',
  'Aerospace', 'Psychology', 'Health and Medical Sciences', 'Biomedical',
  'Physics and Chemistry',
];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Fields {
  title: string;
  author: string;
  cueCards: { term: string; desc: string }[];
  excerpt: string;
  content: string;
  category: string;
  subTopic: string;
  readTime: string;
}

function parseGeminiJson(text: string): Fields | null {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    const o = JSON.parse(cleaned);
    if (!o.title) return null;
    return {
      title: String(o.title),
      author: String(o.author ?? 'Unknown author'),
      excerpt: String(o.excerpt ?? ''),
      content: String(o.content ?? ''),
      category: CATEGORIES.includes(o.category) ? o.category : CATEGORIES[0],
      subTopic: String(o.subTopic ?? 'General'),
      readTime: String(o.readTime ?? '10 min read'),
      cueCards: Array.isArray(o.cueCards)
        ? o.cueCards.slice(0, 5).map((c: any) => ({ term: String(c?.term ?? ''), desc: String(c?.desc ?? '') })).filter((c: any) => c.term)
        : [],
    };
  } catch {
    return null;
  }
}

async function fetchDocParts(url: string, prompt: string): Promise<unknown[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch document ${res.status}`);
  const mime = res.headers.get('content-type') ?? '';
  const isText = mime.includes('text') || /\.(txt|md|csv)(\?|$)/i.test(url);

  if (isText) {
    // Gemini can't take text/plain as inlineData — send the text directly.
    const text = (await res.text()).slice(0, 60000);
    return [{ text: `${prompt}\n\nDOCUMENT TEXT:\n${text}` }];
  }

  // PDF (and other Gemini-supported binary): inline base64.
  const buf = new Uint8Array(await res.arrayBuffer());
  let binary = '';
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
  return [
    { inlineData: { mimeType: mime || 'application/pdf', data: btoa(binary) } },
    { text: prompt },
  ];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiKey) {
    return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { fileUrl } = await req.json();
    if (!fileUrl) throw new Error('fileUrl required');

    const prompt = `You are a science editor for "Staqd". A user uploaded this academic document (often an IEEE/arXiv-style paper).
Read the FIRST PAGE carefully — the author names are in the byline directly under the title.
Return ONLY a JSON object, no prose, with keys:
  "title"      - the document's real title, cleaned up
  "author"     - the author name(s) exactly as printed under the title (e.g. "Jane Doe, John Smith"). Look hard; only use "Unknown author" if there is genuinely no byline.
  "category"   - EXACTLY one of: ${CATEGORIES.join(' | ')}
  "subTopic"   - a concise 1-3 word sub-field
  "excerpt"    - 1-2 sentence plain-language summary (max ~40 words)
  "content"    - a ~200-word markdown explainer with 2-3 short "## " sections
  "readTime"   - e.g. "12 min read"
  "cueCards"   - an array of 3-5 study cards, each {"term": "<key concept/method/term from THIS paper>", "desc": "<one-sentence plain explanation>"}. Make them specific to the paper's actual content, not generic.`;

    const parts = await fetchDocParts(fileUrl, prompt);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);

    const data = await res.json();
    const fields = parseGeminiJson(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '');
    if (!fields) throw new Error('Could not parse document');

    return new Response(JSON.stringify(fields), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('process-upload failed', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});