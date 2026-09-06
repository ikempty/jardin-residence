"use strict";

(() => {
  const target = document.querySelector("[data-teaser-text]");
  if (!target) return;
  const share = document.querySelector(".outcome-teaser-share");

  const message = target.dataset.message || "";
  const characters = Array.from(message);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;

  if (share) {
    const propertyUrl = new URL(share.dataset.propertyUrl || "../../../",window.location.href);
    const postText = `#ジャルダン代々木下原 #新築マンション\n${propertyUrl.href}`;
    const intentUrl = new URL("https://x.com/intent/tweet");
    intentUrl.searchParams.set("text",postText);
    share.href = intentUrl.href;
  }

  const filterHost = document.createElementNS("http://www.w3.org/2000/svg","svg");
  filterHost.classList.add("outcome-teaser-filters");
  filterHost.setAttribute("aria-hidden","true");
  const roughFilter = document.createElementNS("http://www.w3.org/2000/svg","filter");
  for (const [name,value] of Object.entries({id:"outcome-rough-ink",x:"-8%",y:"-35%",width:"116%",height:"170%","color-interpolation-filters":"sRGB"})) roughFilter.setAttribute(name,value);
  const turbulence = document.createElementNS("http://www.w3.org/2000/svg","feTurbulence");
  for (const [name,value] of Object.entries({type:"fractalNoise",baseFrequency:"0.018 0.72",numOctaves:"1",seed:"29",result:"paperNoise"})) turbulence.setAttribute(name,value);
  const displacement = document.createElementNS("http://www.w3.org/2000/svg","feDisplacementMap");
  for (const [name,value] of Object.entries({in:"SourceGraphic",in2:"paperNoise",scale:"1.15",xChannelSelector:"R",yChannelSelector:"G"})) displacement.setAttribute(name,value);
  roughFilter.append(turbulence,displacement);
  filterHost.append(roughFilter);
  target.before(filterHost);

  const fragment = document.createDocumentFragment();
  const characterNodes = characters.map((character,characterIndex) => {
    const span = document.createElement("span");
    const isSpace = character === "　" || character === " ";
    span.className = `outcome-teaser-char${isSpace ? " is-space" : ""}`;
    span.dataset.char = character;
    span.setAttribute("aria-hidden","true");
    span.style.setProperty("--tremor-delay",`${((characterIndex % 7) * -0.137).toFixed(3)}s`);
    span.style.setProperty("--slice-delay",`${((characterIndex % 9) * -0.211).toFixed(3)}s`);
    const inkTones = ["252,251,248","198,202,206","255,255,254","226,220,218","178,184,190"];
    span.style.setProperty("--ink-rgb",inkTones[(characterIndex * 3) % inkTones.length]);
    span.style.setProperty("--ink-alpha",`${(0.55 + ((characterIndex * 11) % 43) / 100).toFixed(2)}`);
    span.style.setProperty("--tilt",`${(((characterIndex * 5) % 9) - 4) * 0.16}deg`);
    span.style.setProperty("--baseline",`${(((characterIndex * 3) % 7) - 3) * 0.34}px`);
    span.style.setProperty("--glyph-shift",`${(((characterIndex * 5) % 7) - 3) * 0.15}px`);
    span.style.setProperty("--glyph-scale-x",`${(0.975 + ((characterIndex * 5) % 7) / 100).toFixed(3)}`);
    span.style.setProperty("--glyph-scale-y",`${(0.945 + ((characterIndex * 7) % 11) / 100).toFixed(3)}`);
    span.style.setProperty("--glyph-skew",`${(((characterIndex * 11) % 7) - 3) * 0.12}deg`);
    span.style.setProperty("--edge-blur",characterIndex % 5 === 0 ? ".42px" : characterIndex % 7 === 0 ? ".2px" : "0");
    span.style.setProperty("--scar-y",`${18 + ((characterIndex * 13) % 58)}%`);
    span.style.setProperty("--scar-alpha",`${(0.04 + ((characterIndex * 5) % 24) / 100).toFixed(2)}`);
    span.style.setProperty("--channel-alpha",`${(0.42 + ((characterIndex * 7) % 27) / 100).toFixed(2)}`);
    span.style.setProperty("--red-x",`${-1.05 - (characterIndex % 4) * 0.19}px`);
    span.style.setProperty("--blue-x",`${1.08 + (characterIndex % 5) * 0.16}px`);
    span.style.setProperty("--red-slice",`${-1.5 - (characterIndex % 3) * 0.45}px`);
    span.style.setProperty("--blue-slice",`${1.5 + (characterIndex % 4) * 0.4}px`);
    span.textContent = character;
    fragment.append(span);
    return span;
  });
  target.append(fragment);

  const appendCharacter = () => {
    if (index >= characters.length) return;

    const character = characters[index];
    characterNodes[index].classList.add("is-visible");
    index += 1;

    if (index < characters.length) {
      const pause = character === "　" || character === " " ? 520 : 205 + ((index * 37) % 75);
      window.setTimeout(appendCharacter,reducedMotion ? 18 : pause);
    } else if (share) {
      window.setTimeout(() => share.classList.add("is-visible"),reducedMotion ? 0 : 700);
    }
  };

  window.setTimeout(appendCharacter,reducedMotion ? 0 : 850);
})();
