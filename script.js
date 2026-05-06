
// ===== REVEAL ANIMACE =====
const elements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

elements.forEach(el => observer.observe(el));


// ===== ELEMENTY =====
const btn = document.getElementById("themeToggle");
const heroImage = document.getElementById("heroImage");
const header = document.querySelector(".header");


// ===== FUNKCE PRO PLYNULÝ PŘECHOD OBRÁZKU =====
function setHeroImage(src) {
  if (!heroImage) return;

  // fade out
  heroImage.style.opacity = 0;

  setTimeout(() => {
    heroImage.src = src;

    // fade in
    heroImage.onload = () => {
      heroImage.style.opacity = 1;
    };
  }, 200);
}


// ===== UPDATE IMAGE PODLE TÉMATU =====
function updateImage() {
  if (document.body.classList.contains("dark")) {
    setHeroImage("images/dark.jpg");
  } else {
    setHeroImage("images/pozadi.jpeg");
  }
}


// ===== THEME TOGGLE =====
btn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );

  updateImage();
});


// ===== LOAD TÉMA =====
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}


// ===== INIT IMAGE =====
updateImage();


// ===== HEADER SCROLL EFFECT =====
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
