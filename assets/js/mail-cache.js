"use strict";

(() => {
  const app = document.querySelector("[data-mail-app]");
  if (!app) return;

  const list = app.querySelector("[data-mail-list]");
  const reader = app.querySelector("[data-mail-reader]");
  const items = [...app.querySelectorAll("[data-mail-select]")];
  const messages = [...app.querySelectorAll("[data-mail-message]")];
  const back = app.querySelector("[data-mail-back]");
  const mobile = () => window.matchMedia("(max-width: 820px)").matches;

  function selectMessage(id,{focus = true} = {}) {
    items.forEach((item) => item.classList.toggle("is-selected",item.dataset.mailSelect === id));
    const target = messages.find((message) => message.dataset.mailMessage === id);
    if (!target) return;
    if (mobile()) app.classList.add("is-reader-open");
    window.requestAnimationFrame(() => {
      target.scrollIntoView({block:"start",behavior:"auto"});
      if (focus) target.focus({preventScroll:true});
    });
  }

  items.forEach((item) => item.addEventListener("click",() => selectMessage(item.dataset.mailSelect)));

  back?.addEventListener("click",() => {
    app.classList.remove("is-reader-open");
    items.find((item) => item.classList.contains("is-selected"))?.focus({preventScroll:true});
  });

  const selected = items.find((item) => item.classList.contains("is-selected")) || items.at(-1);
  if (selected) {
    if (mobile()) app.classList.add("is-reader-open");
    else selectMessage(selected.dataset.mailSelect,{focus:false});
  }

  window.addEventListener("resize",() => {
    if (!mobile()) app.classList.remove("is-reader-open");
  });

  reader?.setAttribute("aria-live","polite");
  list?.setAttribute("aria-label","メッセージ一覧");
})();
