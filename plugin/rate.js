var autorate, rating, downloadToggle, downloadType;
var $search = $("input[type=text]");
var playing = false;
var focused = false;
var keycodes = {
  49: 1,
  50: 2,
  51: 3,
  52: 4,
  53: 5
};
var songTypes = {
  "Dirty":         /^Dirty$/,
  "Clean":         /^Clean$/, 
  "Intro - Dirty": /^Intro - Dirty$/,
  "Intro - Clean": /^Intro - Clean$/,
  "Main":          /^Main$/,
  "Inst":          /^Inst$/,
  "Acap":          /^Acap/
}

function rate(rating) {
    $('option[value="' + rating + '"]').attr('selected', 'selected').parent().focus();
    $('#ctl00_PageContent_submit').click();
}

function download(songType) {
  var re = new RegExp(songTypes[songType]);
  var $availFormats = $("#ad_sublisting li");
  var typeText = ".float_left";
  var dl = ".reviw_tdonw";
  var found = false;

  $availFormats.each(function(index, li) {
    if ($(this).find(typeText).text().match(re)) {
      found = true
      $(this).find(dl).children()[0].click()
    }
  })

  if (!found) {
    console.log("Format not found")
  }
}

function playPause(e) {
  if (!playing) {
    document.getElementsByClassName("jp-play")[0].click()
    playing = true;
  } else {
    document.getElementsByClassName("jp-pause")[0].click()
    playing = false;
  }
}

document.addEventListener('keydown', function(e) {
  if (!focused) {
    var keycode = keycodes[e.keyCode];
    if (keycode) {
      rate(keycode);
    }
    if (e.keyCode === 68) {
      download("Acap")
    }
    if (e.keyCode === 80) {
      playPause();
    }
  }
}, true);

chrome.storage.local.get(["autorate", "rating", "downloadToggle", "downloadType"], function(settings) {
  autorate = settings.autorate ? true : false;

  rating = settings.rating; 

  downloadToggle = settings.downloadToggle ? true : false;

  downloadType = settings.downloadType;
});

chrome.storage.onChanged.addListener(function(changes, local) {
  if (changes.autorate) {
    if (changes.autorate.newValue) {
      autorate = true;
    } else {
      autorate = false;
    }
  }

  if (changes.rating) {
    rating = changes.rating.newValue;
  }

  if (changes.downloadToggle) {
    if (changes.downloadToggle.newValue) {
      downloadToggle = true;
    } else {
      downloadToggle = false;
    }
  }

  if (changes.downloadType) {
    downloadType = changes.downloadType.newValue;
  }
});

$(function() {
  if (autorate) {
    rate(rating);
  }

  $search.focus(function() {
    focused = true;
  });
  $search.blur(function() {
    focused = false;
  });
});
