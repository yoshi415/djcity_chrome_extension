var autorate, rating, downloadToggle, downloadType;
var $submit = $('#ctl00_PageContent_submit');
var $search = $("input[type=text]");
var $searchBtn = $(".search_btn");
var $insertMessage = $("div.header_border_bottom:first");
var $artist = $("#artist_details li:first div.artist_details");
var $featured = $("#artist_details li:nth-child(3) div.artist_details");
var $featuring = $("#artist_details li:nth-child(3) div.artist_label");
var playing = false;
var focused = false;
var rated = false;
var actionsAllowed = true;
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
var disabledURLs = [
  "http://www.djcity.com/",
  "http://www.djcity.com/digital/record-pool.aspx",
  "http://www.djcity.com/charts/"
]

function rate(rating) {
  $('option[value="' + rating + '"]').attr('selected', 'selected').parent().focus();
  $submit.click();
  rated = true
}

function download(songType) {
  if (rated) {
    var re = new RegExp(songTypes[songType]);
    var $availFormats = $("#ad_sublisting li");
    var typeText = ".float_left";
    var dlButton = ".reviw_tdonw";
    var found = false;

    $availFormats.each(function(index, li) {
      if ($(this).find(typeText).text().match(re)) {
        found = true;
        $(this).find(dlButton).children()[0].click();
        $submit.trigger('click');
      }
    });

    if (!found) {
      var text = songType + " isn't an track option on this song! Try another option";
      var message = createMessage(text, "red");
      if (autorate && downloadToggle) {
        insertMessage(message, false);
      } else {
        insertMessage(message, true);
      }

    }
  } else {
    var message = createMessage("You must rate the song before downloading", "red")
    insertMessage(message, true);
  }
}

function createMessage(text, color) {
  return "<div style='text-align:center' id='removeMe'><br /><p style='color:" + color + ";font-size:15px;' id='message'>" + text + "</p></div>"
}

function insertMessage(text, remove) {
  if ($("#message").length > 0) {
    $("#removeMe").remove();
  }
  if (actionsAllowed) {
    $insertMessage.after(text);
    if (remove) {
      setTimeout(function() {
        $("#removeMe").remove();
      }, 3000);
    }
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

function searchArtist(artist) {
  $search.val(artist);
  $searchBtn.click();
}

  
function createLink(artist) {
  return "<a href='" + artist + "' class='searchArtist'>" + artist + "</a>";
}

function createLinks(artist) {
  var artistNames = artist.text().replace(/\&/g, ",").split(",").filter(function(item) {
    return item !== " ";
  });
  var artistLength = artistNames.length;
  var searchString = "<span>"

  artistNames.forEach(function(artistName, index) {
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

  searchString += "</span>"
  artist.html(searchString);
}

chrome.storage.local.get(["autorate", "rating", "downloadToggle", "downloadType"], function(settings) {
  autorate = settings.autorate ? true : false;

  rating = settings.rating ? settings.rating : 5; 

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
  var url = window.location.href;
  if (~disabledURLs.indexOf(url))  {
    actionsAllowed = false;
  }

  if (autorate) {
    rate(rating);
    if (downloadToggle) {
      download(downloadType);
    }
  }

  createLinks($artist);
  if ($featuring.text() === "Featuring") {
    createLinks($featured);
  }

  $search.focus(function() {
    focused = true;
  });
  $search.blur(function() {
    focused = false;
  });

  $(".searchArtist").click(function(e) {
    e.preventDefault();
    searchArtist($(this).text());
  });

  $submit.on('click', function() {
    var success = createMessage("Song was downloaded successfully!", "green");
    insertMessage(success, false);
  });
  
  $("body").keydown(function(e) {
    if (!focused) {
      var keycode = keycodes[e.keyCode];
      if (keycode) {
        rate(keycode);
      }
      if (e.keyCode === 68) {
        if (actionsAllowed) {
          download(downloadType);
        }
      }
      if (e.keyCode === 80) {
        playPause();
      }
    }
  });
});
