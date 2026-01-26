export function initializeProjectFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card-detailed");

  if (filterButtons.length === 0) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      filterProjects(filter, projectCards);
    });
  });
}

function filterProjects(filter, cards) {
  cards.forEach((card, index) => {
    const categories = card.getAttribute("data-category") || "";
    const shouldShow = filter === "all" || categories.includes(filter);

    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    card.style.opacity = "0";
    card.style.transform = "scale(0.8)";

    setTimeout(
      () => {
        if (shouldShow) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.display = "none";
        }
      },
      150 + index * 50,
    );
  });
}

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    right: rect.right + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
}

export function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("LocalStorage not available:", e);
      return false;
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn("Error reading from LocalStorage:", e);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn("Error removing from LocalStorage:", e);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.warn("Error clearing LocalStorage:", e);
      return false;
    }
  },
};

export const theme = {
  toggle() {
    const body = document.body;
    const isDark = body.classList.contains("dark-theme");

    if (isDark) {
      body.classList.remove("dark-theme");
      this.set("light");
    } else {
      body.classList.add("dark-theme");
      this.set("dark");
    }
  },

  set(themeName) {
    document.body.className = document.body.className.replace(/theme-\w+/, "");
    document.body.classList.add(`${themeName}-theme`);
    storage.set("preferred-theme", themeName);
  },

  get() {
    return storage.get("preferred-theme") || "light";
  },

  init() {
    const savedTheme = this.get();
    if (savedTheme) {
      this.set(savedTheme);
    }
  },
};

export const validation = {
  email(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  required(value) {
    return value && value.trim().length > 0;
  },

  minLength(value, length) {
    return value && value.trim().length >= length;
  },

  maxLength(value, length) {
    return value && value.trim().length <= length;
  },

  phone(phone) {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  url(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

export const animations = {
  fadeIn(element, duration = 300) {
    element.style.opacity = "0";
    element.style.display = "block";

    const start = window.performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      element.style.opacity = progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  },

  fadeOut(element, duration = 300) {
    const start = performance.now();
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);

    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      element.style.opacity = initialOpacity * (1 - progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = "none";
      }
    }

    requestAnimationFrame(animate);
  },

  slideUp(element, duration = 300) {
    const height = element.offsetHeight;
    element.style.height = `${height}px`;
    element.style.transition = `height ${duration}ms ease`;
    element.style.overflow = "hidden";

    requestAnimationFrame(() => {
      element.style.height = "0px";
      setTimeout(() => {
        element.style.display = "none";
        element.style.height = "";
        element.style.transition = "";
        element.style.overflow = "";
      }, duration);
    });
  },

  slideDown(element, duration = 300) {
    element.style.display = "block";
    const height = element.scrollHeight;
    element.style.height = "0px";
    element.style.transition = `height ${duration}ms ease`;
    element.style.overflow = "hidden";

    requestAnimationFrame(() => {
      element.style.height = `${height}px`;
      setTimeout(() => {
        element.style.height = "";
        element.style.transition = "";
        element.style.overflow = "";
      }, duration);
    });
  },
};

export const url = {
  getParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  setParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, "", url);
  },

  removeParam(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.pushState({}, "", url);
  },

  hash: {
    get() {
      return window.location.hash.substring(1);
    },

    set(value) {
      window.location.hash = value;
    },

    remove() {
      history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search,
      );
    },
  },
};

export const perfUtils = {
  measure(name, fn) {
    const start = window.performance.now();
    const result = fn();
    const end = window.performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  },

  async measureAsync(name, fn) {
    const start = window.performance.now();
    const result = await fn();
    const end = window.performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  },

  log() {
    const navigation = window.performance.getEntriesByType("navigation")[0];
    console.log("Page Load Performance:");
    console.log(
      `DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`,
    );
    console.log(
      `Page Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`,
    );
  },
};

document.addEventListener("DOMContentLoaded", () => {
  theme.init();

  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        performance.log();
      }, 1000);
    });
  }
});

export default {
  isMobileDevice,
  getElementPosition,
  debounce,
  throttle,
  storage,
  theme,
  validation,
  animations,
  url,
  perfUtils,
  initializeProjectFilter,
};
