export default async function handler(req, res) {
  // CORS & Health check
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Zalo-Secret-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'Zalo Bot Webhook' });
  }

  const DEFAULT_TOKEN = '425850578770684393:cUbpKCQrbcrlGkNkoqbvCmskIUyFjxBlpwHzJJDPdBDaCRdAjTEAEaZYcnbuaxXz';
  const SUPABASE_URL = 'https://hnuacgqxbjhezwjzsfpf.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWFjZ3F4YmpoZXp3anpzZnBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDAzMjAsImV4cCI6MjEwNjc3NjMyMH0.4EV5Rv7LNTZvTQPpw4dHzu2ReFMSsETUryMqUcrSxJw';

  try {
    const body = req.body || {};
    console.log('Zalo Webhook payload received:', JSON.stringify(body));

    // Extract message and chat info
    const msg = body.message || body.channel_post || (body.entry && body.entry[0]?.changes && body.entry[0].changes[0]?.value?.message);
    const chat = msg?.chat || body.chat;

    if (chat && chat.id) {
      const chatId = String(chat.id).trim();
      const chatTitle = chat.title || chat.name || 'Nhóm Zalo Phụ Huynh';
      const senderName = msg?.from?.name || msg?.from?.first_name || 'Giáo lý viên';

      // 1. Save to Supabase under key 'zalo_recent_groups'
      try {
        const getRes = await fetch(`${SUPABASE_URL}/rest/v1/user_data?email=eq.zalo_recent_groups&select=*`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const rows = await getRes.json();
        let existingGroups = (rows && rows[0]?.data?.groups) || [];

        // Prepend current chat
        existingGroups = existingGroups.filter(g => String(g.id) !== chatId);
        existingGroups.unshift({
          id: chatId,
          title: chatTitle,
          sender: senderName,
          lastMessageAt: new Date().toISOString()
        });

        // Keep last 15 groups
        if (existingGroups.length > 15) existingGroups = existingGroups.slice(0, 15);

        await fetch(`${SUPABASE_URL}/rest/v1/user_data`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            email: 'zalo_recent_groups',
            data: { groups: existingGroups, latestId: chatId, latestTitle: chatTitle },
            updated_at: new Date().toISOString()
          })
        });
      } catch (dbErr) {
        console.warn('Supabase save error:', dbErr);
      }

      // 2. Automatically reply to the group if someone tags or asks
      try {
        const replyText = `👋 Xin chào! Bot Điểm Danh đã kết nối với nhóm thành công!\n\n👉 Mã nhóm (Chat ID) của lớp này là: ${chatId}\n\n(Bạn hãy sao chép mã số này hoặc quay lại trang web bấm "Tìm mã nhóm" là xong nhé!)`;
        await fetch(`https://bot-api.zapps.me/bot${DEFAULT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyText
          })
        });
      } catch (sendErr) {
        console.warn('Auto reply error:', sendErr);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(200).json({ ok: true, note: 'Error handled' });
  }
}
