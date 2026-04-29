import { projects } from "../data/projects-data.js";

const LIST_SELECTOR = "#projects-list";
const EMPTY_STATE_MESSAGE = "Nenhum projeto cadastrado ainda.";
const GALLERY_TRIGGER_SELECTOR = "[data-open-gallery]";

const createElement = (tag, { className, text, attributes } = {}) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  if (attributes) {
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  }
  return element;
};

const getValidThumbnail = (project) => {
  const raw = typeof project.thumbnail === "string" ? project.thumbnail.trim() : "";
  return raw ? raw : null;
};

const getValidGallery = (project) => {
  if (!Array.isArray(project.gallery)) return [];
  return project.gallery
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const src = typeof item.src === "string" ? item.src.trim() : "";
      const alt = typeof item.alt === "string" ? item.alt.trim() : "";
      if (!src) return null;
      return { src, alt };
    })
    .filter(Boolean);
};

const ensureGalleryDialog = () => {
  const existing = document.getElementById("project-gallery");
  if (existing) return existing;

  const dialog = document.createElement("dialog");
  dialog.id = "project-gallery";
  dialog.className = "gallery-dialog";
  dialog.innerHTML = `
    <div class="gallery-dialog__backdrop" data-close-gallery></div>
    <div class="gallery-dialog__panel" role="document" aria-label="Galeria do projeto">
      <div class="gallery-dialog__header">
        <h3 class="gallery-dialog__title" data-gallery-title>Imagens do projeto</h3>
        <button class="gallery-dialog__close" type="button" data-close-gallery aria-label="Fechar galeria">
          ✕
        </button>
      </div>
      <div class="gallery-dialog__body" data-gallery-body></div>
    </div>
  `;

  document.body.appendChild(dialog);

  const close = () => {
    if (dialog.open) dialog.close();
  };

  dialog.addEventListener("click", (event) => {
    const target = event.target;
    if (target?.matches?.("[data-close-gallery]")) close();
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });

  return dialog;
};

const openGallery = ({ title, items }) => {
  const dialog = ensureGalleryDialog();
  const titleNode = dialog.querySelector("[data-gallery-title]");
  const bodyNode = dialog.querySelector("[data-gallery-body]");
  if (!titleNode || !bodyNode) return;

  titleNode.textContent = title ? `Imagens — ${title}` : "Imagens do projeto";
  bodyNode.replaceChildren();

  const fragment = document.createDocumentFragment();
  items.forEach(({ src, alt }) => {
    const figure = createElement("figure", { className: "gallery-dialog__figure" });
    const img = document.createElement("img");
    img.className = "gallery-dialog__image";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = src;
    img.alt = alt || title || "Imagem do projeto";
    figure.appendChild(img);
    fragment.appendChild(figure);
  });
  bodyNode.appendChild(fragment);

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
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

  const thumbnail = getValidThumbnail(project);
  if (thumbnail) {
    const media = createElement("div", { className: "project-card__media" });
    const img = document.createElement("img");
    img.className = "project-card__thumbnail";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = thumbnail;
    img.alt = project.title ? `Ilustração do projeto ${project.title}` : "Ilustração do projeto";
    img.width = 640;
    img.height = 360;
    media.appendChild(img);
    card.appendChild(media);
  }

  const header = createElement("header", { className: "project-card__header" });
  header.appendChild(
    createElement("h3", { className: "project-card__title", text: project.title }),
  );
  if (project.year !== null && project.year !== undefined && project.year !== "") {
    header.appendChild(
      createElement("span", { className: "project-card__year", text: String(project.year) }),
    );
  }

  const description = createElement("p", {
    className: "project-card__description",
    text: project.description,
  });

  const href = typeof project.href === "string" ? project.href.trim() : "";
  const gallery = getValidGallery(project);

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

  if (gallery.length > 0) {
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

  card.append(header, description, buildTagList(project.tags), footer);
  return card;
};

const renderEmptyState = (list) => {
  list.replaceChildren(
    createElement("li", { className: "projects__empty", text: EMPTY_STATE_MESSAGE }),
  );
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

export const initProjects = () => {
  const list = document.querySelector(LIST_SELECTOR);
  if (!list) return;

  if (!Array.isArray(projects) || projects.length === 0) {
    renderEmptyState(list);
    return;
  }

  renderProjects(list, projects);

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest(GALLERY_TRIGGER_SELECTOR);
    if (!trigger) return;

    const projectId = trigger.getAttribute("data-open-gallery") ?? "";
    const project = Array.isArray(projects) ? projects.find((item) => item.id === projectId) : null;
    if (!project) return;

    const items = getValidGallery(project);
    if (items.length === 0) return;
    openGallery({ title: project.title, items });
  });
};
