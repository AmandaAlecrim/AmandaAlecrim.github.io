import { projects } from "../data/projects-data.js";

const LIST_SELECTOR = "#projects-list";
const EMPTY_STATE_MESSAGE = "Nenhum projeto cadastrado ainda.";

const createElement = (tag, { className, text, attributes } = {}) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  if (attributes) {
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  }
  return element;
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

  card.append(header, description, buildTagList(project.tags), link);
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
};
