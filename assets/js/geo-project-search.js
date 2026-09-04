"use strict";

(async () => {
  const root = document.querySelector("[data-project-search-root]");
  if (!root) return;

  const form = root.querySelector("form");
  const yearInput = root.querySelector("[data-project-year]");
  const serialInput = root.querySelector("[data-project-serial]");
  const status = root.querySelector("[data-project-search-status]");
  const output = root.querySelector("[data-project-search-results]");
  const source = root.dataset.searchSource;
  if (!form || !yearInput || !serialInput || !status || !output || !source) return;

  const normalizeDigits = (value) => String(value)
    .normalize("NFKC")
    .replace(/[^0-9]/g, "");
  const normalize = (value) => String(value)
    .normalize("NFKC")
    .toLocaleLowerCase("ja-JP")
    .replace(/\s+/g, "")
    .trim();

  const restrictDigits = (input, length) => {
    input.value = normalizeDigits(input.value).slice(0, length);
  };
  yearInput.addEventListener("input", () => {
    restrictDigits(yearInput, 4);
    if (yearInput.value.length === 4) serialInput.focus();
  });
  serialInput.addEventListener("input", () => restrictDigits(serialInput, 3));
  yearInput.addEventListener("paste", (event) => {
    const pasted = event.clipboardData && event.clipboardData.getData("text");
    const match = String(pasted || "").normalize("NFKC").match(/(\d{4})\s*-\s*(\d{3})(?:号)?/);
    if (!match) return;
    event.preventDefault();
    yearInput.value = match[1];
    serialInput.value = match[2];
    serialInput.focus();
  });

  let records = [];
  try {
    const response = await fetch(new URL(source, window.location.href));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    records = await response.json();
  } catch (_error) {
    status.hidden = false;
    status.textContent = "検索データを読み込めませんでした。";
    return;
  }

  const setUrl = (query) => {
    const url = new URL(window.location.href);
    query ? url.searchParams.set("q", query) : url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  };

  const render = (year, serial) => {
    output.replaceChildren();
    if (year.length !== 4 || serial.length !== 3) {
      status.hidden = false;
      status.textContent = "案件番号を確認してください。";
      setUrl("");
      return;
    }

    const query = `${year}-${serial}号`;
    const needle = normalize(query);
    const match = records.find((record) => Array.isArray(record.terms)
      && record.terms.some((term) => normalize(term) === needle));
    setUrl(query);
    status.hidden = false;

    if (!match) {
      status.textContent = "該当する公開案件はありません。";
      return;
    }

    status.textContent = "1件の公開案件が見つかりました。";
    const article = document.createElement("article");
    article.className = "geo-project-result";
    const link = document.createElement("a");
    link.href = match.href;
    const meta = document.createElement("span");
    meta.className = "geo-project-result-meta";
    meta.textContent = `${match.section} / ${query}`;
    const title = document.createElement("strong");
    title.textContent = match.title;
    const arrow = document.createElement("span");
    arrow.className = "geo-project-result-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    link.append(meta, title, arrow);
    article.append(link);
    output.append(article);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    restrictDigits(yearInput, 4);
    restrictDigits(serialInput, 3);
    render(yearInput.value, serialInput.value);
  });

  const initial = new URLSearchParams(window.location.search).get("q") || "";
  const initialMatch = initial.normalize("NFKC").match(/^(\d{4})-(\d{3})(?:号)?$/);
  if (initialMatch) {
    yearInput.value = initialMatch[1];
    serialInput.value = initialMatch[2];
    render(initialMatch[1], initialMatch[2]);
  }
})();
