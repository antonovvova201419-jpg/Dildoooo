import { getData } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { nickname } = req.body;
    if (!nickname) return res.status(400).json({ error: 'Нет ника' });

    const cleanNick = nickname.toLowerCase().replace(/[^a-z0-9_а-яё]/g, '');
    const db = await getData();
    const exists = db.players.find(p => p.cleanNick === cleanNick);

    if (exists) {
      return res.status(200).json({ available: false, message: 'Ник занят' });
    }
    return res.status(200).json({ available: true, message: 'Ник свободен' });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}