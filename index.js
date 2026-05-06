document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".service-preview .card");

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 45}ms`;
  });
});
