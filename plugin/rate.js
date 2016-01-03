var autorate, rating, downloadToggle, downloadType;
var $submit = $('#ctl00_PageContent_submit');
var $search = $("input[type=text]");
var $searchBtn = $(".search_btn");
var $insertText = $("div.header_border_bottom:first");
var $artist = $("#artist_details li:first div.artist_details");
var $featured = $("#artist_details li:nth-child(3) div.artist_details");
var $featuring = $("#artist_details li:nth-child(3) div.artist_label");
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
  "Acap":          /^Acap/, 
  "Main":          /^Main/
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
      var success = createElement("Song was downloaded successfully!", "green");
      insertText(success, false);
    }
  });

  if (!found) {
    var text = songType + " isn't an option on this song! Try manually downloading";
    var warning = createElement(text, "red")
    insertText(warning, true);
  }
}

function insertText(text, remove) {
  $insertText.after(text);
  if (remove) {
    setTimeout(function() {
      $("#removeMe").remove();
    }, 3000);
  }
}

function createElement(text, color) {
  return "<div style='text-align:center' id='removeMe'><br /><p style='color:" + color + ";font-size:15px;'>" + text + "</p></div>"
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

  rating = settings.rating ? settings.rating : 5; 

  downloadToggle = settings.downloadToggle ? true : false;

  downloadType = settings.downloadType;
});

chrome.storage.onChanged.addListener(function(changes, local) {
  if (changes.autorate) {
    if (changes.autorate.newValue) {
      console.log('autorating enabled')
      autorate = true;
    } else {
      console.log('autorating disabled')
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
    if (downloadToggle) {
      download(downloadType);
    }
  }


  $search.focus(function() {
    focused = true;
  });
  $search.blur(function() {
    focused = false;
  });
  
  function createLink(artist) {
    return "<a href='" + artist + "' class='searchArtist'>" + artist + "</a>";
  }

  function createLinks(artist) {
    var artistNames = artist.text().replace(/\&/g, ",").split(",").filter(function(item) {
      return item !== " ";
    });
    var artistLength = artistNames.length;
    var searchString = "<span>"
    // var addlText = "<br />click to search for more songs from the artist"

    artistNames.forEach(function(artistName, index) {
      var lastIndex = artistLength - 1 === index;
      searchString += createLink(artistName.trim());
      if (!(artistLength - 1 === index)) {
        if (artistLength === 2) {
          searchString += " & ";
        }

        if ((artistLength > 2)) {
          searchString += ", ";
          if (artistLength - 2 === index) {
            searchString += "& ";
          }
        }
      }
    });

    // searchString += addlText;
    // if (artistLength > 1) {
    //   searchString += "s";
    // }
    searchString += "</span>"
    artist.html(searchString);
  }

  createLinks($artist);
  if ($featuring.text() === "Featuring") {
    createLinks($featured);
  }

  $(".searchArtist").click(function(e) {
    e.preventDefault();
    searchArtist($(this).text());
  });
});
