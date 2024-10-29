document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("trails", (data) => {
    renderTrails(data.trails || {});
  });
});

function renderTrails(trails) {
  const container = document.getElementById("trailContainer");
  container.innerHTML = "";

  for (const [tabId, trail] of Object.entries(trails)) {
    const trailTitle = trail.title || "Untitled Tab";

    const trailElement = document.createElement("div");
    trailElement.classList.add("trail");
    trailElement.innerHTML = `
      <h3>Trail for Tab: ${trailTitle}</h3>
      <ul>${trail.pages.map(page => `<li><a href="${page.url}" target="_blank">${page.title || page.url}</a></li>`).join("")}</ul>
    `;
    container.appendChild(trailElement);
  }
}
