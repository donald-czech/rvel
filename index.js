document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".service-preview .card");
  const isMobile = window.matchMedia("(max-width: 520px)").matches;

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const card = entry.target;
      const index = Number(card.dataset.cardIndex || 0);

      window.clearTimeout(Number(card.dataset.revealTimer || 0));

      if (entry.isIntersecting) {
        const timer = window.setTimeout(() => {
          card.classList.add("card-visible");
        }, index * (isMobile ? 55 : 90));

        card.dataset.revealTimer = String(timer);
      } else {
        card.classList.remove("card-visible");
      }
    });
  }, {
    threshold: isMobile ? 0.18 : 0.35,
    rootMargin: isMobile ? "-8% 0px -18% 0px" : "0px 0px -25px"
  });

  cards.forEach((card, index) => {
    card.dataset.cardIndex = String(isMobile ? 0 : index % 4);
    cardObserver.observe(card);
  });
});
