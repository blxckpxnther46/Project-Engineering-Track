async function load() {
  const res = await fetch('http://localhost:3000/items');
  const data = await res.json();
  document.getElementById('items').innerHTML =
    data.map(i => `
      <li>
        ${i.name} - ${i.status}
        <button onclick="claim('${i.id}')">Claim</button>
      </li>`).join('');
}

async function addItem() {
  const name = document.getElementById('name').value;
  await fetch('http://localhost:3000/items', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ name })
  });
  load();
}

async function claim(id) {
  await fetch('http://localhost:3000/claim', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ id, user:'User' })
  });
  load();
}

load();
