// main.js — YEIRN

// Year
const y = document.getElementById("year");
if (y) y.textContent = String(new Date().getFullYear());

// Burger drawer (ouvre/ferme la nav)
const rail = document.querySelector(".rail");
const burger = document.querySelector("[data-burger]");
const drawer = document.querySelector("[data-drawer]");

function isNavOpen() {
  return !!rail && rail.classList.contains("is-open");
}

function closeNav() {
  if (!rail) return;
  rail.classList.remove("is-open");
  // Optionnel: utile si tu bloques le scroll à l'ouverture
  document.body.style.overflow = "";
}

function openNav() {
  if (!rail) return;
  rail.classList.add("is-open");
  // Optionnel: bloque le scroll quand le drawer est ouvert (mobile)
  document.body.style.overflow = "hidden";
}

function toggleNav() {
  if (!rail) return;
  if (isNavOpen()) closeNav();
  else openNav();
}

if (rail && burger && drawer) {
  burger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNav();
  });

  // Ferme quand on clique un lien du menu
  drawer.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => closeNav());
  });

  // Ferme si clic en dehors
  document.addEventListener("click", (e) => {
    if (!rail.contains(e.target)) closeNav();
  });

  // Ferme avec Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

// Accordion
const accordion = document.querySelector("[data-accordion]");
if (accordion) {
  const btns = accordion.querySelectorAll(".accordion__btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      if (!panel) return;

      const isOpen = panel.classList.contains("is-open");

      // close all
      accordion.querySelectorAll(".accordion__panel").forEach((p) => p.classList.remove("is-open"));
      btns.forEach((b) => b.setAttribute("aria-expanded", "false"));

      // toggle current
      if (!isOpen) {
        panel.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// Tabs
const tabs = document.querySelector("[data-tabs]");
if (tabs) {
  const tabBtns = tabs.querySelectorAll("[data-tab]");
  const panels = tabs.querySelectorAll("[data-panel]");

  function activate(name) {
    tabBtns.forEach((b) => {
      const active = b.dataset.tab === name;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === name));
  }

  tabBtns.forEach((btn) => btn.addEventListener("click", () => activate(btn.dataset.tab)));

  // Optionnel: active le premier tab si aucun n’est actif
  const anyActive = Array.from(tabBtns).some((b) => b.classList.contains("is-active"));
  if (!anyActive && tabBtns[0]) activate(tabBtns[0].dataset.tab);
}

// Qty
const qtyInput = document.querySelector("[data-qty-input]");
document.querySelectorAll("[data-qty]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!qtyInput) return;
    const delta = Number(btn.dataset.qty);
    const next = Math.max(1, Number(qtyInput.value || 1) + delta);
    qtyInput.value = String(next);
  });
});

// Gallery (placeholder: change class background via index)
const main = document.querySelector("[data-gallery-main]");
const thumbs = document.querySelectorAll("[data-thumb]");
if (main && thumbs.length) {
  const presets = [
    "linear-gradient(135deg,#f2f2f2,#fff)",
    "linear-gradient(135deg,#f7f1ee,#fff)",
    "linear-gradient(135deg,#eef3ff,#fff)",
  ];

  function set(i) {
    main.style.background = presets[i] || presets[0];
    thumbs.forEach((t) => t.classList.toggle("is-active", Number(t.dataset.thumb) === i));
  }

  thumbs.forEach((t) => t.addEventListener("click", () => set(Number(t.dataset.thumb))));
  set(0);
}
// Hero dynamic word (change on refresh)
const dynamicWord = document.getElementById("dynamic-word");

if (dynamicWord) {
  const words = [
    "GUIDE",
    "RÉVÈLE",
    "INSPIRE",
    "ÉCL AIRE".replace(" ", ""), // petite astuce anti typo
    "ANCRE",
    "ÉVEILLE"
  ];

  const random = Math.floor(Math.random() * words.length);
  dynamicWord.textContent = words[random];
}
// Scroll reveal (fade-in on swipe down)
(function () {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach((el) => io.observe(el));
})();
