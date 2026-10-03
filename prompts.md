# Prompt Log

**Project:** Medicine Reminder Tracker
**Tool used:** Claude (chat) in the browser, with files copied into VS Code manually
**Date:** 2026-10-03

---

## Phase 1: Ideation

**Prompt:**
I'm a beginner with 3 hours. Theme: "Make the Boring Thing Better." Suggest 3 simple project ideas, each buildable as a single-page web app with no backend. For each, give the target user, the core feature, and one risk. Then recommend one.

**Result:**
Got 3 ideas (Bill Splitter, Study Planner, Medicine Tracker), each with a user, core feature, and risk. The AI recommended the Bill Splitter, but I chose the Medicine Tracker because [your real reason]. I noted its main risk (browser notifications are unreliable), so I decided to build an on-screen checklist only and skip alerts.

---

## Phase 2: Planning

**Prompt:**
I choose the Medicine Reminder Tracker. Write a PLAN.md with: goal, target user (elderly people and caregivers), must-have features (max 4): add medicine with name/dose/times, today's checklist sorted by time, persistence via localStorage with automatic daily reset, and status indicators (upcoming/due/overdue/taken). Include nice-to-have features, tech stack (plain HTML/CSS/JS, no libraries), file structure, a data model (medicine IDs, times as HH:MM, taken-status keyed by date), and a "definition of done." Keep it small enough for a beginner to finish in 3 hours. Add a note that the app is not medical advice.

**Result:**
Got a complete PLAN.md with 4 must-have features, a data model, status rules, edge cases, and a 7-step build order. I kept the scope as it was. I briefly considered switching to Python and FastAPI, but decided to stay with plain HTML/CSS/JS and localStorage because it is simpler and fits a 3-hour beginner build. Saved PLAN.md in the project root and made my first commit.

---

## Phase 3: Building

### Skeleton

**Prompt:**
Read PLAN.md. Create only the project skeleton (index.html, style.css, app.js) with the "not medical advice" disclaimer and an empty-state message. Don't implement features yet. Tell me how to run it.

**Result:** Worked first try
Got index.html, style.css, and app.js. Opened index.html in the browser and saw the title, today's date, the disclaimer, and the empty-state message. Helper functions for the date key (local time) and safe localStorage loading were already included.

### Feature 1: Add-medicine form

**Prompt:**
Context: The skeleton from PLAN.md is running with loadData() and an empty-state message. Task: Add a form to create a medicine with name (required), dose (free text), and one or more times in HH:MM format, with validation (name required, at least one time, no duplicate times). Save to localStorage with a unique ID using the data model in PLAN.md. Constraints: Plain JavaScript, no libraries, keep existing helper functions. Don't build the checklist yet.

**Result:** [Worked / needed fix. Say what you tested: empty form shows an error, duplicate time is rejected, saved medicine survives a page refresh.]
**Follow-up prompt (if any):**
[paste, or delete this line if none]

### Feature 2: Today's checklist
**Prompt:**
Context: add-medicine form works and saves to localStorage. Task: show today's checklist, one row per medicine per time, sorted by time, with checkboxes. Ticking saves the dose as medicineId@HH:MM under today's date. Constraints: plain JS, keep existing functions, no status colours yet, re-render every minute so the date updates after midnight.

**Result:**
The checklist shows one row per medicine per time, sorted by time. Ticking a dose saves it under today's date and it stays ticked after a page refresh. Because taken doses are keyed by date, the next day starts with all boxes empty while the medicine list stays saved. Committed as "Add today's checklist with tickable doses" and pushed to GitHub.

---

## Phase 4: Debugging

**Problem:**
[what went wrong, expected vs actual]

**Prompt:**
[paste]

**Lesson learned:**
[one line]

---

## Phase 5: Polish

**Prompt:**
[README, UI cleanup, etc.]

**Result:**