const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

// DARK MODE
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// MENU
menuToggle?.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// zavření menu
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

// ANIMACE SLUŽEB
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.15 });

cards.forEach(card => observer.observe(card));

// LIGHTBOX
const images = document.querySelectorAll(".gallery img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

images.forEach(img => {
  img.addEventListener("click", () => {
    if (!lightbox) return;
    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
  });
});

lightbox?.addEventListener("click", () => {
  lightbox.style.display = "none";
});
