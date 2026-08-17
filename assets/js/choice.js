"use strict";

(() => {
  const allowed = new Set(["newspaper", "liaison"]);
  const storageKey = "azr_material_recipient";
  document.querySelectorAll("[data-recipient]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.recipient;
      if (!allowed.has(value)) return;
      window.localStorage.setItem(storageKey, value);
      const base = button.dataset.outcome;
      if (base) window.location.assign(base);
    });
  });
})();
