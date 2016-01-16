var $toggleAuto = $("#toggleAuto");
var $ratings = $("input[name='rating']");
var $radioRate = $("#radioRating");
var $toggleDL = $("#toggleDL");
var $dropdownDL = $("#dropdownDL");
var $toggleOverlay = $("#toggleOverlay")
var autorate, downloadToggle, downloadType, displayOverlay;

chrome.storage.local.get(["autorate", "rating", "downloadToggle", "downloadType", "displayOverlay"], function(settings) {
  if (settings.autorate) {
    autorate = true;
    $toggleAuto.attr('checked', true);
    $radioRate.removeClass("disableOptions");
  } else {
    toggle = false;
    $radioRate.addClass("disableOptions");
  }

  var currentRating = settings.rating ? settings.rating : 5;
  var checkedValue = "[value=" + currentRating + "]";
  $ratings.filter(checkedValue).prop('checked', true);

  if (settings.downloadToggle) {
    downloadToggle = true;
    $toggleDL.attr('checked', true);
    $dropdownDL.removeClass("disableOptions");
  } else {
    downloadToggle = false;
    $dropdownDL.addClass("disableOptions");
  }

  var currentType = settings.downloadType ? settings.downloadType : "Dirty";
  $dropdownDL.val(currentType);
  
  if (settings.displayOverlay) {
    displayOverlay = true;
    $toggleOverlay.attr('checked', true);
  } else {
    displayOverlay = false;
  }
});

$toggleAuto.click(function() {
  autorate = !autorate;
  chrome.storage.local.set({"autorate": autorate});
});

$ratings.click(function() {
  var rating = $ratings.filter(":checked").val();
  chrome.storage.local.set({"rating": rating});
});

$toggleDL.click(function() {
  downloadToggle = !downloadToggle;
  chrome.storage.local.set({"downloadToggle": downloadToggle});
});

$toggleOverlay.click(function() {
  displayOverlay = !displayOverlay;
  chrome.storage.local.set({"displayOverlay": displayOverlay});
});

$dropdownDL.change(function() {
  downloadType = $("select option:selected").text();
  chrome.storage.local.set({"downloadType": downloadType});
});

$toggleAuto.change(function() {
  if (this.checked) {
    $radioRate.removeClass("disableOptions");
  } else {
    $radioRate.addClass("disableOptions");
  }
});

$toggleDL.change(function() {
  if (this.checked) {
    $dropdownDL.removeClass("disableOptions");
  } else {
    $dropdownDL.addClass("disableOptions");
  }
});