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

  try {
    const res = await fetch("https://ghchart.rshah.org/kanadmotiwale");
    const svgText = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) throw new Error("No SVG found");

    // Turn every contribution square into a circle
    svg.querySelectorAll("rect").forEach((rect) => {
      const w = parseFloat(rect.getAttribute("width") || "0");
      if (w > 0 && w < 20) {
        const r = (w / 2).toFixed(1);
        rect.setAttribute("rx", r);
        rect.setAttribute("ry", r);
      }
    });

    svg.setAttribute("width", "100%");
    svg.removeAttribute("height");
    svg.style.display = "block";
    svg.classList.add("github-chart");

    wrapper.innerHTML = "";
    wrapper.appendChild(svg);
  } catch {
    // fallback: keep the img tag if fetch fails (e.g. CORS)
    const img = document.createElement("img");
    img.src = "https://ghchart.rshah.org/kanadmotiwale";
    img.alt = "GitHub contribution chart";
    img.className = "github-chart";
    wrapper.innerHTML = "";
    wrapper.appendChild(img);
  }
}

function initializeThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const saved = localStorage.getItem("preferred-theme") || "light";
  applyTheme(saved, btn);

  btn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
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
    document.body.classList.add("dark-theme");
    btn.innerHTML = SUN_SVG;
  } else {
    document.body.classList.remove("dark-theme");
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

function initializeFormHandling() {
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const btn = form.querySelector('button[type="submit"]');
      const success = form.querySelector(".form-success");

      let hasEmpty = false;
      for (const [, value] of formData.entries()) {
        if (!value.trim()) { hasEmpty = true; break; }
      }
      if (hasEmpty) {
        btn.textContent = "Please fill in all fields";
        setTimeout(() => { btn.textContent = "Send Message"; }, 2000);
        return;
      }
      btn.textContent = "Sending...";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = "Send Message";
        btn.disabled = false;
        form.reset();
        if (success) {
          success.style.display = "block";
          setTimeout(() => { success.style.display = "none"; }, 5000);
        }
      }, 1000);
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
