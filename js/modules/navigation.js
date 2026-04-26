const NAV_SELECTOR = ".site-nav";
const TOGGLE_SELECTOR = ".site-nav__toggle";
const MENU_SELECTOR = ".site-nav__menu";
const LINK_SELECTOR = ".site-nav__link";
const MOBILE_BREAKPOINT_PX = 768;

const setMenuOpen = (nav, toggle, isOpen) => {
  nav.dataset.open = String(isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
};

const closeMenu = (nav, toggle) => setMenuOpen(nav, toggle, false);

const bindMenuInteractions = (nav, toggle, menu) => {
  toggle.addEventListener("click", () => {
    const isOpen = nav.dataset.open === "true";
    setMenuOpen(nav, toggle, !isOpen);
  });

  menu.addEventListener("click", (event) => {
    if (event.target.matches(LINK_SELECTOR)) {
      closeMenu(nav, toggle);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(nav, toggle);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_BREAKPOINT_PX) closeMenu(nav, toggle);
  });
};

const observeActiveSection = (links) => {
  const sections = Array.from(links)
    .map((link) => {
      const id = link.getAttribute("href")?.replace("#", "");
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if (sections.length === 0 || !("IntersectionObserver" in window)) return;

  const linkBySectionId = new Map(
    Array.from(links).map((link) => [link.getAttribute("href")?.slice(1), link]),
  );

  const setActive = (sectionId) => {
    links.forEach((link) => link.removeAttribute("aria-current"));
    const activeLink = linkBySectionId.get(sectionId);
    if (activeLink) activeLink.setAttribute("aria-current", "true");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActive(visible.target.id);
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
  );

  sections.forEach((section) => observer.observe(section));
};

export const initNavigation = () => {
  const nav = document.querySelector(NAV_SELECTOR);
  const toggle = document.querySelector(TOGGLE_SELECTOR);
  const menu = document.querySelector(MENU_SELECTOR);
  const links = document.querySelectorAll(LINK_SELECTOR);

  if (!nav || !toggle || !menu) return;

  bindMenuInteractions(nav, toggle, menu);
  observeActiveSection(links);
};
