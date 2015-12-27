var autorate, rating;
var keycodes = {
  49: 1,
  50: 2,
  51: 3,
  52: 4,
  53: 5
};

function rate(rating) {
    $('option[value="' + rating + '"]').attr('selected', 'selected').parent().focus();
    $('#ctl00_PageContent_submit').click();
    console.log("Rating the song at a ", rating)
}

document.addEventListener('keydown', function(e) {
  var keycode = keycodes[e.keyCode];
  if (keycode) {
    rate(keycode);
  }
}, true);

chrome.storage.local.get(["autorate", "rating"], function(settings) {
  console.log("rating is: ", settings["rating"])
  if (!settings["autorate"]) {
    autorate = false;
  } else {
    autorate = true;
  }

  rating = settings["rating"]; 
});

chrome.storage.onChanged.addListener(function(changes, local) {
  if (changes.autorate) {
    if (changes.autorate.newValue) {
      autorate = true;
      console.log("Enabling autorating for DJCity Easy Rate");
    } else {
      autorate = false;
      console.log("Disabling autorate for DJCity Auto Rate");
    }
  }

  if (changes.rating) {
    rating = changes.rating.newValue;
    console.log("Songs will be rated at a ", rating);
  }
});

$(function() {
  if (autorate) {
    rate(rating);
  }
})
