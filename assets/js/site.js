/*
  Patrick Mandarino — Personal Site
  --------------------------------
  Lightweight JavaScript for:
  1) inlining SLDS SVG sprites so icons render reliably on GitHub Pages
  2) switching the cards between single-column mobile flow and deterministic
     multi-column desktop/tablet stacks with consistent spacing
*/

(() => {
  "use strict";

  const SLDS_VERSION = "2.29.0";
  const SPRITES = {
    utility: `https://cdn.jsdelivr.net/npm/@salesforce-ux/design-system@${SLDS_VERSION}/assets/icons/utility-sprite/svg/symbols.svg`,
    standard: `https://cdn.jsdelivr.net/npm/@salesforce-ux/design-system@${SLDS_VERSION}/assets/icons/standard-sprite/svg/symbols.svg`,
    doctype: `https://cdn.jsdelivr.net/npm/@salesforce-ux/design-system@${SLDS_VERSION}/assets/icons/doctype-sprite/svg/symbols.svg`,
  };

  const CARD_ORDER = [
    "about",
    "experience",
    "skills",
    "certifications",
    "trailhead",
    "education",
  ];

  const TABLET_LAYOUT = {
    1: ["about", "skills", "certifications"],
    2: ["experience", "trailhead", "education"],
  };

  const DESKTOP_LAYOUT = {
    1: ["about", "certifications"],
    2: ["experience", "education"],
    3: ["skills", "trailhead"],
  };

  async function inlineSprite(spriteType, url, spriteContainer) {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(
        `Failed to load SLDS sprite: ${spriteType} (${response.status})`,
      );
    }

    const svgText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");

    doc.querySelectorAll("symbol").forEach((symbol) => {
      const originalId = symbol.getAttribute("id");
      if (!originalId) return;
      symbol.setAttribute("id", `${spriteType}-${originalId}`);
      spriteContainer.appendChild(symbol);
    });
  }

  async function initSldsSprites() {
    const spriteContainer = document.getElementById("pm-slds-sprite");
    if (!spriteContainer) return;

    try {
      await Promise.all([
        inlineSprite("utility", SPRITES.utility, spriteContainer),
        inlineSprite("standard", SPRITES.standard, spriteContainer),
        inlineSprite("doctype", SPRITES.doctype, spriteContainer),
      ]);
      document.body.dataset.sldsIcons = "loaded";
    } catch (err) {
      console.warn("[pm-site] SLDS sprite load failed:", err);
      document.body.dataset.sldsIcons = "failed";
    }
  }

  function moveCards(target, ids) {
    ids.forEach((id) => {
      const card = document.getElementById(id);
      if (card && target) {
        target.appendChild(card);
      }
    });
  }

  function initCurrentYear() {
    const yearEl = document.getElementById("pm-current-year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  function initResponsiveCardLayout() {
    const body = document.body;
    const flow = document.getElementById("pm-card-flow");
    const columns = document.getElementById("pm-card-columns");

    if (!body || !flow || !columns) return;

    const col1 = columns.querySelector('[data-pm-column="1"]');
    const col2 = columns.querySelector('[data-pm-column="2"]');
    const col3 = columns.querySelector('[data-pm-column="3"]');

    const tabletMql = window.matchMedia("(min-width: 48em)");
    const desktopMql = window.matchMedia("(min-width: 80em)");

    function applyLayout() {
      if (desktopMql.matches) {
        body.dataset.pmLayout = "three-column";
        flow.hidden = true;
        columns.hidden = false;

        moveCards(col1, DESKTOP_LAYOUT["1"]);
        moveCards(col2, DESKTOP_LAYOUT["2"]);
        moveCards(col3, DESKTOP_LAYOUT["3"]);
        return;
      }

      if (tabletMql.matches) {
        body.dataset.pmLayout = "two-column";
        flow.hidden = true;
        columns.hidden = false;

        moveCards(col1, TABLET_LAYOUT["1"]);
        moveCards(col2, TABLET_LAYOUT["2"]);
        return;
      }

      body.dataset.pmLayout = "single-column";
      columns.hidden = true;
      flow.hidden = false;
      moveCards(flow, CARD_ORDER);
    }

    applyLayout();

    const handleChange = () => {
      window.requestAnimationFrame(applyLayout);
    };

    if (tabletMql.addEventListener) {
      tabletMql.addEventListener("change", handleChange);
      desktopMql.addEventListener("change", handleChange);
    } else {
      tabletMql.addListener(handleChange);
      desktopMql.addListener(handleChange);
    }

    window.addEventListener("orientationchange", handleChange);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSldsSprites();
    initCurrentYear();
    initResponsiveCardLayout();
  });
})();
