module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && req.headers.origin !== `https://${req.headers.host}`) return res.status(403).json({ error: 'Invalid origin' });
  const body = req.body;
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid request' });
  if (body.website) return res.status(200).json({ ok: true });
  const fields = ['name', 'email', 'org', 'message'];
  if (fields.some(k => typeof (body[k] ?? '') !== 'string')) return res.status(400).json({ error: 'Invalid request' });
  const { name, email, org, message } = Object.fromEntries(fields.map(k => [k, (body[k] || '').trim()]));
  if (!name || name.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || org.length > 200 || !message || message.length > 5000) return res.status(400).json({ error: 'Please check the form fields' });
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) return res.status(503).json({ error: 'Email service is not configured' });
  try {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'Recuply <info@recuply.biz>', to: [process.env.CONTACT_TO_EMAIL], reply_to: email, subject: 'New Recuply website enquiry', text: `Name: ${name}\nEmail: ${email}\nSchool / organisation: ${org}\n\n${message}` }) });
    if (!response.ok) return res.status(502).json({ error: 'Email service could not accept the message' });
    return res.status(200).json({ ok: true });
  } catch { return res.status(502).json({ error: 'Email service unavailable' }); }
};
