// Medicine Reminder Tracker
// Features: add-medicine form, today's checklist, status indicators.

const STORAGE_KEY = "medicineTracker";
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:MM, 24-hour

const STATUS_LABELS = {
  taken: "✓ Taken",
  upcoming: "Upcoming",
  due: "Due now",
  overdue: "Overdue",
};

// Times the user has added to the form but not yet saved.
let pendingTimes = [];

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

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Could not save data:", error);
    return false;
  }
}

function showError(message) {
  document.getElementById("form-error").textContent = message;
}

// ----- Times chosen in the form -----

function renderPendingTimes() {
  const list = document.getElementById("pending-times");
  list.textContent = "";

  pendingTimes.forEach((time) => {
    const chip = document.createElement("li");
    chip.textContent = time + " ";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "chip-remove";
    removeBtn.textContent = "×";
    removeBtn.setAttribute("aria-label", `Remove ${time}`);
    removeBtn.addEventListener("click", () => {
      pendingTimes = pendingTimes.filter((t) => t !== time);
      renderPendingTimes();
    });

    chip.appendChild(removeBtn);
    list.appendChild(chip);
  });
}

function handleAddTime() {
  const timeInput = document.getElementById("time");
  const value = timeInput.value;

  if (!TIME_PATTERN.test(value)) {
    showError("Please choose a valid time.");
    return;
  }
  if (pendingTimes.includes(value)) {
    showError(`${value} is already added.`);
    return;
  }

  pendingTimes.push(value);
  pendingTimes.sort(); // "HH:MM" strings sort correctly as text
  timeInput.value = "";
  showError("");
  renderPendingTimes();
}

// ----- Saving a medicine -----

function handleSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const dose = document.getElementById("dose").value.trim();

  if (!name) {
    showError("Please enter the medicine name.");
    return;
  }
  if (pendingTimes.length === 0) {
    showError("Please add at least one time.");
    return;
  }

  const data = loadData();
  data.medicines.push({
    id: "m_" + Date.now(),
    name: name,
    dose: dose,
    times: [...pendingTimes],
  });

  if (!saveData(data)) {
    showError("Could not save. Your browser storage may be disabled.");
    return;
  }

  // Reset the form
  document.getElementById("medicine-form").reset();
  pendingTimes = [];
  renderPendingTimes();
  showError("");
  render();
}

// ----- Today's checklist -----

// Builds one entry per medicine per time, sorted by time.
function buildTodaysDoses(medicines) {
  const doses = [];
  medicines.forEach((med) => {
    med.times.forEach((time) => {
      doses.push({
        key: `${med.id}@${time}`,
        name: med.name,
        dose: med.dose,
        time: time,
      });
    });
  });
  doses.sort((a, b) => a.time.localeCompare(b.time) || a.name.localeCompare(b.name));
  return doses;
}

function toggleDose(doseKey) {
  const data = loadData();
  const today = getTodayKey();
  const takenToday = data.taken[today] || [];

  if (takenToday.includes(doseKey)) {
    data.taken[today] = takenToday.filter((k) => k !== doseKey);
  } else {
    data.taken[today] = [...takenToday, doseKey];
  }

  saveData(data);
  render();
}

// Decides a dose's status. Kept separate (and takes `now` as an argument)
// so it is easy to test with fake times.
// Returns: "taken", "upcoming", "due", or "overdue".
function getDoseStatus(time, isTaken, now = new Date()) {
  if (isTaken) return "taken";

  const [hours, minutes] = time.split(":").map(Number);
  const scheduledMinutes = hours * 60 + minutes;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const minutesPast = nowMinutes - scheduledMinutes;

  if (minutesPast < 0) return "upcoming";
  if (minutesPast <= 60) return "due";
  return "overdue";
}

function renderChecklist(data) {
  const list = document.getElementById("checklist");
  list.textContent = "";

  const takenToday = data.taken[getTodayKey()] || [];
  const doses = buildTodaysDoses(data.medicines);
  const now = new Date();

  doses.forEach((dose) => {
    const isTaken = takenToday.includes(dose.key);
    const status = getDoseStatus(dose.time, isTaken, now);

    const item = document.createElement("li");
    item.className = `dose status-${status}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "dose-" + dose.key;
    checkbox.checked = isTaken;
    checkbox.addEventListener("change", () => toggleDose(dose.key));

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    const doseText = dose.dose ? ` (${dose.dose})` : "";
    label.textContent = `${dose.time}  ${dose.name}${doseText}`;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = STATUS_LABELS[status];

    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(badge);
    list.appendChild(item);
  });

  document
    .getElementById("checklist-empty")
    .classList.toggle("hidden", doses.length > 0);
}

// ----- Display -----

function renderSavedList(medicines) {
  const list = document.getElementById("saved-list");
  list.textContent = "";

  medicines.forEach((med) => {
    const item = document.createElement("li");
    const doseText = med.dose ? ` (${med.dose})` : "";
    item.textContent = `${med.name}${doseText} at ${med.times.join(", ")}`;
    list.appendChild(item);
  });
}

function render() {
  const data = loadData();

  document.getElementById("today-date").textContent =
    new Date().toLocaleDateString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

  renderChecklist(data);
  renderSavedList(data.medicines);
  document
    .getElementById("empty-state")
    .classList.toggle("hidden", data.medicines.length > 0);
}

document.getElementById("add-time-btn").addEventListener("click", handleAddTime);
document.getElementById("medicine-form").addEventListener("submit", handleSubmit);
render();

// Refresh every minute so statuses update and the date rolls over at midnight.
setInterval(render, 60 * 1000);