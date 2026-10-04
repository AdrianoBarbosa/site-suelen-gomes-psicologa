import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import htm from "htm";

const html = htm.bind(React.createElement);
const CFG = window.SITE_CONFIG;
const C = window.CONTENT;
const { applyTheme } = window.THEMES;
const MODES = ["light", "dark", "system"];

/* ---------- utilitários ---------- */

function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try { return localStorage.getItem(key) || initial; } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, value); } catch { /* armazenamento indisponível */ }
  }, [key, value]);
  return [value, setValue];
}

/* ---------- ícones (traço 24x24) ---------- */

const ICONS = {
  sun: html`<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />`,
  moon: html`<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />`,
  monitor: html`<rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />`,
  mail: html`<rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />`,
  pin: html`<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />`,
  leaf: html`<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />`,
  badge: html`<path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" /><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />`,
  chat: html`<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />`,
  ear: html`<path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" /><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" />`,
  hourglass: html`<path d="M5 22h14M5 2h14M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2" />`,
  instagram: html`<rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />`,
  arrowRight: html`<path d="M5 12h14M12 5l7 7-7 7" />`,
  arrowDown: html`<path d="M12 5v14M19 12l-7 7-7-7" />`,
  external: html`<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />`,
  copy: html`<rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />`,
  check: html`<path d="M20 6 9 17l-5-5" />`,
  heart: html`<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />`,
  menu: html`<path d="M4 6h16M4 12h16M4 18h16" />`,
  close: html`<path d="M18 6 6 18M6 6l12 12" />`,
};

const WHATSAPP = "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.04c0-5.22 4.25-9.46 9.48-9.46 2.53 0 4.91.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.69c0 5.22-4.25 9.47-9.47 9.47zm8.06-17.53A11.33 11.33 0 0 0 12.05.63C5.77.63.66 5.73.66 12.01c0 2.01.52 3.97 1.52 5.69L.57 23.63l6.07-1.59a11.4 11.4 0 0 0 5.41 1.38h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.34-8.06z";

function Icon({ name, size = 20 }) {
  if (name === "whatsapp") {
    return html`<svg class="icon" width=${size} height=${size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d=${WHATSAPP} /></svg>`;
  }
  return html`<svg class="icon" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${React.Children.toArray(ICONS[name])}</svg>`;
}

function Logo({ className = "" }) {
  return html`
    <span class=${`logo ${className}`}>
      <img class="logo-light" src="assets/img/logo.svg" alt=${`${CFG.shortName}, Psicóloga`} />
      <img class="logo-dark" src="assets/img/logo-dark.svg" alt="" aria-hidden="true" />
    </span>`;
}

/* ---------- animação ao rolar ---------- */

