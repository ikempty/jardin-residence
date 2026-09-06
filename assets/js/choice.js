"use strict";

(() => {
  const storageKey = "azr_material_action";
  const allowed = new Set(["send", "delete"]);
  const buttons = [...document.querySelectorAll("[data-recipient]")];
  const outcomeByAction = new Map(buttons.map((button) => [button.dataset.recipient,button.dataset.outcome]).filter(([action,outcome]) => allowed.has(action) && outcome));

  const purgeDraft = () => {
    const draft = document.querySelector(".workmail-draft");
    if (draft) {
      draft.setAttribute("aria-hidden","true");
      draft.replaceChildren();
      draft.remove();
    }
    document.documentElement.dataset.draftLocked = "true";
  };

  const redirectLockedDraft = () => {
    const action = window.localStorage.getItem(storageKey);
    const outcome = outcomeByAction.get(action);
    if (!outcome) return false;
    purgeDraft();
    window.location.replace(outcome);
    return true;
  };

  if (redirectLockedDraft()) return;

  window.addEventListener("pageshow",() => {
    redirectLockedDraft();
  });
  window.addEventListener("pagehide",() => {
    if (allowed.has(window.localStorage.getItem(storageKey))) purgeDraft();
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.recipient;
      if (!allowed.has(value)) return;
      const base = button.dataset.outcome;
      if (!base) return;
      window.dispatchEvent(new CustomEvent("azr:analytics", { detail: { name: "outcome_selected", parameters: { choice: value } } }));
      window.localStorage.setItem(storageKey,value);
      window.sessionStorage.setItem("azr_material_action_at",String(Date.now()));
      document.querySelectorAll("[data-recipient]").forEach((item) => { item.disabled = true; });
      const transition = document.createElement("div");
      transition.className = "choice-transition";
      transition.setAttribute("role","status");
      transition.setAttribute("aria-live","polite");
      transition.innerHTML = `<p>${value === "send" ? "送信しています" : "下書きを削除しています"}</p>`;
      document.body.append(transition);
      purgeDraft();
      window.requestAnimationFrame(() => transition.classList.add("is-active"));
      const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 1900;
      window.setTimeout(() => window.location.replace(base),delay);
    });
  });
})();
