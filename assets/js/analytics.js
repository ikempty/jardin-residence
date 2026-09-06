"use strict";

(() => {
  const measurementId = "G-S25123J7DM";
  const productionHosts = new Set(["jardin-redi.com", "www.jardin-redi.com"]);
  if (window.location.protocol !== "https:" || !productionHosts.has(window.location.hostname)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const loader = document.createElement("script");
  loader.async = true;
  loader.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  loader.dataset.siteAnalytics = "ga4";
  document.head.append(loader);

  const allowedEvents = new Set([
    "hidden_route_open",
    "record_search",
    "outcome_selected",
    "ending_reveal",
    "clear_share_click",
  ]);
  const allowedParameters = new Set(["result", "choice"]);

  const track = (name, parameters = {}) => {
    if (!allowedEvents.has(name)) return;
    const safeParameters = {};
    for (const [key, value] of Object.entries(parameters)) {
      if (!allowedParameters.has(key) || typeof value !== "string") continue;
      safeParameters[key] = value.slice(0, 24);
    }
    window.gtag("event", name, safeParameters);
  };

  window.addEventListener("azr:analytics", (event) => {
    const detail = event instanceof CustomEvent && event.detail ? event.detail : {};
    track(detail.name, detail.parameters);
  });

  const endingMatch = window.location.pathname.match(/\/outcomes\/(send|delete)\/yamatai\/?$/);
  if (endingMatch) track("ending_reveal", { choice: endingMatch[1] });

  document.addEventListener("click", (event) => {
    const share = event.target instanceof Element ? event.target.closest(".outcome-teaser-share") : null;
    if (!share) return;
    track("clear_share_click", { choice: endingMatch?.[1] || "unknown" });
  }, { capture: true });
})();
