import { projects } from "../data/projects-data.js";

const LIST_SELECTOR = "#projects-list";
const FILTERS_ROOT_ID = "projects-filters-root";
const EMPTY_STATE_MESSAGE = "Nenhum projeto cadastrado ainda.";
const EMPTY_FILTER_MESSAGE = "Nenhum projeto corresponde aos filtros selecionados.";
const GALLERY_TRIGGER_SELECTOR = "[data-open-gallery]";
const YEAR_NONE_VALUE = "__no_year__";

const createElement = (tag, { className, text, attributes } = {}) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  if (attributes) {
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  }
  return element;
};

const getProjectImages = (project) => {
  const images = project?.images;
  if (!images || typeof images !== "object") return null;

  const count = Number(images.count);
  if (!Number.isFinite(count) || count <= 0) return null;

  const ext = typeof images.ext === "string" ? images.ext.trim().toLowerCase() : "";
  if (!ext) return null;

  return { count: Math.min(count, 6), ext };
};

const getProjectThumbnail = (project) => {
  const thumb = project?.thumbnail;
  if (!thumb || typeof thumb !== "object") return null;
  const ext = typeof thumb.ext === "string" ? thumb.ext.trim().toLowerCase() : "";
  if (!ext) return null;
  return { ext };
};

const buildProjectAssetsBasePath = (projectId) => `./assets/projects/${projectId}`;
const buildThumbnailPath = (projectId, ext) =>
  `./assets/projects/thumbnails/${projectId}.${ext}`;

const pad2 = (value) => String(value).padStart(2, "0");

const buildGalleryItems = (project, images) => {
  const base = buildProjectAssetsBasePath(project.id);
  return Array.from({ length: images.count }, (_, index) => {
    const number = pad2(index + 1);
    return {
      src: `${base}/${number}.${images.ext}`,
      alt: project.title ? `Imagem ${index + 1} — ${project.title}` : `Imagem ${index + 1}`,
    };
  });
};

