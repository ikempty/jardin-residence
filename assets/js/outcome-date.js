"use strict";

(() => {
  const stored = Number(window.sessionStorage.getItem("azr_material_action_at"));
  const selectedAt = Number.isFinite(stored) && stored > 0 ? new Date(stored) : new Date();
  selectedAt.setDate(selectedAt.getDate() + 1);
  const date = `${selectedAt.getFullYear()}年${selectedAt.getMonth() + 1}月${selectedAt.getDate()}日`;
  document.querySelectorAll("[data-outcome-date]").forEach((node) => {
    node.textContent = `${date} ${node.dataset.time || ""} 配信`.replace(/\s+/g," ");
    const month = String(selectedAt.getMonth() + 1).padStart(2,"0");
    const day = String(selectedAt.getDate()).padStart(2,"0");
    node.dateTime = `${selectedAt.getFullYear()}-${month}-${day}T${node.dataset.time || "00:00"}:00+09:00`;
  });
})();
