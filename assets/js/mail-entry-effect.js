"use strict";

(() => {
  const overlay = document.querySelector("[data-mail-entry-effect]");
  if (!overlay) return;

  const storageKey = "record_effect_mail-cache";
  const shouldPlay = window.sessionStorage.getItem(storageKey) === "pending";
  window.sessionStorage.removeItem(storageKey);
  if (!shouldPlay) {
    overlay.remove();
    return;
  }

  const stream = overlay.querySelector("[data-mail-entry-stream]");
  const state = overlay.querySelector("[data-mail-entry-state]");
  const progress = overlay.querySelector("[data-mail-entry-progress]");
  const clock = overlay.querySelector("[data-mail-entry-clock]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const started = performance.now();
  const fixedLines = [
    "route://local-cache/mail/2023/04/18",
    "mount /cache/mailbox_02 --read-only",
    "index header blocks ............ found",
    "recover message map ............ 04 entries",
    "resolve thread:R-17b ........... matched",
    "attach shadow reader ........... accepted",
    "session mode ................... READ ONLY",
  ];
  const fragments = ["msg","idx","hdr","att","map","blk","ref","thd"];

  function hex(length) {
    let value = "";
    for (let index = 0; index < length; index += 1) value += Math.floor(Math.random() * 16).toString(16);
    return value;
  }

  function generatedLine(index) {
    const fragment = fragments[index % fragments.length];
    const address = `0x${hex(8)}`;
    const checksum = hex(12);
    const block = String(17 + ((index * 29) % 83)).padStart(3,"0");
    return `${address}  ${fragment}_${block}  ${checksum}  ${index % 4 === 0 ? "recover" : "scan"}`;
  }

  function append(text,className = "") {
    if (!stream) return;
    const line = document.createElement("p");
    if (className) line.className = className;
    line.textContent = text;
    stream.append(line);
    while (stream.childElementCount > 34) stream.firstElementChild?.remove();
    stream.scrollTop = stream.scrollHeight;
  }

  function finish() {
    if (state) state.textContent = "MESSAGE STORE OPEN // READ ONLY";
    if (progress) progress.style.width = "100%";
    overlay.classList.add("is-resolved");
    window.setTimeout(() => overlay.remove(),reducedMotion ? 20 : 520);
  }

  if (reducedMotion) {
    fixedLines.forEach((line) => append(line,"is-system"));
    finish();
    return;
  }

  let index = 0;
  const total = 72;
  const timer = window.setInterval(() => {
    const elapsed = performance.now() - started;
    if (clock) clock.textContent = new Date(elapsed).toISOString().slice(11,23);
    append(generatedLine(index));
    if (index % 6 === 0 && fixedLines[index / 6]) append(`> ${fixedLines[index / 6]}`,"is-system");
    index += 1;
    if (progress) progress.style.width = `${Math.min(94,Math.round((index / total) * 100))}%`;
    if (state) {
      if (index > 22) state.textContent = "RECOVERING MESSAGE INDEX";
      if (index > 50) state.textContent = "ATTACHING READ-ONLY READER";
    }
    if (index >= total) {
      window.clearInterval(timer);
      append("> thread:R-17b mounted","is-final");
      window.setTimeout(finish,260);
    }
  },70);
})();
