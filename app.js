// Medicine Reminder Tracker - skeleton
// Features (add form, checklist, statuses, persistence) come in later steps.

const STORAGE_KEY = "medicineTracker";

// Returns today's date as YYYY-MM-DD in the user's LOCAL time zone.
function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Loads saved data, falling back to an empty state if nothing is saved
// or the saved data is corrupted.
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { medicines: [], taken: {} };
    const data = JSON.parse(raw);
    return {
      medicines: Array.isArray(data.medicines) ? data.medicines : [],
      taken: data.taken && typeof data.taken === "object" ? data.taken : {},
    };
  } catch (error) {
    console.error("Could not read saved data:", error);
    return { medicines: [], taken: {} };
  }
}

function render() {
  const data = loadData();

  document.getElementById("today-date").textContent =
    new Date().toLocaleDateString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

  const emptyState = document.getElementById("empty-state");
  emptyState.classList.toggle("hidden", data.medicines.length > 0);
}

render();