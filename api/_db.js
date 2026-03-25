// api/_db.js
const BIN_ID = '69c45b3fb7ec241ddca2dc2b'; // Вставь свой Bin ID
const API_KEY = '$2a$10$wX87kHwyff/dL8hvw8Wk8.nJMpziB6dSmN/t00ZIhj6Q/m4u2ya46'; // Вставь свой Master Key

export async function getData() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const data = await res.json();
  return data.record;
}

export async function saveData(data) {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: { 
      'X-Master-Key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}