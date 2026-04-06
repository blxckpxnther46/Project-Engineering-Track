# 🏫 Dorm Marketplace 

Dorm Marketplace is a simple campus marketplace prototype where students can list used items and other students can claim them for in-person pickup.

This project focuses on **correct system behavior under real-world usage**, not production complexity.

---

## 🚀 MVP Overview

This prototype allows users to:

* 📦 List items (books, furniture, etc.)
* 👀 View available listings
* 🤝 Claim an item for pickup
* 🔄 Handle real-world edge cases like conflicts and no-shows

---

## ✂️ Scope Cuts (Not Included)

To keep the MVP focused, the following features were intentionally excluded:

* 💳 Payments → Not required for a prototype; adds unnecessary complexity
* 💬 Chat System → Increases system complexity without improving core flow
* 🚚 Delivery Tracking → Out of scope for in-person exchange model

---

## ✅ MVP Features

* Item listing system
* Real-time item availability tracking
* Claim + reservation system with expiration

---

## 🧪 Acceptance Criteria (Claim Flow)

**1. Successful Claim**

* Given an item is available
* When a user clicks "Claim"
* Then the item becomes reserved

**2. Expired Claim**

* Given an item is reserved
* When the user does not confirm within time
* Then the item becomes available again

**3. Already Claimed**

* Given an item is already reserved or sold
* When another user tries to claim
* Then the system prevents the action

---

## ⚙️ Real-World Scenarios Handled

### 🔥 Scenario 1 — Concurrency Collision

* Only one user can claim an item at a time
* System checks item status before confirming claim

---

### ⏳ Scenario 2 — Ghost Buyer

* Claims expire automatically after a set time (mock timer)
* Expired items return to "available"

---

### 🚪 Scenario 3 — Hallway Sale

* Sellers can manually mark item as sold or remove it
* Ensures real-world actions sync with system state

---

## 🏗️ Tech Stack

* Node.js + Express (Backend)
* Vanilla JavaScript (Frontend)
* In-memory state (No database)

---

## ▶️ How to Run

```bash
npm install
npm start
```

Then open:

```bash
client/index.html
```

---

## 📁 Project Structure

```
client/       → Frontend UI
server/       → Backend logic
PRD.md        → Product requirements
README.md     → Documentation
```

---

## 🎯 Engineering Decisions

* Used in-memory storage to keep system simple
* Implemented state-based logic instead of DB constraints
* Used expiration timers to simulate real-world behavior
* Focused on correctness over UI complexity

---

## 📌 Summary

This project demonstrates:

* Strong product thinking (scope vs MVP)
* Handling of real-world edge cases
* Clean and understandable backend logic
* Correct system behavior under concurrent usage

---

## 🎥 Demo

(Attach your Google Drive video link here)

---

## 🔗 Pull Request

(Attach your GitHub PR link here)

---
