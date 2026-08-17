"use strict";

(async () => {
  const root = document.querySelector("[data-search-root]");
  if (!root) {
    const embeddedForm = document.querySelector("[data-search-form]");
    const embeddedData = document.querySelector("[data-search-records]") || document.getElementById("corporate-search-records");
    const embeddedStatus = document.querySelector("[data-search-status]");
    const embeddedOutput = document.querySelector("[data-search-results]");
    if (!embeddedForm || !embeddedData || !embeddedStatus || !embeddedOutput) return;
    let embeddedRecords = [];
    try { embeddedRecords = JSON.parse(embeddedData.textContent); } catch (_error) { embeddedStatus.textContent = "検索データを読み込めませんでした。"; return; }
    const embeddedInput = embeddedForm.querySelector("input[type='search']");
    const normalizeEmbedded = (value) => value.normalize("NFKC").toLocaleLowerCase("ja-JP").replace(/\s+/g, "").trim();
    const exactEmbeddedMatch = embeddedForm.hasAttribute("data-search-exact");
    const embeddedResultClass = embeddedOutput.dataset.resultClass || "corp-result";
    const embeddedEmptyMessage = embeddedForm.dataset.searchEmpty || "一致する公開ページはありません。";
    const renderEmbedded = (query) => {
      const needle = normalizeEmbedded(query);
      embeddedOutput.replaceChildren();
      if (!needle) { embeddedStatus.textContent = "検索語を入力してください。"; return; }
      const matches = embeddedRecords.filter((record) => {
        const candidates = Array.isArray(record.terms) && record.terms.length
          ? record.terms
          : [record.title, record.category, record.safeSnippet, ...(record.keywords || [])];
        return candidates.some((term) => exactEmbeddedMatch
          ? normalizeEmbedded(String(term)) === needle
          : normalizeEmbedded(String(term)).includes(needle));
      }).slice(0, exactEmbeddedMatch ? 1 : 5);
      embeddedStatus.textContent = `「${query}」の検索結果：${matches.length}件`;
      for (const record of matches) {
        const article = document.createElement("article"); article.className = embeddedResultClass;
        const link = document.createElement("a"); link.href = record.url || record.href; link.textContent = record.title;
        const meta = document.createElement("small"); meta.textContent = record.category;
        article.append(link, meta); embeddedOutput.append(article);
      }
      if (!matches.length) { const note = document.createElement("p"); note.textContent = embeddedEmptyMessage; embeddedOutput.append(note); }
    };
    embeddedForm.addEventListener("submit", (event) => { event.preventDefault(); const query = embeddedInput.value.trim(); const url = new URL(window.location.href); query ? url.searchParams.set("q", query) : url.searchParams.delete("q"); history.replaceState(null, "", url); renderEmbedded(query); });
    const initial = new URLSearchParams(window.location.search).get("q") || ""; embeddedInput.value = initial; if (initial) renderEmbedded(initial);
    return;
  }
  const form = root.querySelector("form");
  const input = root.querySelector("input[type='search']");
  const summary = root.querySelector("[data-search-summary]");
  const output = root.querySelector("[data-search-results]");
  const source = root.dataset.searchSource;
  const resultClass = root.dataset.resultClass || "search-result";
  if (!form || !input || !summary || !output || !source) return;

  let records = [];
  try {
    const response = await fetch(new URL(source, window.location.href));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    records = await response.json();
  } catch (_error) {
    summary.textContent = "検索データを読み込めませんでした。ページを再読み込みしてください。";
    return;
  }

  const normalize = (value) => value.normalize("NFKC").toLocaleLowerCase("ja-JP").replace(/\s+/g, "").trim();
  const render = (query) => {
    const needle = normalize(query);
    output.replaceChildren();
    if (!needle) {
      summary.textContent = "検索語を入力してください。";
      return;
    }
    const matches = records.filter((record) => record.terms.some((term) => normalize(term).includes(needle))).slice(0, 5);
    summary.textContent = `「${query}」の検索結果：${matches.length}件`;
    for (const record of matches) {
      const article = document.createElement("article");
      article.className = resultClass;
      const link = document.createElement("a");
      link.href = record.href;
      link.textContent = record.title;
      const meta = document.createElement("small");
      meta.textContent = record.section;
      article.append(link, meta);
      output.append(article);
    }
    if (!matches.length) {
      const note = document.createElement("p");
      note.textContent = "一致する公開ページはありません。表記を確認して、もう一度検索してください。";
      output.append(note);
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    const url = new URL(window.location.href);
    query ? url.searchParams.set("q", query) : url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
    render(query);
  });

  const initial = new URLSearchParams(window.location.search).get("q") || "";
  input.value = initial;
  if (initial) render(initial);
})();
