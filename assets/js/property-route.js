"use strict";

(() => {
  const route = document.querySelector("[data-property-route]");
  if (!route) return;

  const expected = String(route.dataset.routeSequence || "").split("|").filter(Boolean);
  const target = route.dataset.routeTarget;
  if (!expected.length || !target) return;

  const outcomeStorageKey = "azr_material_action";
  const completedActions = new Set(["send","delete"]);
  let position = 0;
  const isCompleted = () => completedActions.has(window.localStorage.getItem(outcomeStorageKey));
  const lockRoute = () => {
    position = 0;
    route.dataset.routeLocked = "true";
    route.removeAttribute("data-route-sequence");
    route.removeAttribute("data-route-target");
    document.documentElement.classList.remove("property-route-departing");
    document.body.removeAttribute("aria-busy");
  };

  if (isCompleted()) {
    lockRoute();
    return;
  }

  route.querySelectorAll("[data-route-stop]").forEach((button) => {
    button.addEventListener("click", () => {
      if (isCompleted()) {
        lockRoute();
        return;
      }
      const stop = button.dataset.routeStop;
      if (stop === expected[position]) {
        position += 1;
      } else {
        position = stop === expected[0] ? 1 : 0;
      }

      if (position === expected.length) {
        position = 0;
        window.dispatchEvent(new CustomEvent("azr:analytics", { detail: { name: "hidden_route_open" } }));
        document.documentElement.classList.add("property-route-departing");
        document.body.setAttribute("aria-busy", "true");
        window.setTimeout(() => window.location.assign(target), 450);
      }
    });
  });

  window.addEventListener("storage",(event) => {
    if (event.key === outcomeStorageKey && completedActions.has(event.newValue)) lockRoute();
  });
  window.addEventListener("pageshow",() => {
    if (isCompleted()) lockRoute();
  });
})();
