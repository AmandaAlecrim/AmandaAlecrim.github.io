const YEAR_SELECTOR = "[data-current-year]";

export const initFooterYear = () => {
  const node = document.querySelector(YEAR_SELECTOR);
  if (!node) return;
  node.textContent = String(new Date().getFullYear());
};
