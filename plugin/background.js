function checkURL(tabId, info, tab) {
  if (~tab.url.indexOf("djcity.com")) {
    chrome.pageAction.show(tabId);
  }
}

chrome.tabs.onUpdated.addListener(checkURL);