const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");
const toggle = document.getElementById("themeToggle");
const heroImage = document.getElementById("heroImage");
const logoImages = document.querySelectorAll(".logo img");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let heroImageTimer;

function updateLogoImage(isDark) {
  logoImages.forEach((logo) => {
    logo.src = isDark ? "images/logo-header-dark-readable.png" : "images/logo-header-light-readable.png";
  });
}

function updateThemeImage(isDark, animate = true) {
  if (!heroImage) return;

  const nextSrc = isDark ? "images/dark.jpg" : "images/pozadi.jpeg";
  const currentSrc = heroImage.getAttribute("src");

  if (currentSrc === nextSrc) return;

  window.clearTimeout(heroImageTimer);

  if (!animate) {
    heroImage.src = nextSrc;
    return;
  }

  heroImage.classList.add("is-switching");

  heroImageTimer = window.setTimeout(() => {
    heroImage.src = nextSrc;

    if (heroImage.complete) {
      heroImage.classList.remove("is-switching");
      return;
    }

    heroImage.addEventListener("load", () => {
      heroImage.classList.remove("is-switching");
    }, { once: true });
  }, 220);
}

function applyTheme(isDark, animateImage = true) {
  document.body.classList.toggle("dark", isDark);
  if (toggle) toggle.textContent = isDark ? "☀" : "☾";
  updateLogoImage(isDark);
  updateThemeImage(isDark, animateImage);
}

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme ? savedTheme === "dark" : systemTheme.matches, false);

systemTheme.addEventListener("change", (event) => {
  if (localStorage.getItem("theme")) return;
  applyTheme(event.matches);
});

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
    const isDark = !document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    applyTheme(isDark);
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
function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Microsoft Edge";
  if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  return "Neznámý";
}

function detectOS() {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  return "Neznámý";
}

function detectDevice() {
  if (window.matchMedia("(max-width: 640px)").matches) return "Telefon";
  if (window.matchMedia("(max-width: 1024px)").matches) return "Tablet";
  return "Desktop";
}

function localAnalyticsFallback(event) {
  const key = "localAnalyticsEvents";
  const events = JSON.parse(localStorage.getItem(key) || "[]");
  events.push(event);
  localStorage.setItem(key, JSON.stringify(events.slice(-200)));
}

function trackEvent(type, extra = {}) {
  if (localStorage.getItem("cookieConsent") !== "accepted") return;

  const event = {
    type,
    page: location.pathname.split("/").pop() || "index.html",
    title: document.title,
    referrer: document.referrer || "Přímá návštěva",
    browser: detectBrowser(),
    os: detectOS(),
    device: detectDevice(),
    language: navigator.language || "",
    screen: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    ...extra
  };

  const body = JSON.stringify(event);

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon("_analytics/collect.php", new Blob([body], { type: "application/json" }));
    if (!sent) localAnalyticsFallback(event);
    return;
  }

  fetch("_analytics/collect.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => localAnalyticsFallback(event));
}

function enableAnalytics() {
  window.analyticsAllowed = true;
}

function setupCookieBanner() {
  const storedConsent = localStorage.getItem("cookieConsent");

  if (storedConsent === "accepted") {
    enableAnalytics();
    return;
  }

  if (storedConsent === "declined") return;

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", "Nastavení cookies");
  banner.innerHTML = `
    <div>
      <h2>Cookies na webu</h2>
      <p>Používáme nutné cookies pro fungování webu a volitelně analytiku, která nám pomůže zjistit, co návštěvníky zajímá. Reklamní cookies nepoužíváme.</p>
    </div>
    <div class="cookie-actions">
      <button class="cookie-decline" type="button">Odmítnout</button>
      <button class="cookie-accept" type="button">Povolit analytiku</button>
    </div>
  `;

  document.body.appendChild(banner);

  function closeBanner(consent) {
    localStorage.setItem("cookieConsent", consent);
    if (consent === "accepted") {
      enableAnalytics();
      trackEvent("pageview");
    }

    banner.classList.add("is-hidden");
    window.setTimeout(() => banner.remove(), 320);
  }

  banner.querySelector(".cookie-accept").addEventListener("click", () => closeBanner("accepted"));
  banner.querySelector(".cookie-decline").addEventListener("click", () => closeBanner("declined"));
}

setupCookieBanner();

if (localStorage.getItem("cookieConsent") === "accepted") {
  trackEvent("pageview");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("a, button, .card, .gallery img");
  if (!target) return;

  trackEvent("click", {
    target: target.getAttribute("href") || target.getAttribute("src") || target.id || target.className || target.tagName,
    targetText: (target.innerText || target.alt || target.getAttribute("aria-label") || target.tagName).trim().slice(0, 140)
  });
});



