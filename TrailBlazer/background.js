// Initialize storage and create Trails for all currently open tabs upon extension load
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ trails: {} }, () => {
    initializeTrailsForOpenTabs();
  });
});

// Create a new Trail when a new tab is created
chrome.tabs.onCreated.addListener((tab) => {
  addTrailForTab(tab.id, tab.title, tab.url);
});

// Update the Trail for the tab when it navigates to a new page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.title) {
    // Update the Trail with the new title and URL when either changes
    addPageToTrail(tabId, tab.title, changeInfo.url || tab.url);
  }
});

// Cleanup Trail when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.sync.get("trails", (data) => {
    const trails = data.trails || {};
    delete trails[tabId];
    chrome.storage.sync.set({ trails });
  });
});

// Helper Functions

// Initialize Trails for all open tabs
function initializeTrailsForOpenTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      addTrailForTab(tab.id, tab.title, tab.url);
    });
  });
}

// Add a new Trail for a specific tab
function addTrailForTab(tabId, title, url) {
  chrome.storage.sync.get("trails", (data) => {
    const trails = data.trails || {};
    if (!trails[tabId]) {
      trails[tabId] = { title: title, pages: [{ title: title, url: url }] };
      chrome.storage.sync.set({ trails });
    }
  });
}

// Add a page to an existing Trail and update the Trail's title
function addPageToTrail(tabId, title, url) {
  chrome.storage.sync.get("trails", (data) => {
    const trails = data.trails || {};
    if (trails[tabId]) {
      // Update the Trail's title and add the new page
      trails[tabId].title = title;
      trails[tabId].pages.push({ title: title, url: url });
      chrome.storage.sync.set({ trails });
    }
  });
}
