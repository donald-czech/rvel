document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".service-preview .card");

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const card = entry.target;
      const index = Number(card.dataset.cardIndex || 0);

      window.clearTimeout(Number(card.dataset.revealTimer || 0));

      if (entry.isIntersecting) {
        const timer = window.setTimeout(() => {
          card.classList.add("card-visible");
        }, index * 90);

        card.dataset.revealTimer = String(timer);
      } else {
        card.classList.remove("card-visible");
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: "0px 0px -25px"
  });

  cards.forEach((card, index) => {
    card.dataset.cardIndex = String(index % 4);
    cardObserver.observe(card);
  });
});
