// Vercel Serverless Function — proxies chat requests to the Railway backend.
// Runs server-side, so the browser never calls Railway directly and there is
// no CORS issue. Frontend calls same-origin POST /api/chat { prompt }.

const BACKEND_URL =
  process.env.CHAT_BACKEND_URL ||
  'https://customer-support-ai-chatbot-development.up.railway.app/chat';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt =
    req.body && typeof req.body === 'object' ? req.body.prompt : undefined;

  if (typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'A non-empty "prompt" is required.' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    const upstream = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { reply: text };
    }

    return res.status(upstream.status).json(data);
  } catch (err) {
    const aborted = err && err.name === 'AbortError';
    return res.status(aborted ? 504 : 502).json({
      error: aborted
        ? 'The assistant took too long to respond. Please try again.'
        : 'Could not reach the assistant. Please try again shortly.',
    });
  }
}
