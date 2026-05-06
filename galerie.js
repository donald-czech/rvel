const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeButton = lightbox?.querySelector(".lightbox-close");

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

document.querySelectorAll(".gallery button").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    if (!lightbox || !lightboxImage || !image) return;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

closeButton?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});
