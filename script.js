// DARK MODE
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

// MENU
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.onclick = () => {
  nav.classList.toggle("active");
};

document.querySelectorAll(".nav a").forEach(link => {
  link.onclick = () => nav.classList.remove("active");
});

// ===== POMALÁ ANIMACE KARET =====
const cards = document.querySelectorAll(".card");

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {

      setTimeout(() => {
        entry.target.classList.add("show");
      }, index * 200);

    }
  });
}, {
  threshold: 0.15
});

cards.forEach(card => cardObserver.observe(card));