# PR Auto Writer

## The Problem

I kept getting my pull requests rejected because my descriptions were unclear or incomplete. Every time I opened a PR, I had to manually explain what I changed, why I changed it, and what impact it had. This process took me around **10–15 minutes per PR**, especially when the diff was large.

This problem is common for developers working in teams, where poorly written PR descriptions slow down code reviews and cause back-and-forth comments.

---

## What It Does

The user pastes a **git diff** into the application.
The system sends this diff to an AI model, which transforms it into a **clean, structured, professional PR description**.

Instead of manually writing explanations, the user instantly gets:

* Summary of changes
* Key modifications
* Clear description suitable for review

---

## AI Integration

**API:** OpenRouter
**Model:** openai/gpt-4o-mini

**Location:**
The AI call is implemented in:

```
backend/server.js → /generate route
```

**Functionality:**
The backend receives the git diff from the frontend, sends it to the OpenRouter API, and returns a generated PR description.

**What the AI does:**
It converts raw git diff data into a structured, human-readable PR description.

---

## What I Intentionally Excluded

* **No user authentication**
  This tool is session-based and does not require user accounts. Adding authentication would significantly increase complexity without improving the core functionality.

* **No database / history storage**
  The tool does not save past PRs. The goal is quick generation, not long-term storage.

* **No rich editor or formatting tools**
  The output is plain text to keep the UI simple and focused. Adding editors would increase development time without improving core value.

---

## Monthly Cost Calculation

Model: openai/gpt-4o-mini
Input cost: $0.15 per 1M tokens
Output cost: $0.60 per 1M tokens

Average tokens per request:

* Input: ~600 tokens
* Output: ~400 tokens

Cost per request:
(600 / 1,000,000 × $0.15) + (400 / 1,000,000 × $0.60)
= $0.000090 + $0.000240
= **$0.000330 per request**

Expected monthly usage: 300 requests

Monthly total:
300 × $0.000330 = **$0.099 (~$0.10 per month)**

---

## Live Deployment

Frontend: https://blxckpxnther46.github.io/Project-Engineering-Track/Milestone%201/Challenge%208/frontend/
Backend: https://project-engineering-track.onrender.com/
