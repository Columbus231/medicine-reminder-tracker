# Medicine Reminder Tracker

> **Note:** This app is a personal reminder tool, **not medical advice**. Always follow your doctor's or pharmacist's instructions.

## Goal
Help people remember to take their daily medicines by showing a simple, clear checklist of today's doses, so nothing gets missed.

## Target user
- **Elderly people** managing several medicines a day, who need large text and a simple screen.
- **Caregivers** (family members) who set up the medicine list and check that today's doses were taken.

## Must-have features (max 4)
1. **Add a medicine**: name, dose (free text, e.g. "1 tablet"), and one or more times of day.
2. **Today's checklist**: all doses for today, sorted by time, each with a tick box.
3. **Persistence + daily reset**: data saved in `localStorage`; each new day starts with all doses unticked, while the medicine list is kept.
4. **Status indicators** for each dose: `upcoming`, `due`, `overdue`, or `taken` (shown with both colour and text/icon).

## Nice-to-have (only if time remains, in this order)
1. Delete and edit a medicine
2. Progress summary ("3 of 5 doses taken today")
3. Large-text mode toggle
4. Simple 7-day history

## Out of scope (list under "Future improvements" in the README)
- Push notifications or alarms
- User accounts or cloud sync
- Drug information or interaction checks

## Tech stack
- Plain **HTML, CSS, javascript** (no frameworks, no libraries)
- Browser `localStorage` for saving data
- No backend, no build step: open `index.html` to run

## File structure
```
medicine-reminder/
├── index.html      # page layout, form, checklist container, disclaimer
├── style.css       # styles, status colours, large readable text
├── app.js          # all logic: state, rendering, events, storage
├── PLAN.md         # this file
├── prompts.md      # prompt log
└── README.md       # problem, features, how to run, how I used AI
```

## Data model

Stored in `localStorage` under one key: `medicineTracker`.

```json
{
  "medicines": [
    {
      "id": "m_1727950000000",
      "name": "Metformin",
      "dose": "1 tablet",
      "times": ["08:00", "20:00"]
    }
  ],
  "taken": {
    "2026-10-03": ["m_1727950000000@08:00"]
  }
}
```

**Rules**
- `id`: unique per medicine (e.g. `"m_" + Date.now()`), never reused, so edits/deletes don't break saved status.
- `times`: strings in 24-hour `"HH:MM"` format, which sort correctly as plain text.
- `taken`: keyed by date `"YYYY-MM-DD"` (local date, not UTC). Each entry is `medicineId@HH:MM`, which identifies one specific dose.
- **Daily reset** happens naturally: a new date has no key yet, so every dose shows as untaken. The medicine list is untouched.

## Status logic

For each dose today, compare its time to the current time:

| Status | Condition |
|---|---|
| `taken` | dose key exists in `taken[today]` |
| `upcoming` | not taken, and scheduled time is in the future |
| `due` | not taken, and now is 0 to 30 minutes past the scheduled time |
| `overdue` | not taken, and more than 30 minutes past the scheduled time |

Re-check statuses every minute with `setInterval` and re-render.

## Edge cases to handle
- Empty state: friendly message when no medicines exist yet
- Form validation: name required, at least one time, no duplicate times for the same medicine
- Corrupted or missing `localStorage` data: fall back to an empty state instead of crashing
- Page left open past midnight: detect the date change and refresh the checklist

## Build order (for the 3-hour plan)
1. Skeleton page with disclaimer and empty state *(commit)*
2. Add-medicine form with validation, saving to `localStorage` *(commit)*
3. Render today's checklist sorted by time *(commit)*
4. Tick/untick doses, saved by date *(commit)*
5. Status indicators and the 1-minute refresh *(commit)*
6. Test edge cases and fix bugs *(commit)*
7. Nice-to-haves if time allows, then README and prompt log polish *(commit)*

## Definition of done
- [ ] Runs by opening `index.html` from a fresh clone, with no install steps
- [ ] A medicine with multiple times can be added and appears in today's checklist, sorted by time
- [ ] Ticking a dose marks it `taken` and survives a page refresh
- [ ] Changing the system date (or using a different date key) shows an all-untaken checklist, with medicines still saved
- [ ] `upcoming`, `due`, `overdue`, and `taken` all display correctly and are distinguishable without relying on colour alone
- [ ] Empty state and invalid form input are handled without errors
- [ ] "Not medical advice" note is visible on the page
- [ ] README has a screenshot, run instructions, and an "How I used AI" section
- [ ] `prompts.md` is complete and the repo has regular, meaningful commits