// assets/js/free-worship.js
// Envoie le formulaire vers Google Sheets via Google Apps Script (sans SGBD)

// ✅ URL /exec de ton Apps Script
const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwnKXkWpVEj89FssU3kLGxTQ88ceid2q_EKmpsEvZkUhwVPJJ_tuScV-qPTS187b6UIXA/exec";

const form = document.getElementById("freeWorshipForm");
const msg = document.getElementById("fwMsg");

function setMsg(t) {
  if (!msg) return;
  msg.textContent = t || "";
}

// ✅ Envoi en x-www-form-urlencoded (évite CORS/preflight, fonctionne avec e.parameter)
async function postSignup(payload) {
  const body = new URLSearchParams();

  // Convertit tout en string (Apps Script reçoit e.parameter)
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

  // Apps Script renvoie un JSON en texte
  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    // Si Apps Script renvoie autre chose
    throw new Error("Réponse invalide du serveur.");
  }

  if (!data.ok) {
    throw new Error(data.error || "Erreur lors de l'envoi.");
  }

  return data;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    const fd = new FormData(form);

    // ⚠️ Apps Script e.parameter reçoit tout en string
    const payload = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      formula: String(fd.get("formula") || "Moment de louange simple (gratuit)").trim(),
      consent: fd.get("consent") ? "yes" : "no",
      source: "website",
    };

    if (!payload.email) return setMsg("Merci de renseigner un email.");
    if (!payload.phone) return setMsg("Merci de renseigner un téléphone.");
    if (payload.consent !== "yes") return setMsg("Merci d’accepter le consentement.");

    try {
      setMsg("Envoi en cours…");

      await postSignup(payload);

      form.reset();

      // ✅ Remettre la formule par défaut si champ hidden
      const formulaInput = document.getElementById("formula");
      if (formulaInput) {
        formulaInput.value = "Moment de louange simple (gratuit)";
      }

      setMsg("Inscription enregistrée ✅ (dans la liste Dalhia)");
    } catch (err) {
      setMsg("Erreur : " + (err?.message || "envoi impossible"));
    }
  });
}