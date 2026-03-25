import { getData, saveData } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { nickname, cups } = req.body;
    if (!nickname || typeof cups !== 'number') return res.status(400).json({ error: 'Ошибка данных' });

    const cleanNick = nickname.toLowerCase().replace(/[^a-z0-9_а-яё]/g, '');
    const db = await getData();
    
    const player = db.players.find(p => p.cleanNick === cleanNick);
    if (!player) {
      return res.status(404).json({ error: 'Игрок не найден' });
    }

    player.cups += cups;
    player.games = (player.games || 0) + 1;
    player.lastPlayed = new Date().toISOString();
    
    db.players.sort((a, b) => b.cups - a.cups);
    await saveData(db);

    return res.status(200).json({ success: true, newTotal: player.cups });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}