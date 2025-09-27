// filtered-temples.js

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("navMenu");
  const yearSpan = document.getElementById("year");
  const lastSpan = document.getElementById("lastModified");
  const cardsContainer = document.getElementById("templeCards");
  const pageTitle = document.getElementById("pageTitle");

  // Footer info
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  if (lastSpan) lastSpan.textContent = document.lastModified;

  // Accessibility
  if (hamburger) {
    hamburger.setAttribute("aria-controls", "navMenu");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Toggle navigation menu");
  }

  // Toggle Nav
  function closeNav() {
    nav.classList.remove("open");
    hamburger.textContent = "☰";
    hamburger.setAttribute("aria-expanded", "false");
  }
  function openNav() {
    nav.classList.add("open");
    hamburger.textContent = "✖";
    hamburger.setAttribute("aria-expanded", "true");
  }
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.contains("open") ? closeNav() : openNav();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 700) closeNav();
    });
    nav.addEventListener("click", (event) => {
      if (event.target.tagName === "A" && window.innerWidth < 700) {
        closeNav();
      }
    });
  }

  // Temple Data
  const temples = [
    {
      templeName: "Aba Nigeria",
      location: "Aba, Nigeria",
      dedicated: "2005, August, 7",
      area: 11500,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg",
    },
    {
      templeName: "Manti Utah",
      location: "Manti, Utah, United States",
      dedicated: "1888, May, 21",
      area: 74792,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg",
    },
    {
      templeName: "Payson Utah",
      location: "Payson, Utah, United States",
      dedicated: "2015, June, 7",
      area: 96630,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg",
    },
    {
      templeName: "Yigo Guam",
      location: "Yigo, Guam",
      dedicated: "2020, May, 2",
      area: 6861,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg",
    },
    {
      templeName: "Washington D.C.",
      location: "Kensington, Maryland, United States",
      dedicated: "1974, November, 19",
      area: 156558,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg",
    },
    {
      templeName: "Lima Perú",
      location: "Lima, Perú",
      dedicated: "1986, January, 10",
      area: 9600,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg",
    },
    {
      templeName: "Mexico City Mexico",
      location: "Mexico City, Mexico",
      dedicated: "1983, December, 2",
      area: 116642,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg",
    },
    // Extra temples
    {
      templeName: "Salt Lake Temple",
      location: "Salt Lake City, Utah, United States",
      dedicated: "1893, April, 6",
      area: 253015,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/salt-lake-utah/400x250/salt-lake-temple-lds-896240-wallpaper.jpg",
    },
    {
      templeName: "Accra Ghana",
      location: "Accra, Ghana",
      dedicated: "2004, January, 11",
      area: 17500,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/accra-ghana/400x250/accra-ghana-temple-lds-824355-wallpaper.jpg",
    },
    {
      templeName: "Paris France",
      location: "Paris, France",
      dedicated: "2017, May, 21",
      area: 44175,
      imageUrl:
        "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/paris-france/400x250/paris-france-temple-lds-1749634-wallpaper.jpg",
    },
  ];

  // Rendering function
  function renderTemples(filteredTemples) {
    cardsContainer.innerHTML = ""; // clear
    filteredTemples.forEach((temple) => {
      const card = document.createElement("figure");
      card.innerHTML = `
        <img src="${temple.imageUrl}" alt="${temple.templeName}" loading="lazy">
        <figcaption>
          <h3>${temple.templeName}</h3>
          <p><strong>Location:</strong> ${temple.location}</p>
          <p><strong>Dedicated:</strong> ${temple.dedicated}</p>
          <p><strong>Area:</strong> ${temple.area.toLocaleString()} sq ft</p>
        </figcaption>
      `;
      cardsContainer.appendChild(card);
    });
  }

  // Filtering logic
  function filterTemples(criteria) {
    let result = temples;
    switch (criteria) {
      case "old":
        result = temples.filter(
          (t) => parseInt(t.dedicated.split(",")[0]) < 1900
        );
        break;
      case "new":
        result = temples.filter(
          (t) => parseInt(t.dedicated.split(",")[0]) > 2000
        );
        break;
      case "large":
        result = temples.filter((t) => t.area > 90000);
        break;
      case "small":
        result = temples.filter((t) => t.area < 10000);
        break;
      default:
        result = temples;
    }
    pageTitle.textContent =
      criteria.charAt(0).toUpperCase() + criteria.slice(1);
    if (criteria === "home") pageTitle.textContent = "Home";
    renderTemples(result);
  }

  // Nav links
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const filter = link.dataset.filter;
      filterTemples(filter);
    });
  });

  // Initial render
  renderTemples(temples);
});
