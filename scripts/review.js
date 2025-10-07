// Increment review counter in localStorage
let reviewCount = Number(localStorage.getItem("reviewCount")) || 0;
reviewCount++;
localStorage.setItem("reviewCount", reviewCount);

// Display it
document.getElementById(
  "reviewCounter"
).textContent = `You have submitted ${reviewCount} review(s).`;
