import crypto from 'crypto';

function verifyToken(authHeader) {
  if (!authHeader?.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7);
  const parts = token.split(':');
  if (parts.length !== 3) return false;
  const [username, exp, sig] = parts;
  if (Date.now() > parseInt(exp)) return false;
  const payload = `${username}:${exp}`;
  const expected = crypto
    .createHmac('sha256', process.env.SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return sig === expected;
}

const GH_BASE = 'https://api.github.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!verifyToken(req.headers.authorization)) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }

  const { GITHUB_TOKEN, GITHUB_REPO } = process.env;
  const [owner, repo] = GITHUB_REPO.split('/');
  const ghHeaders = {
    Authorization: `token ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'TatagibaAdmin/1.0',
  };

  // GET — lê arquivo do repositório
  if (req.method === 'GET') {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: 'path obrigatório' });

    const r = await fetch(`${GH_BASE}/repos/${owner}/${repo}/contents/${path}`, {
      headers: ghHeaders,
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  }

  // POST — salva arquivo no repositório
  if (req.method === 'POST') {
    const { path, content, message, sha } = req.body || {};
    if (!path || !content || !message) {
      return res.status(400).json({ error: 'path, content e message são obrigatórios' });
    }

    const body = { message, content };
    if (sha) body.sha = sha;

    const r = await fetch(`${GH_BASE}/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify(body),
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
