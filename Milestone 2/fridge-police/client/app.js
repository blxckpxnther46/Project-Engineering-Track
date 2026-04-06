async function loadItems() {
  const res = await fetch('http://localhost:3000/items');
  const data = await res.json();

  const list = document.getElementById('items');
  list.innerHTML = '';

  data.forEach(item => {
    const li = document.createElement('li');
    li.innerText = `${item.name} - ${item.quantity}%`;
    list.appendChild(li);
  });
}

async function addItem() {
  const name = document.getElementById('name').value;

  await fetch('http://localhost:3000/items', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name,
      owner: "User"
    })
  });

  loadItems();
}

loadItems();
