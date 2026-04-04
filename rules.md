# Logomancy — Project Rules

A minimalist mastery-based web app for learning and using eloquent vocabulary from classic literature (Lovecraft, McCarthy, Tolkien, etc.).

**Target User:** Personal use (Software Engineer) — later opened to public users.

**Styling Goal:** Standard ionic components. nothing fancy. **No custom CSS** until functionality is 100% verified.

**Tech Stack:** Ionic + React + Capacitor

---

## 1. Core Data Structures

### Static Library

- A JSON array of word objects.
- Each object contains: `word`, `phonetic`, `definition`, `examples` (array of 2), `source`.

### User State (@ionic/storage)

| Key              | Type    | Description                                              |
| ---------------- | ------- | -------------------------------------------------------- |
| `mastered_count` | Integer | Total number of words mastered.                          |
| `active_stack`   | Array   | Exactly 2–3 word objects currently being practiced.      |
| `history`        | Array   | Archive of mastered word IDs with their usage timelines. |

---

## 2. Functional Requirements (The Do's)

### Active Stack Limit

- Strictly enforce a maximum of **3 words** in the "In Progress" view.

### The 5-Use Rule

- Each word in the stack must be "used" **5 times** to move to "Mastered."

### The Usage Logger

- Provide **4 distinct icon buttons** per active word: 💬 📧 🛠️ 📦
- Clicking an icon must:
  - Increment the use count for that word.
  - Capture the **timestamp** and the **context** (icon type).

### The "In Progress" Timer

- Display **"In progress since [Date]"** for every word in the active stack.

### The Replenishment Logic

- Only show a **"Summon New Word"** button if the active stack size is **< 3**.

### The Skip Mechanic

- Allow a word to be **removed** from the stack (resetting its progress) to free up a slot.

### Persistent Storage

- Every state change (adding a word, logging a use, mastering a word) must **sync immediately** to `@ionic/storage`.

---

## 3. Constraints (The Don'ts)

| Rule                       | Detail                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| **No Fancy UI/UX**         | No animations, transitions, or custom themes. Use standard `<button>`, `<ul>`, `<h3>` tags. |
| **No External Database**   | Strictly use `@ionic/storage` for now.                                                     |
| **No User Accounts**       | No login, no profile, no cloud sync.                                                       |
| **No Complex Gamification**| No levels, XP, or badges. Only track "Mastered Count" and "Active Stack" status.           |
| **No Automated Content**   | No dictionary API. Pull exclusively from the curated local JSON library. (API deferred.)   |

---

## 4. Required Views

### Dashboard

- Shows **"Mastered: X"** and **"Active Stack: Y/3"**.
- Contains the **"Summon"** button if stack < 3.

### Active View

- A vertical list of the 2–3 word cards currently being practiced.
- Each card shows: word, phonetic, definition, examples, source, usage icons, progress, and "in progress since" date.

### Timeline View (Internal)

- The data structure must support viewing the **timestamp** and **context** of every use for a specific word.
- This view can be surfaced later; the underlying data must be captured from day one.
