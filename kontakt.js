const form = document.querySelector(".contact-form");
const status = document.querySelector(".form-status");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (status) {
      status.textContent = "Děkujeme, zpráva je připravená k odeslání. Reálné odesílání se připojí v dalším kroku.";
    }

    form.reset();
  });
}
