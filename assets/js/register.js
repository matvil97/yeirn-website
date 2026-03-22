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
    if (submitBtn) submitBtn.disabled = true;

    setMsg("Envoi en cours...");

    try {
      const formData = new FormData(form);

      const body = new URLSearchParams({
        firstName: formData.get("firstName")?.toString().trim() || "",
        lastName: formData.get("lastName")?.toString().trim() || "",
        email: formData.get("email")?.toString().trim() || "",
        phone: formData.get("phone")?.toString().trim() || "",
        atelierDate: formData.get("atelierDate")?.toString().trim() || "",
        message: formData.get("message")?.toString().trim() || "",
        eventType: formData.get("eventType")?.toString().trim() || "Atelier YEIRN",
        consent: formData.get("consent") ? "oui" : "non"
      });

      await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: body.toString()
      });

      // Si on arrive ici, on considère l'envoi comme réussi
      window.location.href = "merci.html?type=atelier";


    } catch (error) {
      console.error("Erreur inscription :", error);
      setMsg("Une erreur est survenue. Merci de réessayer.");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}