import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { GoogleGenAI } from 'npm:@google/genai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { articleContent, articleTitle, message, history = [] } = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const ai = new GoogleGenAI({ apiKey })

    const systemInstruction = `You are a helpful academic study assistant for an application called [ STΛQD ]. 
You are helping the user understand a research paper titled "${articleTitle}". 
Answer the user's questions based primarily on the context of this paper. 
If the answer cannot be found in the paper, you may use your general knowledge, but clarify that it's not explicitly stated in the paper.
Keep your answers concise, academic, and formatted in Markdown.

Here is the full text of the paper for context:
---
${articleContent || 'No paper content provided.'}
---`

    // Convert history format if needed
    const contents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      { role: "model", parts: [{ text: "Understood. I'm ready to help answer questions about the paper." }] }
    ]

    for (const msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })
    }
    
    contents.push({ role: 'user', parts: [{ text: message }] })

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    })

    return new Response(
      JSON.stringify({ response: response.text }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
