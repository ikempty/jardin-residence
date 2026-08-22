"use strict";

(() => {
  const gate = document.querySelector("[data-vault-gate]");
  if (!gate) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stages = [...gate.querySelectorAll("[data-vault-stage]")];
  const status = gate.querySelector("[data-vault-status]");
  const bar = gate.querySelector("[data-vault-progress]");
  const skip = gate.querySelector("[data-vault-skip]");
  const timers = [];
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    timers.forEach(window.clearTimeout);
    stages.forEach((stage) => stage.classList.add("is-complete"));
    if (bar) bar.style.setProperty("--vault-progress", "100%");
    if (status) status.textContent = "REMOTE SHELL READY / READ ONLY";
    gate.classList.add("is-granted");
    window.setTimeout(() => {
      document.documentElement.classList.remove("vault-access-active");
      gate.hidden = true;
    }, reducedMotion ? 80 : 420);
  };

  document.documentElement.classList.add("vault-access-active");
  gate.hidden = false;
  if (skip) skip.addEventListener("click", finish, { once: true });

  const messages = ["CONNECTING FROM LOCAL DEVICE", "ENTERING TOWAN NETWORK", "OPENING TAKEUCHI WORKSPACE", "STARTING LINUX SHELL"];
  const interval = reducedMotion ? 45 : 390;
  stages.forEach((stage, index) => {
    timers.push(window.setTimeout(() => {
      stage.classList.add("is-complete");
      if (status) status.textContent = messages[index];
      if (bar) bar.style.setProperty("--vault-progress", `${Math.round(((index + 1) / stages.length) * 100)}%`);
    }, interval * (index + 1)));
  });
  timers.push(window.setTimeout(finish, interval * (stages.length + 1)));
})();
