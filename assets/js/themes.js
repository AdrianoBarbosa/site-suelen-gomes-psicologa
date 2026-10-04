/*
 * Paletas de cores do site. Cada paleta tem uma variante "light" e uma "dark",
 * e o modo (claro, escuro ou sistema) escolhe qual delas aplicar.
 *
 * A paleta ativa é definida em assets/js/config.js (SITE_CONFIG.palette).
 * Não existe seletor de paleta na interface: a troca é só por configuração.
 *
 * Tokens:
 *   bg, surface, surface2, border   fundo e camadas
 *   text, heading, muted            textos
 *   primary, onPrimary              botões e destaques
 *   gold                            detalhes decorativos
 */
(function () {
  const PALETTES = {
    suelen: {
      label: "Suelen Gomes (bege, azul-marinho e dourado)",
      light: {
        bg: "#f4efe9", surface: "#fbf8f4", surface2: "#eee7e1", border: "#e2d8cb",
        text: "#33394f", heading: "#002455", muted: "#676b7a",
        primary: "#002455", onPrimary: "#ffffff", gold: "#9a7c33",
      },
      dark: {
        bg: "#0d1626", surface: "#132036", surface2: "#1a2944", border: "#283a5a",
        text: "#e3dccf", heading: "#f4efe9", muted: "#a5abba",
        primary: "#d1b26a", onPrimary: "#14100a", gold: "#d1b26a",
      },
    },
    salvia: {
      label: "Sálvia",
      light: {
        bg: "#f2f4ef", surface: "#fafbf8", surface2: "#e7ebe2", border: "#d6ddcf",
        text: "#34403a", heading: "#26392f", muted: "#66726b",
        primary: "#3f5f4c", onPrimary: "#ffffff", gold: "#8b7a45",
      },
      dark: {
        bg: "#121815", surface: "#18201c", surface2: "#202a25", border: "#2f3c35",
        text: "#dde3dc", heading: "#f0f3ee", muted: "#9faba3",
        primary: "#a9c4a8", onPrimary: "#14201a", gold: "#c9b77d",
      },
    },
    terracota: {
      label: "Terracota",
      light: {
        bg: "#f7f1ec", surface: "#fdfaf7", surface2: "#f0e5dc", border: "#e3d3c6",
        text: "#43352f", heading: "#5a2f22", muted: "#77675f",
        primary: "#9a4a33", onPrimary: "#ffffff", gold: "#a77d3c",
      },
      dark: {
        bg: "#1a1311", surface: "#221917", surface2: "#2c211e", border: "#3d2e2a",
        text: "#eaded6", heading: "#f7efe9", muted: "#b3a39a",
        primary: "#e09a7f", onPrimary: "#2a130b", gold: "#d7ae6c",
      },
    },
    lavanda: {
      label: "Lavanda",
      light: {
        bg: "#f5f3f8", surface: "#fcfbfd", surface2: "#ebe7f2", border: "#dbd5e6",
        text: "#3b3748", heading: "#2f2552", muted: "#6c6780",
        primary: "#55457f", onPrimary: "#ffffff", gold: "#9a7f45",
      },
      dark: {
        bg: "#14121c", surface: "#1b1825", surface2: "#242031", border: "#342e45",
        text: "#e2deeb", heading: "#f3f0f8", muted: "#a7a1b8",
        primary: "#b9a8e6", onPrimary: "#1b1430", gold: "#d2b878",
      },
    },
  };

  const DEFAULT_PALETTE = "suelen";

  function resolveMode(mode) {
    if (mode === "light" || mode === "dark") return mode;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Aplica a paleta como variáveis CSS no <html>. Devolve o modo efetivo ("light" ou "dark").
  function applyTheme(paletteName, mode) {
    const palette = PALETTES[paletteName] || PALETTES[DEFAULT_PALETTE];
    const resolved = resolveMode(mode);
    const tokens = palette[resolved];
    const root = document.documentElement;
    for (const [key, value] of Object.entries(tokens)) {
      root.style.setProperty("--" + key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()), value);
    }
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", tokens.bg);
    return resolved;
  }

  window.THEMES = { PALETTES, DEFAULT_PALETTE, resolveMode, applyTheme };
})();
