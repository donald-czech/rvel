
console.log("Kontakt JS loaded");

// jednoduchá validace
const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    alert("Zpráva odeslána (demo)");
    form.reset();
  });
}