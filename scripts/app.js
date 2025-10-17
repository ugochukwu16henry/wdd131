/* script.js
   Shared JS for index, resources, about pages.
   - multiple functions
   - DOM selection + events
   - conditional branching
   - objects/arrays + array methods
   - template literals used for HTML strings
   - localStorage usage
*/

/* ---------- Sample data ---------- */
const STORIES = [
  {
    id: 1,
    title: "Weekly family dinners saved us",
    summary: "A simple weekly meal created consistent conversation and trust.",
  },
  {
    id: 2,
    title: "Listening instead of fixing",
    summary: "Active listening reduced arguments and increased empathy.",
  },
  {
    id: 3,
    title: "Small rituals, big change",
    summary: "A 10-minute bedtime ritual improved closeness and routine.",
  },
];

const RESOURCES = [
  {
    id: "r1",
    title: "Active Listening Exercise",
    category: "communication",
    readTime: "5 min",
  },
  {
    id: "r2",
    title: "Positive Parenting Tips",
    category: "parenting",
    readTime: "8 min",
  },
  {
    id: "r3",
    title: "Conflict Resolution Script",
    category: "conflict",
    readTime: "3 min",
  },
  {
    id: "r4",
    title: "Weekend Family Challenge",
    category: "activities",
    readTime: "12 min",
  },
  {
    id: "r5",
    title: "Quick Daily Check-in",
    category: "communication",
    readTime: "2 min",
  },
];

/* ---------- Initialization ---------- */
document.addEventListener("DOMContentLoaded", () => {
  setYears();
  setupTipButton();
  renderStoriesIfNeeded();
  renderResourcesIfNeeded();
  setupResourceFilters();
  setupSignupForm();
  setupContactForm();
});

/* ---------- Utility functions ---------- */
function setYears() {
  const y = new Date().getFullYear();
  document.querySelectorAll("#year, #year2, #year3").forEach((el) => {
    if (el) el.textContent = y;
  });
}

/* ---------- Tips (random) ---------- */
const TIPS = [
  "Have a weekly device-free family meal.",
  "Ask open questions and listen with curiosity.",
  "Schedule one short bonding activity each week.",
  "Use 'I' statements during conflict.",
  "Celebrate one small win together every day.",
];

function setupTipButton() {
  const btn = document.getElementById("getTip");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const tip = pickRandom(TIPS);
    const out = document.getElementById("tipOutput");
    if (out) out.textContent = `💡 Tip: ${tip}`;
  });
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ---------- Stories rendering (template literals) ---------- */
function renderStoriesIfNeeded() {
  const grid = document.getElementById("storiesGrid");
  if (!grid) return;
  // Use map + join to build HTML
  grid.innerHTML = STORIES.map((s) => storyCardHTML(s)).join("");
  // event delegation for 'save' buttons
  grid.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".story-save");
    if (!btn) return;
    const id = btn.dataset.id;
    saveToLocalArray("savedStories", id);
    btn.textContent = "Saved";
    btn.disabled = true;
  });
}

function storyCardHTML(s) {
  // template literal used exclusively
  return `
    <article class="story-card" tabindex="0" aria-labelledby="story-${s.id}">
      <h3 id="story-${s.id}">${s.title}</h3>
      <p>${s.summary}</p>
      <button class="story-save" data-id="${s.id}">Save</button>
    </article>
  `;
}

/* ---------- Resources rendering, search, filters ---------- */
function renderResourcesIfNeeded() {
  const grid = document.getElementById("resourceGrid");
  if (!grid) return;
  grid.innerHTML = RESOURCES.map((r) => resourceCardHTML(r)).join("");
  // Set saved state from localStorage
  const saved = JSON.parse(localStorage.getItem("savedResources") || "[]");
  saved.forEach((id) => {
    const btn = grid.querySelector(`button[data-id="${id}"]`);
    if (btn) {
      btn.textContent = "Saved";
      btn.disabled = true;
    }
  });
  // event delegation for save buttons
  grid.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".resource-save");
    if (!btn) return;
    const id = btn.dataset.id;
    saveToLocalArray("savedResources", id);
    btn.textContent = "Saved";
    btn.disabled = true;
  });
}

function resourceCardHTML(r) {
  return `
    <article class="resource-card" data-id="${r.id}" tabindex="0" aria-label="${r.title}">
      <h3>${r.title}</h3>
      <p class="meta">${r.category} • ${r.readTime}</p>
      <div class="card-actions">
        <a href="#" class="btn-light" aria-label="Open ${r.title}">Open</a>
        <button class="resource-save" data-id="${r.id}">Save</button>
      </div>
    </article>
  `;
}

function setupResourceFilters() {
  const catBtns = Array.from(document.querySelectorAll(".cat-btn"));
  const search = document.getElementById("searchInput");
  // category filtering
  catBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      const results =
        cat === "all" ? RESOURCES : RESOURCES.filter((r) => r.category === cat);
      updateResourceGrid(results);
    });
  });
  // search behavior
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      const results = RESOURCES.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
      updateResourceGrid(results);
    });
  }
}

function updateResourceGrid(list) {
  const grid = document.getElementById("resourceGrid");
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = `<p class="no-results">No matching resources. Try a different keyword.</p>`;
    return;
  }
  grid.innerHTML = list.map((r) => resourceCardHTML(r)).join("");
}

/* ---------- Forms: signup and contact (localStorage) ---------- */
function setupSignupForm() {
  const form = document.getElementById("signupForm");
  if (!form) return;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    // conditional branching: validate
    if (!name || !validateEmail(email)) {
      showMessage(
        "signupMessage",
        "Please enter a valid name and email.",
        true
      );
      return;
    }
    const interests = Array.from(
      form.querySelectorAll('input[name="interest"]:checked')
    ).map((i) => i.value);
    const entry = { name, email, interests, created: new Date().toISOString() };
    saveToLocalArray("subscribers", entry);
    showMessage(
      "signupMessage",
      `Thanks ${name.split(" ")[0]}! You're subscribed.`
    );
    form.reset();
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!name || !validateEmail(email)) {
      showMessage("contactMsg", "Please enter a valid name and email.", true);
      return;
    }
    const message = form.message.value.trim();
    const contact = { name, email, message, at: new Date().toISOString() };
    saveToLocalArray("contacts", contact);
    showMessage("contactMsg", "Message received — thank you!");
    form.reset();
  });
}

/* ---------- small helpers ---------- */
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function showMessage(elementId, text, isError = false) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = `<div class="${
    isError ? "msg-error" : "msg-success"
  }">${text}</div>`;
  setTimeout(() => {
    el.innerHTML = "";
  }, 3500);
}

/* ---------- localStorage helpers ---------- */
function saveToLocalArray(key, item) {
  // read, push (if not duplicate for string ids), write
  const raw = localStorage.getItem(key);
  let arr = raw ? JSON.parse(raw) : [];
  // if item is primitive id string, avoid duplicates
  if (typeof item === "string" || typeof item === "number") {
    if (!arr.includes(item)) arr.push(item);
  } else {
    arr.push(item);
  }
  localStorage.setItem(key, JSON.stringify(arr));
}

/* ---------- small accessibility improvements: keyboard focus for cards ---------- */
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Enter" && document.activeElement) {
    const btn =
      document.activeElement.querySelector &&
      document.activeElement.querySelector("button");
    if (btn) btn.click();
  }
});



