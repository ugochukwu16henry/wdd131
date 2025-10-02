/* app.js
   Implements:
   - multiple functions
   - DOM selection & event listeners
   - objects/arrays, array methods (map, filter)
   - template literals for output
   - localStorage usage
*/

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  renderStories();
  setupSignupForm();
  setupContactForm();
  setupResourcePage();
  restorePreferenceButton();
});

/* ===== utility: set copyright year ===== */
function setYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll("#year, #year2, #year3").forEach((el) => {
    if (el) el.textContent = year;
  });
}

/* ===== Sample data (objects + arrays) ===== */
const STORIES = [
  {
    id: 1,
    title: "Weekly family dinners saved us",
    summary: "A simple weekly meal created a safe place for conversation.",
  },
  {
    id: 2,
    title: "Listening instead of fixing",
    summary: "Shifting to empathic listening reduced fights in our home.",
  },
  {
    id: 3,
    title: "Making small routines",
    summary: "A 10-minute bedtime ritual increased closeness.",
  },
];

const RESOURCES = [
  {
    id: "r1",
    title: "Active Listening Exercise",
    category: "communication",
    length: "5 min",
    url: "#",
  },
  {
    id: "r2",
    title: "Parenting: Positive Reinforcement",
    category: "parenting",
    length: "8 min",
    url: "#",
  },
  {
    id: "r3",
    title: "Conflict Script for Parents",
    category: "conflict",
    length: "3 min",
    url: "#",
  },
  {
    id: "r4",
    title: "Weekend Family Challenge",
    category: "activities",
    length: "10 min",
    url: "#",
  },
  {
    id: "r5",
    title: "Quick Check-in Ritual",
    category: "communication",
    length: "2 min",
    url: "#",
  },
];

/* ===== Render Inspirational Stories (uses template literals) ===== */
function renderStories() {
  const container = document.getElementById("stories-list");
  if (!container) return;
  const html = STORIES.map(
    (s) => `
    <article class="story" tabindex="0" aria-labelledby="story-${s.id}">
      <h3 id="story-${s.id}">${s.title}</h3>
      <p>${s.summary}</p>
      <button data-id="${s.id}" class="save-story">Save</button>
    </article>
  `
  ).join("");
  container.innerHTML = html;

  // Add listener for save buttons using event delegation
  container.addEventListener("click", (e) => {
    if (e.target.matches(".save-story")) {
      const id = Number(e.target.dataset.id);
      saveStoryToLocal(id);
      e.target.textContent = "Saved";
      e.target.disabled = true;
    }
  });
}

/* ===== Save story => localStorage (object + array usage) ===== */
function saveStoryToLocal(id) {
  const saved = JSON.parse(localStorage.getItem("savedStories") || "[]");
  if (!saved.includes(id)) saved.push(id);
  localStorage.setItem("savedStories", JSON.stringify(saved));
}

/* ===== Signup form: validation, localStorage & conditional branching ===== */
function setupSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const familySize = Number(form["family-size"].value) || null;
    const interests = [
      ...form.querySelectorAll('input[name="interest"]:checked'),
    ].map((i) => i.value);

    // basic conditional branching / validation
    if (!name || !validateEmail(email)) {
      showMessage("signup-msg", "Please enter a valid name and email.", true);
      return;
    }

    // build an object and save to localStorage
    const subscriber = {
      name,
      email,
      familySize,
      interests,
      savedAt: new Date().toISOString(),
    };
    saveSubscriber(subscriber);
    showMessage(
      "signup-msg",
      `Thanks, ${name.split(" ")[0]} — you are signed up!`
    );
    form.reset();
  });
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function saveSubscriber(obj) {
  const all = JSON.parse(localStorage.getItem("subscribers") || "[]");
  all.push(obj);
  localStorage.setItem("subscribers", JSON.stringify(all));
}

/* ===== Contact form on About page (another function) ===== */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = form["c-name"].value.trim();
    const email = form["c-email"].value.trim();
    const message = form["c-message"].value.trim();

    if (!name || !validateEmail(email)) {
      showMessage(
        "contact-status",
        "Please enter a valid name and email.",
        true
      );
      return;
    }

    // For the assignment, simulate sending by saving contact to localStorage
    const contact = { name, email, message, at: new Date().toISOString() };
    const stored = JSON.parse(localStorage.getItem("contacts") || "[]");
    stored.push(contact);
    localStorage.setItem("contacts", JSON.stringify(stored));

    showMessage("contact-status", "Message received — thanks!");
    form.reset();
  });
}

/* ===== Generic message rendering (uses template literal) ===== */
function showMessage(elementId, text, isError = false) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = `<div class="${isError ? "error" : "success"}">${text}</div>`;
  setTimeout(() => (el.innerHTML = ""), 4000);
}

/* ===== Resources page rendering, filtering, search (array methods) ===== */
function setupResourcePage() {
  const grid = document.getElementById("resource-grid");
  if (!grid) return;

  // initial render
  renderResources(RESOURCES);

  // category filters - event delegation
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const cat = e.target.dataset.cat;
      const filtered =
        cat === "all" ? RESOURCES : RESOURCES.filter((r) => r.category === cat);
      renderResources(filtered);
    });
  });

  // search input
  const search = document.getElementById("search");
  if (search) {
    search.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = RESOURCES.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
      renderResources(filtered);
    });
  }

  // allow saving a resource (localStorage)
  grid.addEventListener("click", (e) => {
    if (e.target.matches(".save-resource")) {
      const id = e.target.dataset.id;
      const saved = JSON.parse(localStorage.getItem("savedResources") || "[]");
      if (!saved.includes(id)) saved.push(id);
      localStorage.setItem("savedResources", JSON.stringify(saved));
      e.target.textContent = "Saved";
      e.target.disabled = true;
    }
  });
}

function renderResources(list) {
  const grid = document.getElementById("resource-grid");
  if (!grid) return;
  grid.innerHTML = list.map((r) => resourceCardHTML(r)).join("");
}

function resourceCardHTML(r) {
  // template literal used exclusively
  return `
    <article class="resource-card" data-id="${r.id}" tabindex="0">
      <h3>${r.title}</h3>
      <p class="meta">${r.category} • ${r.length}</p>
      <div class="card-actions">
        <a href="${r.url}" class="btn-light" aria-label="Open ${r.title}">Open</a>
        <button data-id="${r.id}" class="save-resource">Save</button>
      </div>
    </article>
  `;
}

/* ===== Preference button example (saves a simple preference) ===== */
function restorePreferenceButton() {
  const btn = document.getElementById("save-pref");
  if (!btn) return;
  btn.addEventListener("click", () => {
    localStorage.setItem("prefersPlain", "true");
    btn.textContent = "Preference saved";
    btn.disabled = true;
  });
  // rehydrate button if previously saved
  if (localStorage.getItem("prefersPlain") === "true") {
    btn.textContent = "Preference saved";
    btn.disabled = true;
  }
}
