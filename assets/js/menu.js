"use strict";

document.querySelectorAll("[data-menu-button]").forEach((button) => {
  const target = document.getElementById(button.getAttribute("aria-controls"));
  if (!target) return;
  button.addEventListener("click", () => {
    const open = target.dataset.open !== "true";
    target.dataset.open = String(open);
    button.setAttribute("aria-expanded", String(open));
  });
  target.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      target.dataset.open = "false";
      button.setAttribute("aria-expanded", "false");
    }
  });
});
