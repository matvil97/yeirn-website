// register.js — YEIRN
(() => {
  const form = document.getElementById("registerForm");
  const msg = document.getElementById("formMsg");
  const exportBtn = document.getElementById("exportCsvBtn");

  const KEY = "yeirn_signups";

  function setMsg(text, type = "info") {
    if (!msg) return;
    msg.textContent = text || "";
    msg.dataset.type = type; // utile si tu veux styler: [data-type="error"]...
  }

  function getSignups() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSignups(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function escapeCSV(v) {
    // CSV RFC-friendly: entoure et échappe les guillemets
    return `"${String(v ?? "").replace(/"/g, '""')}"`;
  }

  function toCSV(rows) {
    const header = ["firstName", "lastName", "email", "phone", "interests", "createdAt"];
    const lines = [header.map(escapeCSV).join(",")];

    rows.forEach((r) => {
      const line = [
        r.firstName,
        r.lastName,
        r.email,
        r.phone,
        Array.isArray(r.interests) ? r.interests.join(" | ") : "",
        r.createdAt,
      ]
        .map(escapeCSV)
        .join(",");
      lines.push(line);
    });

    return lines.join("\n");
  }

  function download(filename, content) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    // libère l’URL après usage
    setTimeout(() => URL.revokeObjectURL(url), 250);
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function isValidEmail(email) {
    // simple & suffisant pour un MVP
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function formatDateForFilename(d = new Date()) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
  }

  // Optionnel: cache le bouton export sauf si ?admin=1 (ou laisse visible si tu préfères)
  function setExportVisibility() {
    if (!exportBtn) return;
    const isAdmin = new URLSearchParams(window.location.search).get("admin") === "1";
    exportBtn.hidden = !isAdmin; // mets "false" si tu veux toujours l'afficher
  }

  // --- Submit form
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      setMsg("");

      const fd = new FormData(form);

      const firstName = String(fd.get("firstName") || "").trim();
      const lastName = String(fd.get("lastName") || "").trim();
      const emailRaw = String(fd.get("email") || "").trim();
      const email = normalizeEmail(emailRaw);
      const phone = String(fd.get("phone") || "").trim();
      const consent = fd.get("consent"); // checkbox -> "on" si coché sinon null
      const interests = fd.getAll("interest").map((x) => String(x));

      if (!email) {
        setMsg("Merci de renseigner un email.", "error");
        return;
      }
      if (!isValidEmail(email)) {
        setMsg("Email invalide. Exemple: nom@domaine.com", "error");
        return;
      }
      if (!consent) {
        setMsg("Merci d’accepter le consentement RGPD.", "error");
        return;
      }

      const list = getSignups();
      const exists = list.some((x) => normalizeEmail(x.email) === email);
      if (exists) {
        setMsg("Cet email est déjà inscrit.", "error");
        return;
      }

      list.push({
        firstName,
        lastName,
        email,
        phone,
        interests,
        createdAt: new Date().toISOString(),
      });

      saveSignups(list);
      form.reset();
      setMsg("Inscription enregistrée (local).", "success");
    });
  }

  // --- Export CSV
  if (exportBtn) {
    setExportVisibility();

    exportBtn.addEventListener("click", () => {
      const list = getSignups();

      if (!list.length) {
        setMsg("Aucune inscription à exporter.", "error");
        return;
      }

      const csv = toCSV(list);
      const filename = `yeirn-signups_${formatDateForFilename()}.csv`;
      download(filename, csv);
      setMsg("Export CSV généré.", "success");
    });
  }
})();
