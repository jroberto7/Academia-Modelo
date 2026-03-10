(() => {
  const menuBtn = document.querySelector("[data-menu-btn]");
  const nav = document.querySelector("[data-nav]");
  const topbar = document.querySelector(".topbar");

  const syncTopbarHeight = () => {
    if (!topbar) return;
    const h = Math.round(topbar.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--topbar-h", `${h}px`);
  };

  const setYear = () => {
    const year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());
  };

  const setActiveLink = () => {
    const links = Array.from(document.querySelectorAll(".nav__link")).filter((a) => a.getAttribute("href")?.startsWith("#"));
    const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible) return;

        links.forEach((a) => a.classList.remove("is-active"));
        const match = links.find((a) => a.getAttribute("href") === `#${visible.target.id}`);
        if (match) match.classList.add("is-active");
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0.06, 0.12, 0.22] }
    );

    sections.forEach((s) => obs.observe(s));
  };

  const wireMenu = () => {
    if (!menuBtn || !nav) return;

    const close = () => {
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    };

    menuBtn.addEventListener("click", () => {
      const next = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", next);
      menuBtn.setAttribute("aria-expanded", next ? "true" : "false");
    });

    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      close();
    });

    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      if (e.target === menuBtn || menuBtn.contains(e.target)) return;
      if (e.target === nav || nav.contains(e.target)) return;
      close();
    });
  };

  const wireReveal = () => {
    const nodes = Array.from(document.querySelectorAll(".reveal"));
    if (!nodes.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach((n) => obs.observe(n));
  };

  const wireBilling = () => {
    const toggle = document.querySelector("[data-billing-toggle]");
    if (!toggle) return;

    const cards = Array.from(document.querySelectorAll("[data-plan]"));
    if (!cards.length) return;

    const data = {
      mensal: {
        start: { from: "R$ 189,90", price: "R$ 129,90", suffix: "/mês" },
        peak: { from: "R$ 239,90", price: "R$ 149,90", suffix: "/mês" },
        pro: { from: "R$ 329,90", price: "R$ 219,90", suffix: "/mês" },
      },
      anual: {
        start: { from: "R$ 189,90", price: "R$ 109,90", suffix: "/mês" },
        peak: { from: "R$ 239,90", price: "R$ 129,90", suffix: "/mês" },
        pro: { from: "R$ 329,90", price: "R$ 189,90", suffix: "/mês" },
      },
    };

    const apply = (state) => {
      toggle.dataset.billingState = state;
      toggle.querySelectorAll("[data-billing]").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.billing === state);
      });

      cards.forEach((card) => {
        const key = card.dataset.plan;
        const entry = data[state]?.[key];
        if (!entry) return;
        const from = card.querySelector("[data-from]");
        const price = card.querySelector("[data-price]");
        const suffix = card.querySelector(".priceCard__now small");
        if (from) from.textContent = entry.from;
        if (price) price.textContent = entry.price;
        if (suffix) suffix.textContent = entry.suffix;
      });
    };

    toggle.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-billing]");
      if (!btn) return;
      apply(btn.dataset.billing);
    });

    apply("mensal");
  };

  const wireSimulator = () => {
    const goal = document.querySelector("[data-goal]");
    const time = document.querySelector("[data-time]");
    const run = document.querySelector("[data-simulate]");
    const root = document.querySelector("[data-result]");
    if (!goal || !time || !run || !root) return;

    const el = {
      meta: root.querySelector("[data-result-meta]"),
      title: root.querySelector("[data-result-title]"),
      text: root.querySelector("[data-result-text]"),
      focus: root.querySelector("[data-result-focus]"),
      split: root.querySelector("[data-result-split]"),
      classes: root.querySelector("[data-result-classes]"),
      track: root.querySelector("[data-result-track]"),
    };

    const config = {
      forca: {
        title: "Plano Peak",
        text: "Força com constância: acesso total para alternar musculação, mobilidade e aula de performance.",
        focus: "Força",
        split: "Força + Mobilidade",
        classes: "1–2x/semana",
        track: "App + Avaliação",
      },
      emagrecer: {
        title: "Plano Start",
        text: "Comece com base forte: cardio + musculação leve/moderada e aulas para aumentar gasto calórico.",
        focus: "Emagrecimento",
        split: "Cardio + Full body",
        classes: "2–3x/semana",
        track: "App + Avaliação",
      },
      condicionamento: {
        title: "Plano Peak",
        text: "Condicionamento rápido: rounds de fight/HIIT, cardio estruturado e reforço de força para sustentar.",
        focus: "Condicionamento",
        split: "HIIT + Cardio",
        classes: "2x/semana",
        track: "App + Avaliação",
      },
      mobilidade: {
        title: "Plano Pro",
        text: "Evolução com segurança: acompanhamento e progressão para mobilidade, estabilidade e força básica.",
        focus: "Mobilidade",
        split: "Mobilidade + Estabilidade",
        classes: "1x/semana",
        track: "Avaliação mensal",
      },
    };

    const formatTime = (minutes) => `${minutes} min`;

    run.addEventListener("click", () => {
      const key = goal.value;
      const minutes = Number(time.value || 60);
      const cfg = config[key] ?? config.forca;

      if (el.meta) el.meta.textContent = `Baseado em: ${formatTime(minutes)}`;
      if (el.title) el.title.textContent = cfg.title;
      if (el.text) el.text.textContent = cfg.text;
      if (el.focus) el.focus.textContent = cfg.focus;

      const splitSuffix = minutes <= 45 ? " (objetivo: consistência)" : minutes >= 75 ? " (inclui acessórios)" : "";
      if (el.split) el.split.textContent = `${cfg.split}${splitSuffix}`;

      const classesSuffix = minutes <= 45 ? " (curtas)" : minutes >= 75 ? " (com alongamento)" : "";
      if (el.classes) el.classes.textContent = `${cfg.classes}${classesSuffix}`;
      if (el.track) el.track.textContent = cfg.track;

      root.animate(
        [
          { transform: "translateY(4px)", opacity: 0.65 },
          { transform: "translateY(0px)", opacity: 1 },
        ],
        { duration: 260, easing: "ease-out" }
      );
    });
  };

  const wireLeadForm = () => {
    const form = document.querySelector("[data-lead-form]");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit']");
      if (btn) btn.textContent = "Enviado. A gente chama você.";
      form.reset();
      setTimeout(() => {
        if (btn) btn.textContent = "Agendar visita";
      }, 2200);
    });
  };

  setYear();
  syncTopbarHeight();
  window.addEventListener("resize", syncTopbarHeight, { passive: true });
  wireMenu();
  wireReveal();
  wireBilling();
  wireSimulator();
  wireLeadForm();
  setActiveLink();
})();
