# Prompt Log

**Project:** Medicine Reminder Tracker
**Tool used:** Claude (chat) in the browser, with files copied into VS Code manually
**Date:** 2026-10-03
**Theme practised:** "Make the Boring Thing Better" (3-hour practice run)

---

## Phase 1: Ideation

**Prompt:**
I'm a beginner with 3 hours. Theme: "Make the Boring Thing Better." Suggest 3 simple project ideas, each buildable as a single-page web app with no backend. For each, give the target user, the core feature, and one risk. Then recommend one.

**Result:**
Got 3 ideas (Bill Splitter, Study Session Planner, Medicine Reminder Tracker), each with a target user, core feature, and risk. The AI recommended the Bill Splitter, but I chose the Medicine Reminder Tracker because it serves a real group of users (elderly people and their caregivers) and has a clear daily purpose. I noted its main risk (browser notifications are unreliable), so I decided to build an on-screen checklist only and skip alerts.

---

## Phase 2: Planning

**Prompt:**
I choose the Medicine Reminder Tracker. Write a PLAN.md with: goal, target user (elderly people and caregivers), must-have features (max 4): add medicine with name/dose/times, today's checklist sorted by time, persistence via localStorage with automatic daily reset, and status indicators (upcoming/due/overdue/taken). Include nice-to-have features, tech stack (plain HTML/CSS/JS, no libraries), file structure, a data model (medicine IDs, times as HH:MM, taken-status keyed by date), and a "definition of done." Keep it small enough for a beginner to finish in 3 hours. Add a note that the app is not medical advice.

**Result:**
Got a complete PLAN.md with 4 must-have features, a data model, status rules, edge cases, and a 7-step build order. I kept the scope as it was. I briefly considered switching to Python and FastAPI, but decided to stay with plain HTML/CSS/JS and localStorage because it is simpler and fits a 3-hour beginner build. Saved the plan in the project root and made my first commit.

---

## Phase 3: Building

### Skeleton

**Prompt:**
Read PLAN.md. Create only the project skeleton (index.html, style.css, app.js) with the "not medical advice" disclaimer and an empty-state message. Don't implement features yet. Tell me how to run it.

**Result:** Worked first try.
Got index.html, style.css, and app.js. Opened index.html in the browser and saw the title, today's date, the disclaimer, and the empty-state message. Helper functions for the date key (local time) and safe localStorage loading were already included.

### Feature 1: Add-medicine form

**Prompt:**
Context: The skeleton from PLAN.md is running with loadData() and an empty-state message. Task: Add a form to create a medicine with name (required), dose (free text), and one or more times in HH:MM format, with validation (name required, at least one time, no duplicate times). Save to localStorage with a unique ID using the data model in PLAN.md. Constraints: Plain JavaScript, no libraries, keep existing helper functions. Don't build the checklist yet.

**Result:** Worked.
The form validates input and shows a red error message when something is missing. A saved medicine is stored in localStorage with a unique ID and still appears after a page refresh. I later found a usability problem with the "Add time" step (see Phase 4, problem 3).

**Follow-up prompt:** None needed at this stage.

### Feature 2: Today's checklist

**Prompt:**
Context: The add-medicine form works and saves to localStorage. Task: Show today's checklist, one row per medicine per time, sorted by time, with checkboxes. Ticking a dose saves it as medicineId@HH:MM under today's date. Constraints: Plain JS, keep existing functions, no status colours yet, re-render every minute so the date updates after midnight.

**Result:** Worked.
The checklist shows one row per medicine per time, sorted by time. Ticking a dose saves it under today's date and it stays ticked after a page refresh. Because taken doses are keyed by date, the next day starts with all boxes empty while the medicine list stays saved. Committed as "Add today's checklist with tickable doses" and pushed to GitHub.

### Feature 3: Status indicators

**Prompt:**
Context: The checklist works, with doses sorted by time and tick boxes saved by date. Task: Add a status to each dose: taken, upcoming, due (0 to 60 minutes past, not ticked), overdue (more than 60 minutes past, not ticked). Show the status as a text label plus a colour, not colour alone. Constraints: Plain JS, keep existing functions, put the status logic in one separate function so it's easy to test. The existing minute refresh should update statuses automatically.

**Result:** Needed a fix.
The status logic and badges were correct, but my paste left a duplicate function line that broke form saving (see Phase 4, problem 1). After the fix, each dose shows the right status badge (Upcoming, Due now, Overdue, Taken), and ticking a dose turns it green and marks it as taken.

### Feature 4: Delete medicine (nice-to-have)

