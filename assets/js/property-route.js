"use strict";

(() => {
  const route = document.querySelector("[data-property-route]");
  if (!route) return;

  const expected = String(route.dataset.routeSequence || "").split("|").filter(Boolean);
  const target = route.dataset.routeTarget;
  if (!expected.length || !target) return;

  let position = 0;
  route.querySelectorAll("[data-route-stop]").forEach((button) => {
    button.addEventListener("click", () => {
      const stop = button.dataset.routeStop;
      if (stop === expected[position]) {
        position += 1;
      } else {
        position = stop === expected[0] ? 1 : 0;
      }

      if (position === expected.length) {
        position = 0;
        window.location.assign(target);
      }
    });
  });
})();
