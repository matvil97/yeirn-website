// free-worship.js — YEIRN
// Objectif : inscription simple + redirection Stripe

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/7sY8wI9LQa1r7NU6NHfQI00";

const form = document.getElementById("freeWorshipForm");
const msg = document.getElementById("fwMsg");
const payBtn = document.getElementById("payBtn");

// Pré-remplissage du bouton de paiement (toujours disponible)
if (payBtn) {
  payBtn.href = STRIPE_PAYMENT_LINK;
  payBtn.target = "_blank";
  payBtn.rel = "noopener";
}

function setMsg(text) {
  if (!msg) return;
  msg.textContent = text || "";
}

// Mini validation + stockage local (optionnel)
// Ici : on stocke juste la personne pour “tracer” côté front (sans DB)
function saveLocalSignup(data) {
  try {
    const KEY = "yeirn_free_worship_signups";
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    list.push({ ...data, createdAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setMsg("");

    const fd = new FormData(form);
    const firstName = String(fd.get("firstName") || "").trim();
    const lastName  = String(fd.get("lastName") || "").trim();
    const email     = String(fd.get("email") || "").trim();
    const phone     = String(fd.get("phone") || "").trim();
    const consent   = fd.get("consent");

    if (!firstName || !lastName) {
      setMsg("Merci de renseigner ton prénom et ton nom.");
      return;
    }
    if (!email) {
      setMsg("Merci de renseigner ton email.");
      return;
    }
    if (!consent) {
      setMsg("Merci d’accepter le consentement.");
      return;
    }

    saveLocalSignup({ firstName, lastName, email, phone });

    // Redirection Stripe (simple, sécurisé, sans backend)
    // Stripe gère paiement + email + redirect success/cancel
    window.location.href = STRIPE_PAYMENT_LINK;
  });
}