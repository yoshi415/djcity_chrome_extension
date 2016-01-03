var $toggleAuto = $("#toggleAuto");
var $ratings = $("input[name='rating']");
var $radioRate = $("#radioRating");
var $toggleDL = $("#toggleDL");
var $dropdownDL = $("#dropdownDL");
var autorate, downloadToggle, downloadType;

chrome.storage.local.get(["autorate", "rating", "downloadToggle", "downloadType"], function(settings) {
  if (settings.autorate) {
    autorate = true;
    $toggleAuto.attr('checked', true);
    $radioRate.show();
  } else {
    toggle = false;
    $radioRate.hide();
  }

  var currentRating = settings.rating ? settings.rating : 5;
  var checkedValue = "[value=" + currentRating + "]";
  $ratings.filter(checkedValue).prop('checked', true);

  if (settings.downloadToggle) {
    downloadToggle = true;
    $toggleDL.attr('checked', true);
    $dropdownDL.show();
  } else {
    downloadToggle = false;
    $dropdownDL.hide();
  }

  var currentType = settings.downloadType ? settings.downloadType : "Dirty";
  $dropdownDL.val(currentType)
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
  chrome.storage.local.set({"downloadToggle": downloadToggle})
});

$dropdownDL.change(function() {
  downloadType = $("select option:selected").val();
  chrome.storage.local.set({"downloadType": downloadType});
});

$(function() {
  $toggleAuto.change(function() {
    if (this.checked) {
      $radioRate.show();
    } else {
      $radioRate.hide();
    }
  });

  $toggleDL.change(function() {
    if (this.checked) {
      $dropdownDL.show();
    } else {
      $dropdownDL.hide();
    }
  })
});