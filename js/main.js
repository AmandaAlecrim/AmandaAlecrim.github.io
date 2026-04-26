import { initThemeToggle } from "./modules/theme.js";
import { initNavigation } from "./modules/navigation.js";
import { initProjects } from "./modules/projects.js";
import { initContactForm } from "./modules/contact-form.js";
import { initRevealOnScroll } from "./modules/reveal.js";
import { initFooterYear } from "./modules/footer.js";

const bootstrap = () => {
  initThemeToggle();
  initNavigation();
  initProjects();
  initContactForm();
  initRevealOnScroll();
  initFooterYear();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
