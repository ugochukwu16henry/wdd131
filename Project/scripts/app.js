// Quick tips (arrays + random selection)
const tips = [
  "Have dinner together without phones.",
  "Take a 15-minute family walk.",
  "Listen before you respond in arguments.",
  "Celebrate small wins together.",
  "Share one positive thing about your day.",
];

function highlightTip() {
  const tip = tips[Math.floor(Math.random() * tips.length)];
  document.getElementById("tip").textContent = `💡 Tip: ${tip}`;
}

// Resource search (objects, arrays, filtering)
const resources = [
  { title: "Parenting Strategies", category: "parenting" },
  { title: "Healthy Routines", category: "health" },
  { title: "Conflict Resolution", category: "conflict" },
  { title: "Family Bonding", category: "bonding" },
];

function displayResources(list) {
  const container = document.getElementById("resourceList");
  container.innerHTML = "";
  list.forEach((item) => {
    container.innerHTML += `<div class="card"><h3>${item.title}</h3></div>`;
  });
}

function searchResources() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const results = resources.filter((r) =>
    r.title.toLowerCase().includes(query)
  );
  displayResources(results.length ? results : resources);
}

// Form with localStorage
document
  .getElementById("subscribeForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    if (email.includes("@")) {
      localStorage.setItem("subscriber", email);
      alert(`Thank you for subscribing, ${email}!`);
      this.reset();
    } else {
      alert("Please enter a valid email.");
    }
  });

// Initial load
window.onload = () => {
  if (document.getElementById("resourceList")) {
    displayResources(resources);
  }
};
