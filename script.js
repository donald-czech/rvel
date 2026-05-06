const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");
const toggle = document.getElementById("themeToggle");
const heroImage = document.getElementById("heroImage");
let heroImageTimer;

function updateThemeImage(isDark, animate = true) {
  if (!heroImage) return;

  const nextSrc = isDark ? "images/dark.jpg" : "images/pozadi.jpeg";
  const currentSrc = heroImage.getAttribute("src");

  if (currentSrc === nextSrc) return;

  window.clearTimeout(heroImageTimer);

  if (!animate) {
    heroImage.src = nextSrc;
    return;
  }

  heroImage.classList.add("is-switching");

  heroImageTimer = window.setTimeout(() => {
    heroImage.src = nextSrc;

    if (heroImage.complete) {
      heroImage.classList.remove("is-switching");
      return;
    }

    heroImage.addEventListener("load", () => {
      heroImage.classList.remove("is-switching");
    }, { once: true });
  }, 220);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (toggle) toggle.textContent = "☀";
  updateThemeImage(true, false);
} else {
  updateThemeImage(false, false);
}

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

if (toggle) {
  toggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggle.textContent = isDark ? "☀" : "☾";
    updateThemeImage(isDark);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle("show", entry.isIntersecting);
  });
}, {
  threshold: 0.18,
  rootMargin: "0px 0px -35px"
});

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
