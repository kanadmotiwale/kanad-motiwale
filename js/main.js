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

  if (document.querySelector("form")) {
    initializeFormHandling();
  }
});

function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (linkPath.startsWith("#")) {
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
      for (const [, value] of formData.entries()) {
        if (!value.trim()) return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const success = form.querySelector(".form-success");
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
