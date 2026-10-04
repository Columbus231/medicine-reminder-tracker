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


### Feature 3: Status indicators

**Prompt:**
Context: The checklist works, with doses sorted by time and tick boxes saved by date. Task: Add a status to each dose: taken, upcoming, due (0 to 60 minutes past, not ticked), overdue (more than 60 minutes past, not ticked). Show the status as a text label plus a colour, not colour alone. Constraints: Plain JS, keep existing functions, put the status logic in one separate function so it's easy to test. The existing minute refresh should update statuses automatically.

**Result:** Needed a fix
The status logic and badges worked, but my paste left a duplicate function line that broke form saving. Fixed it (see Phase 4). After the fix, [say what you saw: badges show the right status, ticking turns a dose green, and so on].
---
### Feature 4: Progress summary (nice-to-have)

**Prompt:**
Context: All 4 must-haves plus delete work. Task: Show a progress line above the checklist, such as "3 of 5 doses taken today", with a progress bar. Constraints: plain JS, keep existing functions, only count doses that exist today so deleted medicines don't affect the total.

**Result:** all the test passed.
## Phase 4: Debugging

## Phase 4: Debugging

**Problem:**
After adding status indicators, the Save medicine button stopped working and the page showed no medicines. Expected: medicine saves and appears in the checklist. Actual: nothing happened, and the Console showed no errors (only an unrelated favicon 404).

**Prompt:**
[paste what you asked me, e.g. "I can't add a medicine, console shows nothing. Here is my full app.js."]

**Lesson learned:**
When replacing a function, I left the old first line behind, so the rest of the file was nested inside a function that never ran. Missing errors can still mean broken structure. Replace functions completely, and paste changes one at a time, refreshing after each.

**Second occurrence:**
The same symptom came back after adding the delete feature (Save did nothing, no console error). Cause: again a partial paste when replacing a function. Fix: replaced the entire app.js file instead of patching pieces. Lesson: for multi-part changes, replace whole files, and commit a working state before each new feature so `git checkout` can restore it.

## Phase 4: Debugging (usability issue)

**Problem:**
I selected a valid time (03:24) in the time field and clicked Save, but got "Please add at least one time." Expected: the medicine saves. Actual: the time was never added to the list because I hadn't clicked "Add time".

**Prompt:**
[paste what you asked me, e.g. "I entered a correct time but it still says please add at least one time" plus the screenshot]

**Lesson learned:**
The app was working as designed, but the two-step flow is confusing for the target users. Fix: Save now also accepts a valid time typed in the box. Testing my own app as a first-time user exposed a usability gap that the code tests missed.

### Phase 5: Polish

### README

**Prompt:**
Context: All features work (add medicine, today's checklist, status indicators, delete, progress summary) and are committed to GitHub. Task: Write a README.md with: a one-line pitch, problem, solution, features, how to run, tech stack, a "How I used AI" section, and limitations/future improvements. Include a "not medical advice" note and a screenshot placeholder. Constraints: only list features that actually exist in the app. Keep the language simple and honest.

**Result:**
Got a complete README. I replaced GitHub's placeholder README with it and edited the "How I used AI" section to describe my real bugs (a paste error that broke saving, and a confusing two-step time input). I left 7-day history under "Future improvements" because I decided not to build it, to keep the scope small.

