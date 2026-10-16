export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const DEFAULT_TOKEN = '425850578770684393:cUbpKCQrbcrlGkNkoqbvCmskIUyFjxBlpwHzJJDPdBDaCRdAjTEAEaZYcnbuaxXz';

  try {
    const body = req.body || {};
    const action = body.action || req.query.action || 'getMe';
    const botToken = body.bot_token || DEFAULT_TOKEN;

    const baseApi = `https://bot-api.zaloplatforms.com/bot${botToken}`;

    if (action === 'getMe') {
      const response = await fetch(`${baseApi}/getMe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (action === 'getUpdates') {
      const response = await fetch(`${baseApi}/getUpdates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (action === 'sendMessage') {
      const { chat_id, text } = body;
      if (!chat_id || !text) {
        return res.status(400).json({ ok: false, error: 'Thiếu chat_id hoặc text' });
      }

      const response = await fetch(`${baseApi}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: String(chat_id).trim(),
          text: String(text).trim()
        })
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ ok: false, error: `Action không hợp lệ: ${action}` });
  } catch (error) {
    console.error('Lỗi API Zalo Bot:', error);
    return res.status(500).json({ ok: false, error: error.message || 'Internal Server Error' });
  }
}
