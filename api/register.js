import { getData, saveData } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { nickname, cups } = req.body;
    if (!nickname) return res.status(400).json({ error: 'Нет ника' });

    const cleanNick = nickname.toLowerCase().replace(/[^a-z0-9_а-яё]/g, '');
    const db = await getData();

    if (db.players.find(p => p.cleanNick === cleanNick)) {
      return res.status(409).json({ error: 'Ник уже занят' });
    }

    const newPlayer = {
      cleanNick: cleanNick,
      nickname: nickname,
      cups: cups || 0,
      games: 1,
      date: new Date().toISOString()
    };

    db.players.push(newPlayer);
    db.players.sort((a, b) => b.cups - a.cups);
    await saveData(db);

    return res.status(201).json({ success: true, player: newPlayer });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}