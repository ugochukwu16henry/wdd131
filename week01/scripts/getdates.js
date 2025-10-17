// Get current year
document.getElementById("currentyear").textContent = new Date().getFullYear();

// Get last modified date
document.getElementById("lastModified").textContent = "Last Modified: " + document.lastModified;


const mobileBtn = document.querySelector('.mobile-menu-btn');
const navList = document.querySelector('nav ul');

mobileBtn.addEventListener('click', () => {
    navList.classList.toggle('active');
});

