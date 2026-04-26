const RECIPIENT_EMAIL = "amanda2668@hotmail.com";

const FORM_SELECTOR = ".contact-form";
const STATUS_SELECTOR = ".contact-form__status";
const ERROR_SELECTOR = "[data-error-for]";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;
const MIN_MESSAGE_LENGTH = 10;

const ErrorMessages = Object.freeze({
  required: "Campo obrigatório.",
  nameTooShort: `Informe ao menos ${MIN_NAME_LENGTH} caracteres.`,
  invalidEmail: "Informe um e-mail válido.",
  messageTooShort: `Mensagem precisa ter ao menos ${MIN_MESSAGE_LENGTH} caracteres.`,
});

const validateName = (value) => {
  if (!value) return ErrorMessages.required;
  if (value.length < MIN_NAME_LENGTH) return ErrorMessages.nameTooShort;
  return null;
};

const validateEmail = (value) => {
  if (!value) return ErrorMessages.required;
  if (!EMAIL_PATTERN.test(value)) return ErrorMessages.invalidEmail;
  return null;
};

const validateMessage = (value) => {
  if (!value) return ErrorMessages.required;
  if (value.length < MIN_MESSAGE_LENGTH) return ErrorMessages.messageTooShort;
  return null;
};

const validators = {
  name: validateName,
  email: validateEmail,
  message: validateMessage,
};

const getFormPayload = (form) => {
  const formData = new FormData(form);
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };
};

const collectErrors = (payload) => {
  const errors = {};
  Object.entries(validators).forEach(([field, validate]) => {
    const message = validate(payload[field]);
    if (message) errors[field] = message;
  });
  return errors;
};

const renderErrors = (form, errors) => {
  form.querySelectorAll(ERROR_SELECTOR).forEach((node) => {
    const field = node.getAttribute("data-error-for");
    node.textContent = field && errors[field] ? errors[field] : "";
  });
};

const setStatus = (statusNode, message, kind = "") => {
  if (!statusNode) return;
  statusNode.textContent = message;
  if (kind) {
    statusNode.dataset.status = kind;
  } else {
    delete statusNode.dataset.status;
  }
};

const buildMailtoUrl = ({ name, email, message }) => {
  const subject = `Contato pelo portfólio — ${name}`;
  const body = `Olá!\n\nMeu nome é ${name} (${email}).\n\n${message}`;

  const params = new URLSearchParams({ subject, body });
  return `mailto:${RECIPIENT_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
};

const handleSubmit = (form, statusNode, event) => {
  event.preventDefault();

  const payload = getFormPayload(form);
  const errors = collectErrors(payload);
  renderErrors(form, errors);

  if (Object.keys(errors).length > 0) {
    setStatus(statusNode, "Revise os campos destacados.", "error");
    return;
  }

  setStatus(statusNode, "Abrindo seu cliente de e-mail…", "success");
  window.location.href = buildMailtoUrl(payload);
};

export const initContactForm = () => {
  const form = document.querySelector(FORM_SELECTOR);
  if (!form) return;

  const statusNode = form.querySelector(STATUS_SELECTOR);
  form.addEventListener("submit", (event) => handleSubmit(form, statusNode, event));
};
