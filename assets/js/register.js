const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwnKXkWpVEj89FssU3kLGxTQ88ceid2q_EKmpsEvZkUhwVPJJ_tuScV-qPTS187b6UIXA/exec";

const form = document.getElementById("atelierForm");
const msg = document.getElementById("fwMsg");

function setMsg(text) {
  if (msg) msg.textContent = text || "";
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

      setMsg("Inscription validée. Redirection...");
      window.location.href = "merci.html?type=atelier";

    } catch (error) {
      console.error("Erreur inscription :", error);
      setMsg("Erreur lors de l’envoi. Merci de réessayer.");

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Valider mon inscription";
      }
    }
  });
}