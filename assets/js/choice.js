"use strict";

(() => {
  const storageKey = "azr_material_action";
  const allowed = new Set(["send", "delete"]);
  document.querySelectorAll("[data-recipient]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.recipient;
      if (!allowed.has(value)) return;
      const base = button.dataset.outcome;
      if (!base) return;
      window.localStorage.setItem(storageKey,value);
      window.sessionStorage.setItem("azr_material_action_at",String(Date.now()));
      document.querySelectorAll("[data-recipient]").forEach((item) => { item.disabled = true; });
      const transition = document.createElement("div");
      transition.className = "choice-transition";
      transition.setAttribute("role","status");
      transition.setAttribute("aria-live","polite");
      transition.innerHTML = `<p>${value === "send" ? "送信しています" : "下書きを削除しています"}</p>`;
      document.body.append(transition);
      window.requestAnimationFrame(() => transition.classList.add("is-active"));
      const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 1900;
      window.setTimeout(() => window.location.assign(base),delay);
    });
  });
})();
