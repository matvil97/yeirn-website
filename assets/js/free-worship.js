// assets/js/free-worship.js
// Envoie le formulaire vers Google Sheets via Google Apps Script (sans SGBD)

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwnKXkWpVEj89FssU3kLGxTQ88ceid2q_EKmpsEvZkUhwVPJJ_tuScV-qPTS187b6UIXA/exec";

const form = document.getElementById("freeWorshipForm");
const msg = document.getElementById("fwMsg");
const wantPouch = document.getElementById("wantPouch");
const pouchFields = document.getElementById("pouchFields");

function setMsg(t) {
  if (!msg) return;
  msg.textContent = t || "";
}

/* =========================
   Toggle pochette
========================= */
if (wantPouch && pouchFields) {
  const toggle = () => {
    pouchFields.style.display = wantPouch.checked ? "block" : "none";
  };
  wantPouch.addEventListener("change", toggle);
  toggle();
}

/* =========================
   Envoi vers Apps Script
========================= */
async function postSignup(payload) {
  const body = new URLSearchParams();

  Object.entries(payload).forEach(([k, v]) => {
    body.append(k, String(v ?? ""));
  });

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: body.toString(),
  });

  const text = await res.text();
  let data = {};

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Réponse invalide du serveur.");
  }

  if (!data.ok) {
    throw new Error(data.error || "Erreur lors de l'envoi.");
  }

  return data;
}

/* =========================
   Submit
========================= */
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    const fd = new FormData(form);

    const wantPouchValue = fd.get("wantPouch") ? "yes" : "no";

    const pouchModel = String(fd.get("pouchModel") || "").trim();
    const pouchSize = String(fd.get("pouchSize") || "").trim();
    const pouchLength = String(fd.get("pouchLength") || "").trim();
    const pouchWidth = String(fd.get("pouchWidth") || "").trim();
    const pouchDepth = String(fd.get("pouchDepth") || "").trim();

    const payload = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      formula: String(fd.get("formula") || "Moment de louange simple (gratuit)").trim(),
      consent: fd.get("consent") ? "yes" : "no",
      source: "website",

      // Pochette
      wantPouch: wantPouchValue,
      pouchModel: pouchModel,
      pouchSize: pouchSize,
      pouchLength: pouchLength,
      pouchWidth: pouchWidth,
      pouchDepth: pouchDepth,
    };

    /* =========================
       VALIDATIONS
    ========================= */

    if (!payload.email) return setMsg("Merci de renseigner un email.");
    if (!payload.phone) return setMsg("Merci de renseigner un téléphone.");
    if (payload.consent !== "yes")
      return setMsg("Merci d’accepter le consentement.");

    // Validation pochette si activée
    if (wantPouchValue === "yes") {
      if (!pouchModel) {
        return setMsg("Merci de choisir un modèle de pochette.");
      }

      const hasCustomDimensions =
        pouchLength || pouchWidth || pouchDepth;

      if (!pouchSize && !hasCustomDimensions) {
        return setMsg(
          "Merci de choisir une taille standard ou renseigner les dimensions."
        );
      }
    }

    /* =========================
       ENVOI
    ========================= */
    try {
      setMsg("Envoi en cours…");

      await postSignup(payload);

      form.reset();
      if (pouchFields) pouchFields.style.display = "none";

      setMsg("Inscription enregistrée ✅ (dans la liste Dalhia)");
    } catch (err) {
      setMsg("Erreur : " + (err?.message || "envoi impossible"));
    }
  });
}