// free-worship.js — inscription gratuite (entrée free worship)
// Les options payantes sont gérées via liens Stripe séparés.

const form = document.getElementById("freeWorshipForm");
const msg = document.getElementById("fwMsg");

function setMsg(text) {
  if (!msg) return;
  msg.textContent = text || "";
}

function saveLocalSignup(data) {
  try {
    const KEY = "yeirn_free_worship_free_signups";
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
    if (!phone) {
  setMsg("Merci de renseigner ton numéro de téléphone.");
  return;
    }

    saveLocalSignup({ firstName, lastName, email, phone });

    form.reset();
    setMsg("✅ Inscription enregistrée. L’entrée est gratuite. (Options payantes disponibles à droite)");
  });
}