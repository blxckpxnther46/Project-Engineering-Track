# AI Chatbot

## What I Built

I built a fully functional AI chatbot with:

* A **vanilla JavaScript frontend** for user interaction
* A **Node.js + Express backend** that securely communicates with an AI model
* **Conversation context support**, allowing the chatbot to remember previous messages within the same session

The application allows users to send messages and receive real-time AI-generated responses, maintaining a natural conversation flow.

---

## Features

* Chat UI with message history
* Send messages via button or Enter key
* Persistent conversation context (memory)
* Secure backend API integration
* Error handling for failed requests

---

## Architecture

```
User → Frontend (HTML/CSS/JS) → Backend (/chat) → OpenRouter API
                                           ↑
                                API key stored securely here
```

* The frontend communicates **only with the backend**
* The backend handles all AI API requests securely

---

## API and Model

**API:** OpenRouter
**Model:** openai/gpt-4o-mini

**Why backend only:**
If the API key is placed in frontend JavaScript, it becomes visible in browser DevTools and can be copied and misused by anyone. By routing requests through a backend server, the key remains hidden and secure, preventing unauthorized usage and potential billing abuse.

**Fallback provider:**
Google Gemini API (free tier)

**Required changes to switch:**

1. Change base URL to:

   ```
   https://generativelanguage.googleapis.com/v1beta/openai/
   ```

2. Change model name to:

   ```
   gemini-1.5-flash
   ```

---

## Live Deployment

**Frontend:** https://your-app.netlify.app
**Backend:** https://your-api.onrender.com

---

## How to Run Locally

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
OPENROUTER_API_KEY=your_api_key_here
PORT=3000
```

Start server:

```bash
npm start
```

---

### Frontend Setup

* Open `frontend/index.html` in your browser
  OR
* Use VS Code Live Server

---

## Example Usage

1. Ask: *"What is JavaScript?"*
2. Then ask: *"Give me an example of that"*

👉 The chatbot will respond with a **context-aware answer**

---

## Security Notes

* API keys are stored in `.env` and never exposed to the frontend
* `.env` is excluded using `.gitignore`
* All AI calls are handled server-side

---

## Future Improvements

* Add user authentication
* Store chat history in a database
* Add streaming responses for faster UX
* Improve UI/UX with typing indicators

---

## Conclusion

This project demonstrates:

* Full-stack AI integration
* Secure API handling
* Context-aware chatbot design

It follows best practices for building production-ready AI applications.
