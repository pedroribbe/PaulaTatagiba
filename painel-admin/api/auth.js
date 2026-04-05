import crypto from 'crypto';

function makeToken(username) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 dias
  const payload = `${username}:${exp}`;
  const sig = crypto
    .createHmac('sha256', process.env.SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return `${payload}:${sig}`;
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body || {};

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({ token: makeToken(username) });
  }

  return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
}
