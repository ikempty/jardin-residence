"use strict";

(() => {
  const gate = document.querySelector("[data-vault-gate]");
  if (!gate) return;
  const lines = [...gate.querySelectorAll("[data-vault-line]")];
  const skip = gate.querySelector("[data-vault-skip]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timers = [];
  let finished = false;

  if (window.location.hash === "#reread") {
    gate.hidden = true;
    window.history.replaceState(null,"",`${window.location.pathname}${window.location.search}`);
    return;
  }

  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(window.clearTimeout);
    lines.forEach((line) => line.classList.add("is-visible"));
    gate.hidden = true;
    document.documentElement.classList.remove("vault-access-active");
    const input = document.querySelector("[data-record-command] input");
    if (input && !reduced) input.focus({ preventScroll:true });
  }

  document.documentElement.classList.add("vault-access-active");
  gate.hidden = false;
  if (lines[0]) lines[0].classList.add("is-visible");
  if (skip) skip.addEventListener("click", finish, { once:true });

  if (reduced) {
    lines.forEach((line) => line.classList.add("is-visible"));
    if (skip) skip.hidden = false;
    timers.push(window.setTimeout(finish, 100));
    return;
  }

  timers.push(window.setTimeout(() => { if (skip) skip.hidden = false; }, 500));
  [360, 780, 1200, 1650, 2050].forEach((delay, index) => {
    timers.push(window.setTimeout(() => lines[index + 1] && lines[index + 1].classList.add("is-visible"), delay));
  });
  timers.push(window.setTimeout(finish, 2350));
})();
