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
  const SUPABASE_URL = 'https://hnuacgqxbjhezwjzsfpf.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWFjZ3F4YmpoZXp3anpzZnBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDAzMjAsImV4cCI6MjEwNjc3NjMyMH0.4EV5Rv7LNTZvTQPpw4dHzu2ReFMSsETUryMqUcrSxJw';

  try {
    const body = req.body || {};
    const action = body.action || req.query.action || 'getMe';
    const botToken = body.bot_token || DEFAULT_TOKEN;

    const baseApi = `https://bot-api.zapps.me/bot${botToken}`;

    if (action === 'getMe') {
      const response = await fetch(`${baseApi}/getMe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (action === 'getRecentGroups') {
      try {
        const getRes = await fetch(`${SUPABASE_URL}/rest/v1/user_data?email=eq.zalo_recent_groups&select=*`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const rows = await getRes.json();
        const data = rows && rows[0]?.data;
        return res.status(200).json({
          ok: true,
          groups: data?.groups || [],
          latestId: data?.latestId || null,
          latestTitle: data?.latestTitle || null
        });
      } catch (dbErr) {
        return res.status(200).json({ ok: false, error: dbErr.message });
      }
    }

    if (action === 'getUpdates') {
      let updates = [];
      try {
        const response = await fetch(`${baseApi}/getUpdates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeout: 2 })
        });
        const data = await response.json();
        if (data.ok && Array.isArray(data.result)) {
          updates = data.result;
        }
      } catch (pollErr) {
        console.warn('Poll error:', pollErr);
      }

      // If updates empty, check Supabase recent groups as fallback
      if (updates.length === 0) {
        try {
          const getRes = await fetch(`${SUPABASE_URL}/rest/v1/user_data?email=eq.zalo_recent_groups&select=*`, {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
          const rows = await getRes.json();
          const savedData = rows && rows[0]?.data;
          if (savedData && savedData.latestId) {
            return res.status(200).json({
              ok: true,
              result: [{
                message: {
                  chat: {
                    id: savedData.latestId,
                    type: 'group',
                    title: savedData.latestTitle || 'Nhóm Zalo Phụ Huynh'
                  }
                }
              }]
            });
          }
        } catch(e) {}
      }

      return res.status(200).json({ ok: true, result: updates });
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
