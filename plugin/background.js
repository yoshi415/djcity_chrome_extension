function checkURL(tabId, info, tab) {
  if (~tab.url.indexOf("djcity.co")) {
    chrome.pageAction.show(tabId);
  }
}

chrome.tabs.onUpdated.addListener(checkURL);