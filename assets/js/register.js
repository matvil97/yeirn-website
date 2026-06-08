const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwnKXkWpVEj89FssU3kLGxTQ88ceid2q_EKmpsEvZkUhwVPJJ_tuScV-qPTS187b6UIXA/exec";

const STRIPE_PEINTURE = "https://buy.stripe.com/bJe14g4rw2yZ7NU4FzfQI01";

const form = document.getElementById("atelierForm");
const msg = document.getElementById("fwMsg");
const peinturePriceNote = document.getElementById("peinturePriceNote");

function setMsg(text) {
  if (msg) msg.textContent = text || "";
}

// Affiche la note de paiement Stripe quand Atelier Peinture est sélectionné
if (form && peinturePriceNote) {
  form.querySelectorAll('input[name="formula"]').forEach(function(input) {
    input.addEventListener("change", function() {
      var checked = form.querySelector('input[name="formula"]:checked');
      peinturePriceNote.style.display =
        checked && checked.value.includes("Peinture") ? "block" : "none";
    });
  });
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi en cours...";
    }

    setMsg("Envoi en cours...");

    try {
      const formData = new FormData(form);
      const body = new URLSearchParams(formData);

      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: body.toString()
      });

      const selectedFormula = form.querySelector('input[name="formula"]:checked')?.value || "";

      if (selectedFormula.includes("Peinture")) {
        setMsg("Inscription validée. Ouverture du paiement...");
        window.open(STRIPE_PEINTURE, "_blank", "noopener,noreferrer");
        window.location.href = "merci.html?type=atelier-peinture";
      } else {
        setMsg("Inscription validée. Redirection...");
        window.location.href = "merci.html?type=flow-worship";
      }

    } catch (error) {
      console.error("Erreur inscription :", error);
      setMsg("Erreur lors de l'envoi. Merci de réessayer.");

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Valider mon inscription";
      }
    }
  });
}