function Reveal({ as = "div", className = "", delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setVisible(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return React.createElement(as, {
    ref, className: `reveal ${visible ? "in" : ""} ${className}`, style: { transitionDelay: `${delay}ms` }, ...rest,
  }, children);
}

/* ---------- cabeçalho ---------- */

function Header({ mode, setMode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["about", "psychoanalysis", "how", "contact"];
  const modeIcon = { light: "sun", dark: "moon", system: "monitor" };

  return html`
    <header class=${`header ${scrolled ? "scrolled" : ""}`}>
      <div class="container header-inner">
        <a href="#top" class="brand" aria-label=${CFG.shortName}><${Logo} /></a>

        <nav id="main-nav" class=${`nav ${open ? "open" : ""}`} aria-label="Principal">
          ${links.map((id) => html`<a key=${id} href=${"#" + id} onClick=${() => setOpen(false)}>${C.nav[id]}</a>`)}
        </nav>

        <div class="controls">
          <div class="segmented" role="group" aria-label=${C.controls.theme}>
            ${MODES.map((m) => html`
              <button key=${m} type="button" aria-pressed=${mode === m} onClick=${() => setMode(m)}
                title=${C.controls.modes[m]} aria-label=${C.controls.modes[m]}>
                <${Icon} name=${modeIcon[m]} size=${15} />
              </button>`)}
          </div>
          <a class="btn btn-primary btn-sm header-cta" href=${CFG.whatsapp} target="_blank" rel="noopener">
            <${Icon} name="whatsapp" size=${16} />${C.controls.schedule}
          </a>
          <button type="button" class="menu-btn" aria-expanded=${open} aria-controls="main-nav"
            aria-label=${C.controls.menu} onClick=${() => setOpen(!open)}>
            <${Icon} name=${open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>`;
}

/* ---------- seções ---------- */

function Hero() {
  return html`
    <section id="top" class="hero">
      <div class="container hero-grid">
        <div class="hero-text">
          <${Reveal}><p class="eyebrow">${C.hero.eyebrow}</p><//>
          <${Reveal} delay=${80}><h1 class="hero-title">${CFG.shortName}</h1><//>
          <${Reveal} delay=${140}><p class="hero-lead">${C.hero.lead}</p><//>
          <${Reveal} delay=${200} className="hero-cta">
            <a class="btn btn-primary" href=${CFG.whatsapp} target="_blank" rel="noopener"><${Icon} name="whatsapp" />${C.hero.cta}</a>
            <a class="btn btn-ghost" href="#psychoanalysis">${C.hero.secondary}<${Icon} name="arrowDown" size=${18} /></a>
          <//>
          <${Reveal} delay=${260}><p class="hero-meta"><span>${CFG.crp}</span><span class="dot-sep" aria-hidden="true"></span><span>${CFG.city}</span></p><//>
        </div>
        <${Reveal} delay=${120} className="hero-visual">
          <div class="emblem">
            <span class="blob" aria-hidden="true"></span>
            <div class="emblem-circle">
              <${Logo} className="logo-hero" />
            </div>
          </div>
        <//>
      </div>
    </section>`;
}

function SectionHead({ kicker, title, intro, center }) {
  return html`
    <${Reveal} className=${`section-head ${center ? "center" : ""}`}>
      <p class="kicker">${kicker}</p>
      <h2>${title}</h2>
      ${intro && html`<p class="section-intro">${intro}</p>`}
    <//>`;
}

function About() {
  return html`
    <section id="about" class="section">
      <div class="container about-grid">
        <div>
          <${SectionHead} kicker=${C.about.kicker} title=${C.about.title} />
          <${Reveal} className="prose">
            ${C.about.paragraphs.map((p, i) => html`<p key=${i}>${p}</p>`)}
          <//>
        </div>
        <${Reveal} delay=${100} as="ul" className="facts">
          ${C.about.facts.map((f) => html`
            <li key=${f.label}><span class="fact-icon"><${Icon} name=${f.icon} /></span>${f.label}</li>`)}
        <//>
      </div>
    </section>`;
}

function Psychoanalysis() {
  return html`
    <section id="psychoanalysis" class="section section-alt">
      <div class="container">
        <${SectionHead} kicker=${C.psychoanalysis.kicker} title=${C.psychoanalysis.title} intro=${C.psychoanalysis.intro} center />
        <div class="cards">
          ${C.psychoanalysis.cards.map((c, i) => html`
            <${Reveal} as="article" key=${c.title} delay=${i * 90} className="card">
              <span class="card-icon"><${Icon} name=${c.icon} size=${24} /></span>
              <h3>${c.title}</h3>
              <p>${c.text}</p>
            <//>`)}
        </div>
      </div>
    </section>`;
}

function Reasons() {
  return html`
    <section class="section">
      <div class="container reasons-grid">
        <${SectionHead} kicker=${C.reasons.kicker} title=${C.reasons.title} intro=${C.reasons.intro} />
        <div>
          <${Reveal} as="ul" className="reasons">
            ${C.reasons.items.map((r) => html`<li key=${r}><${Icon} name="leaf" size=${18} />${r}</li>`)}
          <//>
          <${Reveal} delay=${80} className="emergency"><${Icon} name="heart" size=${18} /><p>${C.reasons.emergency}</p><//>
        </div>
      </div>
    </section>`;
}

function How() {
  return html`
    <section id="how" class="section section-alt">
      <div class="container">
        <${SectionHead} kicker=${C.how.kicker} title=${C.how.title} center />
        <ol class="steps">
          ${C.how.steps.map((s, i) => html`
            <${Reveal} as="li" key=${s.title} delay=${i * 90} className="step">
              <span class="step-num">${String(i + 1).padStart(2, "0")}</span>
              <h3>${s.title}</h3>
              <p>${s.text}</p>
            <//>`)}
        </ol>
      </div>
    </section>`;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CFG.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { window.location.href = `mailto:${CFG.email}`; }
  };

  const items = [
    { icon: "whatsapp", label: C.contact.whatsapp, value: CFG.phone, href: CFG.whatsapp, featured: true },
    { icon: "mail", label: C.contact.email, value: CFG.email, href: `mailto:${CFG.email}`, copy: true },
    { icon: "instagram", label: C.contact.instagram, value: CFG.instagramUser, href: CFG.instagram },
    { icon: "pin", label: C.contact.address, value: `${CFG.address} · ${CFG.city}`, href: CFG.maps, action: C.contact.map },
  ];

  return html`
    <section id="contact" class="section">
      <div class="container">
        <${SectionHead} kicker=${C.contact.kicker} title=${C.contact.title} intro=${C.contact.text} center />
        <div class="contact-grid">
          ${items.map((it, i) => html`
            <${Reveal} key=${it.label} delay=${i * 70} className=${`contact-card ${it.featured ? "featured" : ""}`}>
              <span class="contact-icon"><${Icon} name=${it.icon} size=${24} /></span>
              <div class="contact-body">
                <span class="contact-label">${it.label}</span>
                <a class="contact-value" href=${it.href} target=${it.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener">${it.value}</a>
              </div>
              ${it.copy && html`
                <button type="button" class="icon-action" onClick=${copy} aria-live="polite" title=${copied ? C.contact.copied : C.contact.copy}>
                  <${Icon} name=${copied ? "check" : "copy"} size=${18} /><span class="sr-only">${copied ? C.contact.copied : C.contact.copy}</span>
                </button>`}
              ${it.action && html`
                <a class="icon-action" href=${it.href} target="_blank" rel="noopener" title=${it.action}>
                  <${Icon} name="external" size=${18} /><span class="sr-only">${it.action}</span>
                </a>`}
            <//>`)}
        </div>
      </div>
    </section>`;
}

function Footer() {
  return html`
    <footer class="footer">
      <div class="container footer-inner">
        <${Logo} className="logo-footer" />
        <p><strong>${CFG.name}</strong><br />${C.footer.role} · ${CFG.crp}</p>
        <p class="muted">${CFG.phone} · ${CFG.email}<br />${CFG.address} · ${CFG.city}</p>
        <p class="muted small">© ${new Date().getFullYear()} ${CFG.shortName}</p>
      </div>
    </footer>`;
}

function FloatingWhatsApp() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return html`
    <a class=${`fab ${show ? "show" : ""}`} href=${CFG.whatsapp} target="_blank" rel="noopener" aria-label=${C.controls.whatsapp} title=${C.controls.whatsapp}>
      <${Icon} name="whatsapp" size=${28} />
    </a>`;
}

/* ---------- app ---------- */

function App() {
  const [mode, setMode] = useStoredState("mode", "system");

  useEffect(() => {
    applyTheme(CFG.palette, mode);
    if (mode !== "system" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(CFG.palette, "system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  return html`
    <a class="skip" href="#about">${C.controls.skip}</a>
    <${Header} mode=${mode} setMode=${setMode} />
    <main>
      <${Hero} />
      <${About} />
      <${Psychoanalysis} />
      <${Reasons} />
      <${How} />
      <${Contact} />
    </main>
    <${Footer} />
    <${FloatingWhatsApp} />`;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
