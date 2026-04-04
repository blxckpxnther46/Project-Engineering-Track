# Vibe vs Pair Programming — Task Manager App

This project compares two AI-assisted development approaches by building the same Task Manager application twice:

- **Vibe Coding** — using a generative tool (v0)
- **AI Pair Programming** — using an inline assistant (GitHub Copilot)

The goal is to evaluate both approaches across speed, control, code quality, explainability, and editability.

---

## The App You Are Building

A simple Task Manager with the following features:

- Add a task
- Mark a task as complete
- Filter tasks (All / Active / Completed)
- Clean and usable UI

Both versions implement the exact same features.

---

## Project Structure

- `/vibe-version` → Generated using vibe tool  
- `/pair-version` → Built manually with AI assistance  

---

## Live Deployments

- Vibe version: https://your-vibe-link.netlify.app  
- Pair version: https://your-pair-link.netlify.app  

---

## Comparison Table

| Dimension | Vibe Version (v0) | Pair Version (Copilot) | Verdict |
| :--- | :--- | :--- | :--- |
| **Speed** | Full app generated in ~10 minutes with UI and logic automatically | Took ~35 minutes building step-by-step with AI suggestions | Vibe |
| **Control** | Limited control — structure and logic auto-generated | Full control over logic, structure, and functions | Pair |
| **Code Quality** | Large components and some redundant logic across files | Cleaner, modular structure with smaller functions | Pair |
| **Explainability** | Hard to explain some generated logic and hooks | Easy to explain every function since I wrote it | Pair |
| **Editability** | Difficult to modify — logic spread across multiple files | Easy to modify — centralized logic and clear structure | Pair |

---

## When I Would Use Each Tool

**Vibe coding tool for:**  
Quick prototypes, demos, and UI experiments — because it generates a complete working app in minutes.

**AI pair programming for:**  
Production-ready applications — because I understand and control every line of code, making debugging and modifications easier.

---

## Tools Used

- **Vibe tool used:** v0 by Vercel  
- **Pair tool used:** GitHub Copilot  

---

## Key Observation

The vibe tool was significantly faster in generating a working application, but the code was harder to understand and modify. The pair programming approach took longer but resulted in better structured, maintainable, and explainable code.

