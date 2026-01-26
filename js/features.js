let skillBarsAnimated = false;

export function animateSkillBars() {
  if (skillBarsAnimated) return;

  const skillBars = document.querySelectorAll(".skill-progress");
  const skillItems = document.querySelectorAll(".skill-item");

  skillBars.forEach((bar, index) => {
    const skillLevel = bar.getAttribute("data-skill");
    const skillItem = skillItems[index];

    setTimeout(() => {
      if (skillItem) {
        skillItem.classList.add("animate");
      }

      setTimeout(() => {
        bar.style.width = `${skillLevel}%`;

        const percentageElement = skillItem.querySelector(".skill-percent");
        if (percentageElement) {
          animateNumber(percentageElement, 0, parseInt(skillLevel, 10), 1500);
        }
      }, 200);
    }, index * 150);
  });

  skillBarsAnimated = true;
}

function animateNumber(element, start, end, duration) {
  const startTime = performance.now();
  const _originalText = element.textContent;

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = easeOutCubic(progress);
    const currentNumber = Math.round(start + (end - start) * easedProgress);

    element.textContent = `${currentNumber}%`;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = `${end}%`;
    }
  }

  requestAnimationFrame(updateNumber);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function observeSkillsSection() {
  const skillsSection = document.querySelector(".skills-section");

  if (!skillsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          setTimeout(() => {
            animateSkillBars();
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  observer.observe(skillsSection);
}

export function enhanceProjectCards() {
  const projectCards = document.querySelectorAll(
    ".project-card, .project-card-detailed",
  );

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-12px) scale(1.02)";
      this.style.boxShadow =
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
      this.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
    });

    card.addEventListener("click", function (e) {
      createRippleEffect(e, this);
    });
  });
}

function createRippleEffect(event, element) {
  const ripple = document.createElement("span");
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        z-index: 1;
    `;

  if (!document.querySelector("#ripple-styles")) {
    const style = document.createElement("style");
    style.id = "ripple-styles";
    style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);
  }

  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

export function initializeParallaxEffect() {
  const heroSection = document.querySelector(".hero-section");
  const profileImage = document.querySelector(".profile-image");

  if (!heroSection || !profileImage) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (scrolled < heroSection.offsetHeight) {
      profileImage.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(${1 + scrolled * 0.0002})`;
    }
  });
}

export function initializeTypingEffect() {
  const typingElements = document.querySelectorAll("[data-typing]");

  typingElements.forEach((element) => {
    const text = element.getAttribute("data-typing") || element.textContent;
    const speed = parseInt(element.getAttribute("data-typing-speed"), 10) || 50;

    element.textContent = "";

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(typeWriter, 500);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
  });
}

export function initializeRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

export function initializeNavigationDots() {
  const sections = document.querySelectorAll("section[id]");
  if (sections.length === 0) return;

  const dotsContainer = document.createElement("div");
  dotsContainer.className = "nav-dots";
  dotsContainer.style.cssText = `
        position: fixed;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `;

  sections.forEach((section, _index) => {
    const dot = document.createElement("button");
    dot.className = "nav-dot";
    dot.setAttribute("data-section", section.id);
    dot.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #2563eb;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

    dot.addEventListener("click", () => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    dotsContainer.appendChild(dot);
  });

  document.body.appendChild(dotsContainer);

  const updateActiveDot = () => {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    let activeSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        activeSection = section.id;
      }
    });

    document.querySelectorAll(".nav-dot").forEach((dot) => {
      const isActive = dot.getAttribute("data-section") === activeSection;
      dot.style.background = isActive ? "#2563eb" : "transparent";
      dot.style.transform = isActive ? "scale(1.2)" : "scale(1)";
    });
  };

  window.addEventListener("scroll", updateActiveDot);
  updateActiveDot();
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initializeAllFeatures, 500);
});
