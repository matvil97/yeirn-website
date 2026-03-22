(function () {
  const items = {
    inscription: {
      q: "Comment s’inscrire à un atelier ?",
      a: "Tu peux t’inscrire directement depuis la page dédiée. Il suffit de remplir le formulaire pour réserver ta place.",
      ctaLabel: "Aller à l’inscription",
      ctaHref: "participer.html"
    },
    materiel: {
      q: "Faut-il du matériel ?",
      a: "Cela dépend de l’atelier. Les informations pratiques sont indiquées sur la page atelier ou envoyées après inscription.",
      ctaLabel: "Voir les ateliers",
      ctaHref: "ateliers.html"
    },
    galerie: {
      q: "Comment proposer une œuvre ?",
      a: "Tu peux proposer une œuvre depuis la page dédiée. Une description est obligatoire et chaque proposition est relue avant publication.",
      ctaLabel: "Proposer une œuvre",
      ctaHref: "proposer-oeuvre.html"
    },
    devis: {
      q: "Comment faire une demande de devis ?",
      a: "Rends-toi sur la page Contact, choisis le type de demande adapté puis remplis le formulaire.",
      ctaLabel: "Ouvrir le contact",
      ctaHref: "contact.html"
    },
    kits: {
      q: "Où voir les kits créatifs ?",
      a: "Les kits sont présentés sur la page Kits. Tu peux ensuite écrire à YEIRN pour poser une question ou demander plus d’informations.",
      ctaLabel: "Voir les kits",
      ctaHref: "kits.html"
    },
    flow: {
      q: "Comment être informé(e) des événements Flow Worship ?",
      a: "La page Flow Worship accueillera les prochaines dates. Tu peux aussi contacter YEIRN pour demander à être informé(e).",
      ctaLabel: "Voir Flow Worship",
      ctaHref: "flow-worship.html"
    }
  };

  const root = document.createElement("div");
  root.className = "faqbot";
  root.innerHTML = `
    <button class="faqbot__toggle" type="button" aria-label="Ouvrir l’aide">
      <span>?</span>
    </button>

    <section class="faqbot__panel" hidden aria-label="Assistant d’aide">
      <div class="faqbot__head">
        <div class="faqbot__headText">
          <strong>Besoin d’aide ?</strong>
          <p>Questions fréquentes</p>
        </div>
        <button class="faqbot__close" type="button" aria-label="Fermer">×</button>
      </div>

      <div class="faqbot__body">
        <p class="faqbot__intro">Choisis une question :</p>
        <div class="faqbot__questions"></div>

        <div class="faqbot__answer" aria-live="polite">
          <p class="faqbot__answerText"></p>
          <a class="faqbot__cta" href="#" hidden></a>
        </div>
      </div>
    </section>
  `;

  document.body.appendChild(root);

  const style = document.createElement("style");
  style.textContent = `
    .faqbot__toggle{
      position:fixed;
      right:18px;
      bottom:18px;
      width:56px;
      height:56px;
      border:0;
      border-radius:999px;
      background:#111827;
      color:#fff;
      font-size:22px;
      font-weight:700;
      cursor:pointer;
      box-shadow:0 12px 28px rgba(17,24,39,.22);
      z-index:9999;
    }

    .faqbot__toggle:hover{
      transform:translateY(-1px);
    }

    .faqbot__panel{
      position:fixed;
      right:18px;
      bottom:86px;
      width:min(380px, calc(100vw - 24px));
      background:#fff;
      border:1px solid #e5e7eb;
      border-radius:18px;
      box-shadow:0 20px 45px rgba(0,0,0,.14);
      z-index:9999;
      overflow:hidden;
    }

    .faqbot__head{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:14px 16px;
      border-bottom:1px solid #e5e7eb;
      background:#f9fafb;
    }

    .faqbot__headText strong{
      display:block;
      font-size:15px;
      color:#111827;
      line-height:1.2;
    }

    .faqbot__headText p{
      margin:4px 0 0;
      font-size:12px;
      color:#667085;
    }

    .faqbot__close{
      border:0;
      background:transparent;
      font-size:24px;
      line-height:1;
      cursor:pointer;
      color:#667085;
    }

    .faqbot__body{
      padding:14px 16px 16px;
    }

    .faqbot__intro{
      margin:0 0 10px;
      color:#667085;
      font-size:14px;
      line-height:1.5;
    }

    .faqbot__questions{
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    .faqbot__q{
      width:100%;
      text-align:left;
      border:1px solid #e5e7eb;
      background:#fff;
      color:#111827;
      border-radius:12px;
      padding:11px 12px;
      cursor:pointer;
      font:inherit;
      transition:border-color .15s ease, background .15s ease;
    }

    .faqbot__q:hover{
      border-color:#d0d5dd;
      background:#fafafa;
    }

    .faqbot__answer{
      display:none;
      margin-top:12px;
      padding:14px;
      border-radius:14px;
      background:#f9fafb;
      border:1px solid #eef2f6;
    }

    .faqbot__answer.is-visible{
      display:block;
    }

    .faqbot__answerText{
      margin:0;
      color:#475467;
      font-size:14px;
      line-height:1.65;
    }

    .faqbot__cta{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      margin-top:12px;
      padding:10px 14px;
      border-radius:10px;
      background:#111827;
      color:#fff;
      text-decoration:none;
      font-size:13px;
      font-weight:700;
    }

    .faqbot__cta:hover{
      opacity:.92;
    }

    @media (max-width: 520px){
      .faqbot__panel{
        right:12px;
        bottom:80px;
        width:calc(100vw - 24px);
      }

      .faqbot__toggle{
        right:12px;
        bottom:12px;
      }
    }
  `;
  document.head.appendChild(style);

  const toggleBtn = root.querySelector(".faqbot__toggle");
  const panel = root.querySelector(".faqbot__panel");
  const closeBtn = root.querySelector(".faqbot__close");
  const questionsWrap = root.querySelector(".faqbot__questions");
  const answerBox = root.querySelector(".faqbot__answer");
  const answerText = root.querySelector(".faqbot__answerText");
  const answerCta = root.querySelector(".faqbot__cta");

  Object.keys(items).forEach((key) => {
    const item = items[key];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "faqbot__q";
    btn.textContent = item.q;

    btn.addEventListener("click", () => {
      answerText.textContent = item.a;

      if (item.ctaLabel && item.ctaHref) {
        answerCta.textContent = item.ctaLabel;
        answerCta.href = item.ctaHref;
        answerCta.hidden = false;
      } else {
        answerCta.hidden = true;
      }

      answerBox.classList.add("is-visible");
    });

    questionsWrap.appendChild(btn);
  });

  toggleBtn.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
  });

  closeBtn.addEventListener("click", () => {
    panel.hidden = true;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      panel.hidden = true;
    }
  });
})();