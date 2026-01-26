import { animateSkillBars, observeSkillsSection } from "./features.js";
import { initializeProjectFilter } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Homepage loaded successfully!");

  initializeNavigation();
  initializeMobileMenu();
  observeSkillsSection();
  initializeProjectFilter();
  initializeSmoothScrolling();
  initializeScrollEffects();
  initializeAnimations();
});

function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (linkPath.startsWith("#")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = linkPath.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

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
  const nav = document.querySelector(".nav");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      nav.style.transform = "translateY(-100%)";
    } else {
      nav.style.transform = "translateY(0)";
    }
    lastScrollY = window.scrollY;
  });
}

function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href !== "#" && href.length > 1) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

function initializeScrollEffects() {
  const sections = document.querySelectorAll("section");
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "-50px 0px",
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");

        if (entry.target.classList.contains("skills-section")) {
          setTimeout(() => {
            animateSkillBars();
          }, 300);
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

function initializeAnimations() {
  const style = document.createElement("style");
  style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .slide-in-left {
            opacity: 0;
            transform: translateX(-50px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .slide-in-left.visible {
            opacity: 1;
            transform: translateX(0);
        }
        
        .section-visible {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .skill-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .skill-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .project-card {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .project-card.animate {
            opacity: 1;
            transform: scale(1);
        }
    `;
  document.head.appendChild(style);

  const animatedElements = document.querySelectorAll(
    ".project-card, .skill-item, .stat-item",
  );
  animatedElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("animate");
    }, index * 100);
  });
}

const ctaButton = document.querySelector(".cta-button");
if (ctaButton) {
  ctaButton.addEventListener("click", () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

function initializeFormHandling() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      let isValid = true;

      for (const [_key, value] of formData.entries()) {
        if (!value.trim()) {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        submitButton.textContent = "Sending...";
        submitButton.disabled = true;

        setTimeout(() => {
          submitButton.textContent = "Message Sent!";
          form.reset();

          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
          }, 2000);
        }, 1000);
      }
    });
  });
}

if (document.querySelector("form")) {
  initializeFormHandling();
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("error", function () {
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTEwVjE5MEgyMjVWMTEwSDE3NVoiIGZpbGw9IiM5Q0E0QUYiLz4KPHA+YXRoIGQ9Ik0xOTAgMTMwQzE5MiAxMjggMTk1IDEyOCAxOTcgMTMwTDIxMCAxNDBIMTgwTDE5MCAxMzBaIiBmaWxsPSIjOUNBNEFGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjMwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4=";
      this.alt = "Placeholder image - original image not found";
    });
  });
});

export {
  initializeNavigation,
  initializeSmoothScrolling,
  initializeScrollEffects,
};
