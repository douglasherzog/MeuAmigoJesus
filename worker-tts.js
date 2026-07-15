// Cloudflare Worker - Proxy TTS ElevenLabs
// Deploy: https://dash.cloudflare.com -> Workers & Pages -> Create Worker
// Cole este código e defina a variável ELEVENLABS_API_KEY em Settings -> Variables

const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Bella - voz suave e amigável
const ELEVENLABS_MODEL = 'eleven_multilingual_v2';

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === '/falar') {
      const texto = url.searchParams.get('texto');
      if (!texto) {
        return new Response(JSON.stringify({ error: 'Parâmetro "texto" é obrigatório' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      if (!env.ELEVENLABS_API_KEY) {
        return new Response(JSON.stringify({ error: 'API key não configurada' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      try {
        const elevenResponse = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
          {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': env.ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              text: texto,
              model_id: ELEVENLABS_MODEL,
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.0,
                use_speaker_boost: true,
              },
            }),
          }
        );

        if (!elevenResponse.ok) {
          const errText = await elevenResponse.text();
          return new Response(JSON.stringify({ error: 'ElevenLabs API error: ' + errText }), {
            status: elevenResponse.status,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const audioBuffer = await elevenResponse.arrayBuffer();

        return new Response(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=86400',
            ...corsHeaders,
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Erro interno: ' + err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    return new Response('TTS Proxy ElevenLabs - use /falar?texto=...', {
      headers: corsHeaders,
    });
  },
};
