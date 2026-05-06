
document.addEventListener("DOMContentLoaded", () => {

  console.log("Index JS loaded");

  /* ================= HERO REVEAL ================= */
  const heroText = document.querySelector(".hero h1");

  if (heroText) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    }, {
      threshold: 0.4
    });

    observer.observe(heroText);
  }

  /* ================= FUTURE INDEX FEATURES ================= */
  // sem můžeš přidat:
  // - animace karet
  // - stagger efekty
  // - paralax hero
  // - counter efekty (např. projekty, roky praxe)

});