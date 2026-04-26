const STORAGE_KEY = "portfolio-theme";
const THEME_ATTRIBUTE = "data-theme";
const TOGGLE_SELECTOR = ".theme-toggle";

const Theme = Object.freeze({
  Dark: "dark",
  Light: "light",
});

const isValidTheme = (value) => value === Theme.Dark || value === Theme.Light;

const readStoredTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isValidTheme(stored) ? stored : null;
  } catch {
    return null;
  }
};

const persistTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* localStorage indisponível: ignora silenciosamente. */
  }
};

const getCurrentTheme = () => {
  const current = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isValidTheme(current) ? current : Theme.Dark;
};

const applyTheme = (theme, toggleButton) => {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);

  if (toggleButton) {
    const isDark = theme === Theme.Dark;
    toggleButton.setAttribute("aria-pressed", String(isDark));
    toggleButton.setAttribute(
      "aria-label",
      isDark ? "Ativar tema claro" : "Ativar tema escuro",
    );
  }
};

const toggleTheme = (toggleButton) => {
  const next = getCurrentTheme() === Theme.Dark ? Theme.Light : Theme.Dark;
  applyTheme(next, toggleButton);
  persistTheme(next);
};

export const initThemeToggle = () => {
  const toggleButton = document.querySelector(TOGGLE_SELECTOR);
  if (!toggleButton) return;

  const initialTheme = readStoredTheme() ?? getCurrentTheme();
  applyTheme(initialTheme, toggleButton);

  toggleButton.addEventListener("click", () => toggleTheme(toggleButton));
};
