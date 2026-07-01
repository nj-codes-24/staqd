// ════════════════════════════════════════════════════════════════════════
// Staqd — chat-document Edge Function
//
// Receives a user query, chat history, and document text to generate an
// intelligent, context-aware answer using Gemini 2.5 Flash.
// ════════════════════════════════════════════════════════════════════════

const GEMINI_MODEL = 'gemini-2.5-flash';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiKey) {
    return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { userQuery, documentText, chatHistory = [] } = await req.json();
    if (!userQuery) throw new Error('userQuery required');
    if (!documentText) throw new Error('documentText required');

    // Limit document text to prevent exceeding limits just in case, though 2.5 flash handles a lot.
    const truncatedDoc = documentText.slice(0, 150000); // approx 40k tokens max

    // Construct the chat history for Gemini
    // Gemini API expects contents to be an array of { role: 'user' | 'model', parts: [{ text: string }] }
    
    // We add the document context into a system instruction to keep it isolated from the chat flow.
    const systemInstruction = {
      parts: [{
        text: `You are an expert academic concierge assistant for the STAQD platform. You are helping a user understand a research paper. Read the following document text carefully. You MUST answer the user's questions using ONLY the information provided in this document. If the answer is not in the text, politely tell them that the paper does not cover it. Be helpful, concise, and academic.\n\nDOCUMENT TEXT:\n${truncatedDoc}`
      }]
    };

    const contents = [];
    
    // Push the history
    for (const msg of chatHistory) {
      if (msg.sender === 'user' || msg.sender === 'assistant') {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Push the current user query
    contents.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
        body: JSON.stringify({
          system_instruction: systemInstruction,
          contents,
          generationConfig: { responseMimeType: 'text/plain', temperature: 0.3 },
        }),
      }
    );
    
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'I am unable to generate a response at this time.';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('chat-document failed', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
