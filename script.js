
// REVEAL
const elements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

elements.forEach(el => observer.observe(el));


// HAMBURGER
const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
});


// THEME
const btn = document.getElementById("themeToggle");
const heroImage = document.getElementById("heroImage");

function updateImage() {
  if (!heroImage) return;

  heroImage.style.opacity = 0;

  setTimeout(() => {
    heroImage.src = document.body.classList.contains("dark")
      ? "images/dark.jpg"
      : "images/pozadi.jpeg";

    heroImage.onload = () => {
      heroImage.style.opacity = 1;
    };
  }, 200);
}

btn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );

  updateImage();
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

updateImage();