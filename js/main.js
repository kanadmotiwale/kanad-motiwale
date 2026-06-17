import { animateSkillBars, observeSkillsSection } from "./features.js";
import { initializeProjectFilter } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializeMobileMenu();
  observeSkillsSection();
  initializeProjectFilter();
  initializeSmoothScrolling();
  initializeScrollEffects();
  initializeEntryAnimations();
  initializeThemeToggle();
  loadContributionChart();

  if (document.querySelector("form")) {
    initializeFormHandling();
  }
});

async function loadContributionChart() {
  const wrapper = document.querySelector(".github-chart-wrapper");
  if (!wrapper) return;

  wrapper.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:1rem">Loading contributions…</p>`;

  try {
    const res = await fetch("https://github-contributions-api.jogruber.de/v4/kanadmotiwale?y=last");
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    wrapper.innerHTML = "";
    wrapper.appendChild(buildContributionSVG(data.contributions));
  } catch {
    wrapper.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:1rem">Could not load contribution data.</p>`;
  }
}

function buildContributionSVG(contributions) {
  const CELL = 11;
  const GAP  = 3;
  const STEP = CELL + GAP;
  const TOP  = 22;   // month labels
  const LEFT = 30;   // day labels

  // Light-mode blues, dark-mode blues injected via CSS
  const LIGHT = ["#ebedf0", "#9ecae1", "#6baed6", "#3182bd", "#08519c"];

  // Group into Sun-based weeks
  const weeks = [];
  let week = [];
  const firstDay = new Date(contributions[0].date + "T00:00:00").getDay();
  for (let i = 0; i < firstDay; i++) week.push(null);

  for (const c of contributions) {
    const dow = new Date(c.date + "T00:00:00").getDay();
    if (dow === 0 && week.length) { weeks.push(week); week = []; }
    week.push(c);
  }
  if (week.length) weeks.push(week);

  const W = LEFT + weeks.length * STEP;
  const H = TOP  + 7 * STEP;

  // Month labels
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let monthParts = "";
  let lastMonth  = -1;
  weeks.forEach((wk, wi) => {
    const first = wk.find(Boolean);
    if (!first) return;
    const m = new Date(first.date + "T00:00:00").getMonth();
    if (m !== lastMonth) {
      monthParts += `<text x="${LEFT + wi * STEP}" y="${TOP - 6}" font-size="10" fill="var(--text-muted)" font-family="sans-serif">${MONTHS[m]}</text>`;
      lastMonth = m;
    }
  });

  // Day labels (Mon, Wed, Fri)
  const DAY_LABELS = ["","Mon","","Wed","","Fri",""];
  let dayParts = "";
  DAY_LABELS.forEach((label, i) => {
    if (label) dayParts += `<text x="${LEFT - 4}" y="${TOP + i * STEP + CELL - 2}" font-size="9" fill="var(--text-muted)" text-anchor="end" font-family="sans-serif">${label}</text>`;
  });

  // Circles
  let circleParts = "";
  weeks.forEach((wk, wi) => {
    wk.forEach((day, di) => {
      if (!day) return;
      const cx = LEFT + wi * STEP + CELL / 2;
      const cy = TOP  + di * STEP + CELL / 2;
      const r  = CELL / 2;
      const fill = LIGHT[day.level] || LIGHT[0];
      circleParts += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" class="cb cb-${day.level}"><title>${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}</title></circle>`;
    });
  });

  // Inject dark-mode colors once
  if (!document.getElementById("cb-styles")) {
    const s = document.createElement("style");
    s.id = "cb-styles";
    s.textContent = `
      body.dark-theme .cb-0 { fill: #161b22; }
      body.dark-theme .cb-1 { fill: #0d2149; }
      body.dark-theme .cb-2 { fill: #0d419d; }
      body.dark-theme .cb-3 { fill: #1a7fe8; }
      body.dark-theme .cb-4 { fill: #58a6ff; }
    `;
    document.head.appendChild(s);
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", W);
  svg.setAttribute("height", H);
  svg.style.maxWidth = "100%";
  svg.style.display = "block";
  svg.style.margin = "0 auto";
  svg.classList.add("github-chart");
  svg.innerHTML = monthParts + dayParts + circleParts;
  return svg;
}

function initializeThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const saved = localStorage.getItem("preferred-theme") || "light";
  applyTheme(saved, btn);

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark-theme");
    applyTheme(isDark ? "light" : "dark", btn);
  });
}

