const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");
const toggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (toggle) toggle.textContent = "☀";
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
