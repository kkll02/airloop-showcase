"use strict";
const tabs = [...document.querySelectorAll('[role="tab"]')];
const examples = {
  sense: ["Sensing the room", "Four readings help AirLoop decide what the room needs."],
  learn: ["Learning your rhythm", "A recurring evening rise in CO₂ helps AirLoop prepare for study time."],
  act: ["Taking the next useful step", "Humidity is still high after your shower. Ventilation is running."]
};
function selectStep(tab, focus = false) {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden = !active;
  });
  const [title, message] = examples[tab.dataset.step];
  document.getElementById("display-title").textContent = title;
  document.getElementById("display-message").textContent = message;
  document.getElementById("co2-reading").textContent = tab.dataset.step === "learn" ? "1060" : tab.dataset.step === "act" ? "720" : "820";
  document.getElementById("humidity-reading").textContent = tab.dataset.step === "act" ? "74" : "48";
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectStep(tab));
  tab.addEventListener("keydown", event => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {event.preventDefault(); selectStep(tabs[next], true);}
  });
});
document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const text = document.getElementById(button.dataset.copy).textContent;
    const status = document.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
      status.textContent = "Prompt copied. Ready for your image generator.";
      setTimeout(() => {button.textContent = "Copy prompt";}, 2500);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById(button.dataset.copy));
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = "Prompt selected. Use your device’s Copy command to copy it.";
    }
  });
});
