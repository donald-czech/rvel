const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");
const toggle = document.getElementById("themeToggle");
const heroImage = document.getElementById("heroImage");
const logoImages = document.querySelectorAll(".logo img");
let heroImageTimer;

function updateLogoImage(isDark) {
  logoImages.forEach((logo) => {
    logo.src = isDark ? "images/logo-header-dark-readable.png" : "images/logo-header-light-readable.png";
  });
}

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
  updateLogoImage(true);
  updateThemeImage(true, false);
} else {
  updateLogoImage(false);
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
    updateLogoImage(isDark);
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


