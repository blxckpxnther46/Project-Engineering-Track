const messages = [];

const chatDisplay = document.getElementById('chatDisplay');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

function renderMessage(role, content) {
    const div = document.createElement('div');
    div.classList.add('message', role);
    div.textContent = content;
    chatDisplay.appendChild(div);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    messages.push({ role: "user", content: text });
    renderMessage("user", text);
    messageInput.value = "";

    const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages })
    });

    const data = await res.json();

    messages.push({ role: "assistant", content: data.reply });
    renderMessage("assistant", data.reply);
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