**Prompt:**
Context: All 4 must-have features work. Task: Add a Delete button next to each saved medicine, with a confirmation before deleting. Constraints: Plain JS, keep existing functions. Deleting a medicine removes it from today's checklist; previous taken-history entries can stay.

**Result:** Worked, after a fix.
The first paste caused the same Save problem again (see Phase 4, problem 2). After replacing the whole `app.js` file, delete works: a confirmation appears, the medicine disappears from both lists, and it stays deleted after a refresh.

### Feature 5: Progress summary (nice-to-have)

**Prompt:**
Context: All 4 must-haves plus delete work. Task: Show a progress line above the checklist, such as "3 of 5 doses taken today", with a progress bar. Constraints: Plain JS, keep existing functions, only count doses that exist today so deleted medicines don't affect the total.

**Result:** Worked.
The progress text and bar update as I tick doses. When every dose is taken, the text changes to a "well done" message. The total drops when I delete a medicine, and the progress block hides when there are no medicines.

---

## Phase 4: Debugging

### Problem 1: Save button stopped working after adding status indicators

**Problem:**
After adding status indicators, the Save medicine button stopped working and the page showed no medicines. Expected: the medicine saves and appears in the checklist. Actual: nothing happened, and the Console showed no errors (only an unrelated favicon 404).

**Prompt:**
I can't add a medicine. [I then shared my full app.js after being asked for it.]

**Fix and lesson learned:**
When replacing a function, I left the old first line behind, so the rest of the file was nested inside a function that never ran. Missing console errors can still mean broken structure. Replace functions completely, and paste changes one at a time, refreshing after each.

### Problem 2: Same symptom after adding delete

**Problem:**
The same symptom came back after adding the delete feature: Save did nothing and there was no console error.

**Prompt:**
Again same problem, I can't add a medicine.

**Fix and lesson learned:**
The cause was again a partial paste when replacing a function. I fixed it by replacing the entire `app.js` file instead of patching pieces. For multi-part changes, replace whole files, and commit a working state before each new feature so `git checkout` can restore it.

### Problem 3: Confusing two-step time input (usability issue)

**Problem:**
I selected a valid time (03:24) in the time field and clicked Save, but got "Please add at least one time." Expected: the medicine saves. Actual: the time was never added to the list because I hadn't clicked the separate "Add time" button.

**Prompt:**
What's wrong with this time? I entered a correct time but it still shows "Please add at least one time." [I attached a screenshot.]

**Fix and lesson learned:**
The app worked as designed, but the two-step flow is confusing for the target users. Fix: Save now also accepts a valid time typed in the box, and a hint explains how to add more than one time. Testing my own app as a first-time user exposed a usability gap that checking the code alone missed.

### Git issues (not code bugs)

**Problem:**
The first push was rejected because GitHub's repo already contained a commit I didn't have locally (the placeholder README). A second push was rejected after I edited the README on github.com.

**Fix and lesson learned:**
Pulling the remote changes first (`git pull`) and then pushing fixed both. Edit files in one place only, or pull before working locally.

---

## Phase 5: Polish

### README

**Prompt:**
Context: All features work (add medicine, today's checklist, status indicators, delete, progress summary) and are committed to GitHub. Task: Write a README.md with: a one-line pitch, problem, solution, features, how to run, tech stack, a "How I used AI" section, and limitations/future improvements. Include a "not medical advice" note and a screenshot placeholder. Constraints: Only list features that actually exist in the app. Keep the language simple and honest.

**Result:**
Got a complete README. I replaced GitHub's placeholder README with it and edited the "How I used AI" section to describe my real bugs (a paste error that broke saving, and a confusing two-step time input). I left 7-day history under "Future improvements" because I decided not to build it, to keep the scope small.

### UI redesign

**Prompt:**
Context: All features work and are committed. Task: Redesign the UI with a colour palette, gradient header, an inline SVG illustration, emoji icons, card layout, and clearer status colours. Constraints: Plain HTML/CSS, no libraries or external images, keep all element IDs so the JavaScript still works, keep status labels as text plus colour for accessibility.

**Result:** Worked.
I committed a working version first as a restore point. After replacing `index.html` and `style.css` and updating the status labels, add, tick, and delete all still worked, and the interface looks much cleaner and more colourful than before.

### Screenshot and final repo check

**Result:**
Added `screenshot.png` showing the app with real data and linked it in the README. Cloned the repo into a fresh folder to check that it downloads cleanly. Reviewed the repo and prompt log and cleaned up leftover placeholders.