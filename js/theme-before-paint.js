(() => {
  try {
    const storedTheme = localStorage.getItem("portfolio-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  } catch {
  }
})();