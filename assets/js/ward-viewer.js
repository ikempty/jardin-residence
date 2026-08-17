"use strict";

(() => {
  if (new URLSearchParams(location.search).get("embed") === "1") {
    document.body.classList.add("ward-embedded-document");
  }
  const dialog = document.querySelector("[data-document-dialog]");
  const opener = document.querySelector("[data-document-open]");
  const closer = dialog?.querySelector("[data-document-close]");
  const frame = dialog?.querySelector("[data-document-frame]");
  if (!dialog || !opener || !closer || !frame) return;

  const close = () => {
    dialog.close();
    frame.removeAttribute("src");
    opener.focus();
  };

  opener.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const source = new URL(opener.href);
    source.searchParams.set("embed", "1");
    frame.src = source.href;
    dialog.showModal();
    closer.focus();
  });
  closer.addEventListener("click", close);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
})();
