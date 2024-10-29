// Initialize storage for Trails
chrome.storage.sync.get({ trails: [] }, (data) => {
  renderTrails(data.trails);
});

// Event listeners for adding Trails and capturing pages
document.getElementById("addTrail").addEventListener("click", addTrail);
document.getElementById("trailContainer").addEventListener("click", (e) => {
  if (e.target.classList.contains("addPage")) {
    capturePage(e.target.dataset.trail);
  }
});

// Render Trails
function renderTrails(trails) {
  const container = document.getElementById("trailContainer");
  container.innerHTML = "";
  trails.forEach((trail, index) => {
    const trailElement = document.createElement("div");
    trailElement.classList.add("trail");
    trailElement.innerHTML = `
      <h3>${trail.name}</h3>
      <button class="addPage" data-trail="${index}">+ Capture Page</button>
      <ul>${trail.pages.map(page => `<li><a href="${page.url}" target="_blank">${page.title}</a></li>`).join("")}</ul>
    `;
    container.appendChild(trailElement);
  });
}

// Add a new Trail
function addTrail() {
  const name = prompt("Enter Trail name:");
  if (name) {
    chrome.storage.sync.get({ trails: [] }, (data) => {
      const newTrails = [...data.trails, { name: name, pages: [] }];
      chrome.storage.sync.set({ trails: newTrails }, () => {
        renderTrails(newTrails);
      });
    });
  }
}

// Capture the current page to a Trail
function capturePage(trailIndex) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    chrome.storage.sync.get({ trails: [] }, (data) => {
      const trails = data.trails;
      trails[trailIndex].pages.push({ title: currentTab.title, url: currentTab.url });
      chrome.storage.sync.set({ trails: trails }, () => {
        renderTrails(trails);
      });
    });
  });
}
