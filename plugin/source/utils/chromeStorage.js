exports.set = function(data) {
  return chrome.storage.local.set;
};
exports.get = function() {
  return chrome.storage.local.get;
};
exports.listen = function() {
  return chrome.storage.onChanged.addListener;
};