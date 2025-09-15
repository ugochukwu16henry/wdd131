// temples.js
// Mobile hamburger toggle + footer dates

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("navMenu");
  const yearSpan = document.getElementById("year");
  const lastSpan = document.getElementById("lastModified");

  // Fill footer year and last modified
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  if (lastSpan) lastSpan.textContent = document.lastModified;

  // Ensure aria attributes exist (accessibility)
  if (hamburger) {
    hamburger.setAttribute("aria-controls", "navMenu");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Toggle navigation menu");
  }

  // Toggle nav 'open' class (CSS shows/hides based on class)
  function closeNav(){
    if (nav.classList.contains("open")){
      nav.classList.remove("open");
      if (hamburger) {
        hamburger.textContent = "☰";
        hamburger.setAttribute("aria-expanded","false");
      }
    }
  }
  function openNav(){
    if (!nav.classList.contains("open")){
      nav.classList.add("open");
      if (hamburger) {
        hamburger.textContent = "✖";
        hamburger.setAttribute("aria-expanded","true");
      }
    }
  }

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      if (nav.classList.contains("open")){
        closeNav();
      } else {
        openNav();
      }
    });

    // Close when pressing Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeNav();
      }
    });

    // If user resizes to large screen, remove mobile open class so CSS controls visibility
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 700) {
        // remove inline/mobile state so CSS takes over
        nav.classList.remove("open");
        if (hamburger) {
          hamburger.textContent = "☰";
          hamburger.setAttribute("aria-expanded","false");
        }
      }
    });

    // Close nav when clicking a nav link (mobile behavior)
    nav.addEventListener("click", (event) => {
      if (event.target.tagName === "A" && window.innerWidth < 700) {
        // small screens: close the menu after selection
        closeNav();
      }
    });
  }
});