const ensureGalleryDialog = () => {
  const existing = document.getElementById("project-gallery");
  if (existing) return existing;

  const dialog = document.createElement("dialog");
  dialog.id = "project-gallery";
  dialog.className = "gallery-dialog";
  dialog.innerHTML = `
    <div class="gallery-dialog__panel" role="document" aria-label="Galeria do projeto">
      <div class="gallery-dialog__header">
        <h3 class="gallery-dialog__title" data-gallery-title>Imagens do projeto</h3>
        <p class="gallery-dialog__counter" data-gallery-counter aria-live="polite"></p>
        <button class="gallery-dialog__close" type="button" data-close-gallery aria-label="Fechar galeria">
          ✕
        </button>
      </div>
      <div class="gallery-dialog__stage" data-gallery-stage>
        <div class="gallery-dialog__viewport" data-gallery-viewport>
          <div class="gallery-dialog__track" data-gallery-track></div>
          <button class="gallery-dialog__nav gallery-dialog__nav--prev" type="button" data-gallery-prev aria-label="Imagem anterior">
            ‹
          </button>
          <button class="gallery-dialog__nav gallery-dialog__nav--next" type="button" data-gallery-next aria-label="Próxima imagem">
            ›
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  const state = { title: "", items: [], index: 0 };
  const titleNode = dialog.querySelector("[data-gallery-title]");
  const counterNode = dialog.querySelector("[data-gallery-counter]");
  const viewportNode = dialog.querySelector("[data-gallery-viewport]");
  const trackNode = dialog.querySelector("[data-gallery-track]");
  const prevButton = dialog.querySelector("[data-gallery-prev]");
  const nextButton = dialog.querySelector("[data-gallery-next]");

  const setScrollLock = (isLocked) => {
    if (isLocked) {
      document.documentElement.dataset.modalOpen = "true";
    } else {
      delete document.documentElement.dataset.modalOpen;
    }
  };

  const updateNavPosition = () => {
    if (!viewportNode || !trackNode) return;
    const slides = trackNode.children;
    const slide = slides[state.index];
    if (!(slide instanceof HTMLElement)) return;
    const img = slide.querySelector("img");
    if (!(img instanceof HTMLImageElement)) return;

    const viewportRect = viewportNode.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const centerY = imgRect.top - viewportRect.top + imgRect.height / 2;

    if (Number.isFinite(centerY) && centerY > 0) {
      viewportNode.style.setProperty("--gallery-nav-top", `${centerY}px`);
    } else {
      viewportNode.style.removeProperty("--gallery-nav-top");
    }
  };

  const update = () => {
    const total = state.items.length;
    if (!trackNode || total === 0) return;
    const safeIndex = ((state.index % total) + total) % total;
    state.index = safeIndex;

    trackNode.style.transform = `translate3d(${-safeIndex * 100}%, 0, 0)`;

    if (counterNode) {
      counterNode.textContent = total > 0 ? `${safeIndex + 1} / ${total}` : "";
    }

    if (prevButton instanceof HTMLButtonElement) prevButton.disabled = total <= 1;
    if (nextButton instanceof HTMLButtonElement) nextButton.disabled = total <= 1;

    requestAnimationFrame(updateNavPosition);
  };

  const close = () => {
    if (!dialog.open) return;
    dialog.close();
  };

  const goPrev = () => {
    if (state.items.length <= 1) return;
    state.index -= 1;
    update();
  };

  const goNext = () => {
    if (state.items.length <= 1) return;
    state.index += 1;
    update();
  };

  dialog.addEventListener("close", () => setScrollLock(false));

  dialog.addEventListener("click", (event) => {
    const target = event.target;
    if (target?.matches?.("[data-close-gallery]")) close();
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });

  if (prevButton) prevButton.addEventListener("click", goPrev);
  if (nextButton) nextButton.addEventListener("click", goNext);

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  });

  dialog.__gallery = {
    setPayload: ({ title, items }) => {
      state.title = title ?? "";
      state.items = Array.isArray(items) ? items : [];
      state.index = 0;
      if (titleNode) {
        titleNode.textContent = state.title ? `Imagens — ${state.title}` : "Imagens do projeto";
      }
      if (trackNode) {
        trackNode.replaceChildren();
        const fragment = document.createDocumentFragment();
        state.items.forEach(({ src, alt }, index) => {
          const slide = createElement("div", { className: "gallery-dialog__slide" });
          const img = document.createElement("img");
          img.className = "gallery-dialog__image";
          img.loading = "lazy";
          img.decoding = "async";
          img.src = src;
          img.alt = alt || state.title || "Imagem do projeto";
          img.addEventListener(
            "load",
            () => {
              if (index === state.index) requestAnimationFrame(updateNavPosition);
            },
            { once: true },
          );
          slide.appendChild(img);
          fragment.appendChild(slide);
        });
        trackNode.appendChild(fragment);
        trackNode.style.transform = "translate3d(0, 0, 0)";
      }
      update();
    },
    open: () => {
      setScrollLock(true);
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
      // garante foco no modal para setas funcionarem
      if (nextButton instanceof HTMLElement) nextButton.focus();
      requestAnimationFrame(updateNavPosition);
    },
  };

  return dialog;
};

const openGallery = ({ title, items }) => {
  const dialog = ensureGalleryDialog();
  const controller = dialog.__gallery;
  if (!controller) return;
  controller.setPayload({ title, items });
  controller.open();
};

const buildTagList = (tags) => {
  const list = createElement("ul", {
    className: "project-card__tags",
    attributes: { role: "list" },
  });

  tags.forEach((tag) => {
    const item = createElement("li", { className: "project-card__tag", text: tag });
    list.appendChild(item);
  });

  return list;
};

const buildProjectCard = (project) => {
  const card = createElement("article", { className: "project-card is-reveal" });

  const images = getProjectImages(project);
  const thumbnail = getProjectThumbnail(project);

  const header = createElement("header", { className: "project-card__header" });
  header.appendChild(
    createElement("h3", { className: "project-card__title", text: project.title }),
  );
  if (project.year !== null && project.year !== undefined && project.year !== "") {
    header.appendChild(
      createElement("span", { className: "project-card__year", text: String(project.year) }),
    );
  }

  let media = null;
  if (thumbnail) {
    media = createElement("div", { className: "project-card__media" });
    const img = document.createElement("img");
    img.className = "project-card__thumbnail";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = buildThumbnailPath(project.id, thumbnail.ext);
    img.alt = project.title ? `Ilustração do projeto ${project.title}` : "Ilustração do projeto";
    img.width = 640;
    img.height = 360;
    media.appendChild(img);
  }

  const description = createElement("p", {
    className: "project-card__description",
    text: project.description,
  });

  const href = typeof project.href === "string" ? project.href.trim() : "";

  const link = href
    ? createElement("a", {
        className: "project-card__link",
        text: "Abrir projeto",
        attributes: {
          href,
          "aria-label": `Abrir projeto ${project.title}`,
          ...(project.external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        },
      })
    : createElement("span", {
        className: "project-card__link project-card__link--disabled",
        text: "Em breve",
        attributes: { "aria-disabled": "true" },
      });

  const footer = createElement("div", { className: "project-card__footer" });
  footer.appendChild(link);

  if (images) {
    footer.appendChild(
      createElement("button", {
        className: "project-card__gallery-button",
        text: "Ver imagens",
        attributes: {
          type: "button",
          "data-open-gallery": project.id,
          "aria-label": `Ver imagens do projeto ${project.title}`,
        },
      }),
    );
  }

  const blocks = [header];
  if (media) blocks.push(media);
  blocks.push(description, buildTagList(project.tags), footer);
  card.append(...blocks);
  return card;
};

const renderEmptyState = (list) => {
  list.replaceChildren(
    createElement("li", { className: "projects__empty", text: EMPTY_STATE_MESSAGE }),
  );
};

const renderEmptyFilterState = (list) => {
  list.replaceChildren(
    createElement("li", { className: "projects__empty", text: EMPTY_FILTER_MESSAGE }),
  );
};

const hasProjectYear = (p) =>
  p.year !== null && p.year !== undefined && p.year !== "";

const collectFilterYears = (items) => {
  const years = new Set();
  let hasNoYear = false;
  items.forEach((p) => {
    if (hasProjectYear(p)) years.add(Number(p.year));
    else hasNoYear = true;
  });
  const sorted = [...years].sort((a, b) => b - a);
  return { numericYears: sorted, hasNoYear };
};

const collectFilterTags = (items) => {
  const tags = new Set();
  items.forEach((p) => {
    if (Array.isArray(p.tags)) p.tags.forEach((t) => tags.add(t));
  });
  return [...tags].sort((a, b) => a.localeCompare(b, "pt-BR"));
};

const projectMatchesFilters = (project, yearValue, tagValue) => {
  if (yearValue) {
    if (yearValue === YEAR_NONE_VALUE) {
      if (hasProjectYear(project)) return false;
    } else if (Number(project.year) !== Number(yearValue)) {
      return false;
    }
  }
  if (tagValue) {
    if (!Array.isArray(project.tags) || !project.tags.includes(tagValue)) return false;
  }
  return true;
};

const mountProjectsFilters = (root, orderedProjects, onFiltersChange) => {
  root.removeAttribute("hidden");
  root.replaceChildren();

  const form = createElement("form", {
    className: "projects-filters-form",
    attributes: {
      id: "projects-filters-form",
      "aria-label": "Filtrar projetos por ano e tecnologia",
      autocomplete: "off",
    },
  });

  const row = createElement("div", { className: "projects-filters-form__row" });

  const { numericYears, hasNoYear } = collectFilterYears(orderedProjects);
  const tags = collectFilterTags(orderedProjects);

  const yearField = createElement("div", {
    className: "form-field projects-filters-form__field",
  });
  yearField.appendChild(
    createElement("label", {
      className: "form-field__label",
      text: "Ano",
      attributes: { for: "projects-filter-year" },
    }),
  );
  const yearSelect = document.createElement("select");
  yearSelect.className = "form-field__input";
  yearSelect.id = "projects-filter-year";
  yearSelect.appendChild(new Option("Todos os anos", ""));
  if (hasNoYear) {
    yearSelect.appendChild(new Option("Sem data", YEAR_NONE_VALUE));
  }
  numericYears.forEach((y) => {
    yearSelect.appendChild(new Option(String(y), String(y)));
  });
  yearField.appendChild(yearSelect);

  const tagField = createElement("div", {
    className: "form-field projects-filters-form__field",
  });
  tagField.appendChild(
    createElement("label", {
      className: "form-field__label",
      text: "Ferramenta ou tecnologia",
      attributes: { for: "projects-filter-tag" },
    }),
  );
  const tagSelect = document.createElement("select");
  tagSelect.className = "form-field__input";
  tagSelect.id = "projects-filter-tag";
  tagSelect.appendChild(new Option("Todas", ""));
  tags.forEach((tag) => {
    tagSelect.appendChild(new Option(tag, tag));
  });
  tagField.appendChild(tagSelect);

  const clearBtn = createElement("button", {
    className: "button button--ghost projects-filters-form__clear",
    text: "Limpar filtros",
    attributes: { type: "button" },
  });

  row.append(yearField, tagField, clearBtn);
  form.appendChild(row);
  root.appendChild(form);

  const apply = () => {
    onFiltersChange(yearSelect.value, tagSelect.value);
  };

  yearSelect.addEventListener("change", apply);
  tagSelect.addEventListener("change", apply);
  clearBtn.addEventListener("click", () => {
    yearSelect.value = "";
    tagSelect.value = "";
    apply();
  });

  form.addEventListener("submit", (e) => e.preventDefault());
};

const renderProjects = (list, items) => {
  const fragment = document.createDocumentFragment();
  items.forEach((project) => {
    const wrapper = createElement("li");
    wrapper.appendChild(buildProjectCard(project));
    fragment.appendChild(wrapper);
  });
  list.replaceChildren(fragment);
};

const sortProjectsByYear = (items) => {
  const hasYear = (p) =>
    p.year !== null && p.year !== undefined && p.year !== "";

  return [...items].sort((a, b) => {
    const aOk = hasYear(a);
    const bOk = hasYear(b);
    if (aOk && bOk) return Number(b.year) - Number(a.year);
    if (aOk && !bOk) return -1;
    if (!aOk && bOk) return 1;
    return 0;
  });
};

export const initProjects = () => {
  const list = document.querySelector(LIST_SELECTOR);
  const filtersRoot = document.getElementById(FILTERS_ROOT_ID);
  if (!list) return;

  if (!Array.isArray(projects) || projects.length === 0) {
    renderEmptyState(list);
    return;
  }

  const ordered = sortProjectsByYear(projects);
  renderProjects(list, ordered);

  if (filtersRoot) {
    mountProjectsFilters(filtersRoot, ordered, (yearValue, tagValue) => {
      const filtered = ordered.filter((p) =>
        projectMatchesFilters(p, yearValue, tagValue),
      );
      if (filtered.length === 0) {
        renderEmptyFilterState(list);
      } else {
        renderProjects(list, filtered);
      }
    });
  }

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest(GALLERY_TRIGGER_SELECTOR);
    if (!trigger) return;

    const projectId = trigger.getAttribute("data-open-gallery") ?? "";
    const project = Array.isArray(projects) ? projects.find((item) => item.id === projectId) : null;
    if (!project) return;
    const images = getProjectImages(project);
    if (!images) return;

    const items = buildGalleryItems(project, images);
    if (items.length === 0) return;
    openGallery({ title: project.title, items });
  });
};