const SUN_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="4"/>
  <line x1="12" y1="2" x2="12" y2="5"/>
  <line x1="12" y1="19" x2="12" y2="22"/>
  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
  <line x1="2" y1="12" x2="5" y2="12"/>
  <line x1="19" y1="12" x2="22" y2="12"/>
  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
</svg>`;

const MOON_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
</svg>`;

function applyTheme(theme, btn) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark-theme");
    btn.innerHTML = SUN_SVG;
  } else {
    document.documentElement.classList.remove("dark-theme");
    btn.innerHTML = MOON_SVG;
  }
  localStorage.setItem("preferred-theme", theme);
}

function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (linkPath && linkPath.startsWith("#")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetElement = document.getElementById(linkPath.substring(1));
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, null, linkPath);
        }
      });
    }

    if (
      linkPath === currentPage ||
      (currentPage === "index.html" && linkPath === "/") ||
      (currentPage === "" && linkPath === "index.html")
    ) {
      link.classList.add("active");
    }
  });
}

function initializeMobileMenu() {
  const header = document.querySelector(".header");
  const hamburger = document.querySelector(".nav-hamburger");
  let lastScrollY = window.scrollY;

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("nav-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      header.style.transform = "translateY(-100%)";
      if (hamburger) {
        header.classList.remove("nav-open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    } else {
      header.style.transform = "translateY(0)";
    }
    lastScrollY = window.scrollY;
  });
}

function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href.length > 1) {
        e.preventDefault();
        const targetElement = document.getElementById(href.substring(1));
        if (targetElement) {
          window.scrollTo({ top: targetElement.offsetTop - 80, behavior: "smooth" });
        }
      }
    });
  });
}

function initializeScrollEffects() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          if (entry.target.classList.contains("skills-section")) {
            setTimeout(animateSkillBars, 300);
          }
        }
      });
    },
    { threshold: 0.1, rootMargin: "-50px 0px" }
  );

  document.querySelectorAll("section").forEach((s) => observer.observe(s));
}

function initializeEntryAnimations() {
  document.querySelectorAll(".project-card, .skill-item, .stat-item").forEach((el, i) => {
    setTimeout(() => el.classList.add("animate"), i * 100);
  });
}

async function initializeFormHandling() {
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const success = form.querySelector(".form-success");
      const formspreeId = form.dataset.formspree;

      const formData = new FormData(form);
      let hasEmpty = false;
      for (const [, value] of formData.entries()) {
        if (!value.trim()) { hasEmpty = true; break; }
      }
      if (hasEmpty) {
        const orig = btn.textContent;
        btn.textContent = "Please fill in all fields";
        setTimeout(() => { btn.textContent = orig; }, 2000);
        return;
      }

      btn.textContent = "Sending…";
      btn.disabled = true;

      if (formspreeId && formspreeId !== "YOUR_FORM_ID") {
        try {
          const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" },
          });
          if (res.ok) {
            form.reset();
            if (success) { success.style.display = "block"; setTimeout(() => { success.style.display = "none"; }, 6000); }
            btn.textContent = "Message sent!";
          } else {
            btn.textContent = "Error — please email me directly";
          }
        } catch {
          btn.textContent = "Error — please email me directly";
        }
        setTimeout(() => { btn.textContent = "Send Message"; btn.disabled = false; }, 3000);
      } else {
        // Formspree not yet configured — simulate for demo
        setTimeout(() => {
          form.reset();
          if (success) { success.style.display = "block"; setTimeout(() => { success.style.display = "none"; }, 6000); }
          btn.textContent = "Send Message";
          btn.disabled = false;
        }, 1000);
      }
    });
  });
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTEwVjE5MEgyMjVWMTEwSDE3NVoiIGZpbGw9IiM5Q0E0QUYiLz4KPHA+YXRoIGQ9Ik0xOTAgMTMwQzE5MiAxMjggMTk1IDEyOCAxOTcgMTMwTDIxMCAxNDBIMTgwTDE5MCAxMzBaIiBmaWxsPSIjOUNBNEFGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjMwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4=";
      this.alt = "Image not found";
    });
  });
});

export { initializeNavigation, initializeSmoothScrolling, initializeScrollEffects };
