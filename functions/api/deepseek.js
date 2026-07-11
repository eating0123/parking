export async function onRequestPost({ request, env }) {
  try {
    const apiKey = env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return json({ error: 'Missing DEEPSEEK_API_KEY' }, 500);
    }

    const { messages } = await request.json();
    if (!Array.isArray(messages)) {
      return json({ error: 'Invalid messages' }, 400);
    }

    const upstream = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.4,
        stream: false
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return json({ error: data?.error?.message || `DeepSeek API ${upstream.status}` }, upstream.status);
    }

    return json({ content: data?.choices?.[0]?.message?.content || '' });
  } catch (error) {
    return json({ error: error.message || 'Unknown error' }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
