var $toggleAuto = $("#toggleAuto");
var $ratings = $("input[name='rating']");
var toggle;

chrome.storage.local.get(["autorate", "rating"], function(settings) {
  if (!settings["autorate"]) {
    toggle = false;
  } else {
    toggle = true;
    $toggleAuto.attr('checked', true);
  }

  var currentRating = settings["rating"] ? settings["rating"] : 5;
  var checkedValue = "[value=" + currentRating + "]";

  if ($ratings.is(':checked') === false) {
    $ratings.filter(checkedValue).prop('checked', true);
  }
});

$toggleAuto.click(function() {
  toggle = !toggle;
  chrome.storage.local.set({"autorate": toggle});
})

$ratings.click(function() {
  var rating = $ratings.filter(":checked").val();
  chrome.storage.local.set({"rating": rating});
})