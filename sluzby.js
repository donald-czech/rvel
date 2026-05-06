document.addEventListener("DOMContentLoaded", () => {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 35}ms`;
  });
});
