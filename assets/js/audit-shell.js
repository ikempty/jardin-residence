"use strict";

(() => {
  const form = document.querySelector("[data-record-command]");
  const historyNode = document.querySelector("[data-terminal-history]");
  const input = form ? form.querySelector("input") : null;
  const consoleNode = document.querySelector(".record-console");
  const prompt = "audit@record:~$";
  const storageKey = "takeuchi_record_history_v2";

  function normalize(value) {
    return String(value || "").normalize("NFKC").trim().replace(/[\s\u3000]+/g," ").toLowerCase();
  }

  function termHash(value) {
    let hash = 0x811c9dc5;
    for (const char of normalize(value)) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash,0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8,"0");
  }

  function appendLine(kind,text) {
    if (!historyNode) return;
    const line = document.createElement("p");
    line.className = kind === "command"
      ? "terminal-entry"
      : `terminal-output ${kind === "success" ? "terminal-output-ok" : "terminal-output-error"}`;
    if (kind === "command") {
      const promptNode = document.createElement("span");
      promptNode.className = "terminal-prompt";
      promptNode.textContent = prompt;
      line.append(promptNode,document.createTextNode(` ${text}`));
    } else {
      line.textContent = text;
    }
    historyNode.append(line);
    if (consoleNode) consoleNode.scrollTop = consoleNode.scrollHeight;
  }

  function commandNotFound(value) {
    return `bash: ${value}: command not found`;
  }

  function loadRecords() {
    try {
      const parsed = JSON.parse(window.sessionStorage.getItem(storageKey) || "[]");
      if (Array.isArray(parsed) && parsed.every((item) => item && typeof item.value === "string" && ["success","error"].includes(item.status))) {
        return parsed.map((item) => normalize(item.value) === "outbox" ? {...item,value:"メールの下書き"} : item);
      }
    } catch {}
    return [];
  }

  function saveRecords(records) {
    window.sessionStorage.setItem(storageKey,JSON.stringify(records.slice(-40)));
  }

  let records = loadRecords();
  if (!records.length) records = [{value:"Read.me",status:"success"}];

  function renderRecords() {
    if (!historyNode) return;
    historyNode.replaceChildren();
    records.forEach((item) => {
      appendLine("command",item.value);
      appendLine(item.status,item.status === "success" ? `record opened: ${item.value}` : commandNotFound(item.value));
    });
  }

  renderRecords();
  requestAnimationFrame(() => { if (consoleNode) consoleNode.scrollTop = consoleNode.scrollHeight; });

  if (!form || !input) return;
  let targets = new Map();
  let effects = new Map();
  try {
    targets = new Map(JSON.parse(form.dataset.recordMap || "[]"));
    effects = new Map(JSON.parse(form.dataset.recordEffectMap || "[]"));
  } catch {
    targets = new Map();
    effects = new Map();
  }

  form.addEventListener("submit",(event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      input.focus({preventScroll:true});
      return;
    }

    appendLine("command",value);
    input.value = "";

    const target = targets.get(termHash(value));
    if (!target) {
      records.push({value,status:"error"});
      saveRecords(records);
      appendLine("error",commandNotFound(value));
      input.setAttribute("aria-invalid","true");
      input.focus({preventScroll:true});
      return;
    }

    const message = `record opened: ${value}`;
    records.push({value,status:"success"});
    saveRecords(records);
    appendLine("success",message);
    input.removeAttribute("aria-invalid");
    const effect = effects.get(termHash(value));
    if (effect) window.sessionStorage.setItem(`record_effect_${effect}`,"pending");
    window.setTimeout(() => window.location.assign(target),160);
  });
})();
