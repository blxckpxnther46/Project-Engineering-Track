const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // ✅ FIX
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  try {
    const { diff } = req.body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Convert this git diff into a professional PR description:\n\n${diff}`
          }
        ]
      })
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    res.json({ result });

  } catch (err) {
    console.error(err); // 🔥 add this for debugging
    res.status(500).json({ error: "Failed" });
  }
});

app.listen(3000, () => console.log("Server running"));