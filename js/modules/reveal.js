const REVEAL_SELECTOR = ".is-reveal";
const VISIBLE_CLASS = "is-visible";
const ROOT_MARGIN = "0px 0px -10% 0px";
const THRESHOLD = 0.15;

const revealAll = (elements) => {
  elements.forEach((element) => element.classList.add(VISIBLE_CLASS));
};

export const initRevealOnScroll = () => {
  const elements = document.querySelectorAll(REVEAL_SELECTOR);
  if (elements.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    revealAll(elements);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(VISIBLE_CLASS);
          instance.unobserve(entry.target);
        }
      });
    },
    { rootMargin: ROOT_MARGIN, threshold: THRESHOLD },
  );

  elements.forEach((element) => observer.observe(element));

  if (typeof MutationObserver !== "undefined") {
    const mutationObserver = new MutationObserver(() => {
      document
        .querySelectorAll(`${REVEAL_SELECTOR}:not(.${VISIBLE_CLASS})`)
        .forEach((element) => observer.observe(element));
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }
};
