var autorate, rating, downloadToggle, downloadType;
var $submit = $('#ctl00_PageContent_submit');
var $search = $("input[type=text]");
var $searchBtn = $(".search_btn");
var $warning = $("div.header_border_bottom:first");
var artist = $("#artist_details li:first div.artist_details");
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
};

function rate(rating) {
    $('option[value="' + rating + '"]').attr('selected', 'selected').parent().focus();
    $submit.click();
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
    // if ($("#removeMe").length === 0) {
      var warning = "<div style='text-align:center' id='removeMe'><br /><p style='color:red;font-size:15px;'>" + songType + " isn't an option on this song! Try manually downloading</p></div>"
      $warning.after(warning);
    // } else {
    //   $("#removeMe").show();
    // }
    setTimeout(function() {
      $("#removeMe").remove();
    }, 3000);
  }
}

// function remove() {
//   $removeMe.hide();
//   console.log("running")
// }

function playPause(e) {
  if (!playing) {
    document.getElementsByClassName("jp-play")[0].click()
    playing = true;
  } else {
    document.getElementsByClassName("jp-pause")[0].click()
    playing = false;
  }
}

function searchArtist(artist) {
  $search.val(artist);
  $searchBtn.click();
}

document.addEventListener('keydown', function(e) {
  if (!focused) {
    var keycode = keycodes[e.keyCode];
    if (keycode) {
      rate(keycode);
    }
    if (e.keyCode === 68) {
      download(downloadType);
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
  
  var artistName = artist.text();
  artist.html("<span>" + artistName + " - </span><a href=" + artistName + " id='searchArtist'>search for more songs by artist</a>"  )

  $("#searchArtist").click(function(e) {
    e.preventDefault();
    searchArtist(artistName);
  });
});
