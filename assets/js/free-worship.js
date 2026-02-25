// assets/js/free-worship.js
// Envoie le formulaire vers Google Sheets via Apps Script (sans SGBD)

const ENDPOINT = "https://script.google.com/macros/s/AKfycbwnKXkWpVEj89FssU3kLGxTQ88ceid2q_EKmpsEvZkUhwVPJJ_tuScV-qPTS187b6UIXA/exec"; // <-- IMPORTANT

const form = document.getElementById("freeWorshipForm");
const msg = document.getElementById("fwMsg");

function setMsg(t) {
  if (!msg) return;
  msg.textContent = t || "";
}

async function postSignup(payload) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Apps Script renvoie JSON {ok:true/false}
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(data.error || "Erreur lors de l'envoi.");
  return data;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    const fd = new FormData(form);

    const payload = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      formula: String(fd.get("formula") || "").trim(),
      consent: !!fd.get("consent"),
      source: "website",
    };

    if (!payload.email) return setMsg("Merci de renseigner un email.");
    if (!payload.phone) return setMsg("Merci de renseigner un téléphone.");
    if (!payload.consent) return setMsg("Merci d’accepter le consentement.");

    try {
      await postSignup(payload);
      form.reset();

      // Remettre la formule par défaut si tu utilises des radios
      const formulaInput = document.getElementById("formula");
      if (formulaInput && !formulaInput.value) {
        formulaInput.value = "Moment de louange simple (gratuit)";
      }

      setMsg("Inscription enregistrée ✅ (dans la liste Dalhia)");
    } catch (err) {
      setMsg("Erreur: " + (err?.message || "envoi impossible"));
    }
  });
}