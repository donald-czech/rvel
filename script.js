const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

/* ===== DARK MODE ===== */
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* ===== HAMBURGER ===== */
menuToggle?.addEventListener("click", () => {
  nav.classList.toggle("active");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

/* ===== REVEAL (divider, text, hero) ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => {
  revealObserver.observe(el);
});

/* ===== STAGGER ANIMACE KARET ===== */
const grids = document.querySelectorAll(".grid");

const gridObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll(".card");

      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("show");
        }, index * 120); // 🔥 zpoždění
      });
    }
  });
}, { threshold: 0.2 });

grids.forEach(grid => gridObserver.observe(grid));

/* ===== LIGHTBOX ===== */
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
