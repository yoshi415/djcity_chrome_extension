var autorate, rating, downloadToggle, downloadType, songID;
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
var downloadedSongs = {};
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
];

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
        trackDownloaded(songType);
        var success = createMessage("Song was downloaded successfully!", "green");
        insertMessage(success, false);
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

function trackDownloaded(type) {
  songID = window.location.search;
  downloadedSongs[songID].push(type);
  chrome.storage.local.set({"downloadedSongs": downloadedSongs});
}

function hasNotBeenDownloaded(type) {
  songID = window.location.search;
  downloadedSongs[songID] = downloadedSongs[songID] || [];
  if (downloadedSongs[songID].indexOf(type) > -1) {
    var message = createMessage("The " + type + " of this song has already been downloaded by the extension", "green");
    insertMessage(message, false);
    return false;
  } 
  return true;
}

function createOverlay() {
  $("#extensionOverlay").remove();
  var on = "<a href='#' style='color:#70AB8F'>ON</a>";
  var off = "<a href='#' style='color:#E25D33'>OFF</a>";
  var text = "<p id='1btnDL'>1-Button Download: ";
  text += downloadToggle ? (on + " Track Type Selected: " + downloadType) : off;
  text += "</p><p id='autorate'> Autorate: ";
  text += autorate ? on : off;
  text += "</p>"

  var overlay = "<div id='extensionOverlay' style='position:absolute; z-index:2147483647; color:white; font-family: GothamHTFBold;'>Settings<br />" + text + "</div>"
  $("body").prepend(overlay);

  $("#autorate").click(function() {
    chrome.storage.local.set({"autorate": !autorate});
  });

  $("#1btnDL").click(function() {
    chrome.storage.local.set({"downloadToggle": !downloadToggle})
  })
}

chrome.storage.local.get(["autorate", "rating", "downloadToggle", "downloadType", "downloadedSongs"], function(settings) {
  autorate = settings.autorate ? true : false;

  rating = settings.rating ? settings.rating : 5; 

  downloadToggle = settings.downloadToggle ? true : false;

  downloadType = settings.downloadType ? settings.downloadType : "Main";

  downloadedSongs = settings.downloadedSongs ? settings.downloadedSongs : {};
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

  createOverlay();
});

$(function() {
  var url = window.location.href;
  if (~disabledURLs.indexOf(url))  {
    actionsAllowed = false;
  }
  
  // if (actionsAllowed) {
    createOverlay();
  // }

  if (!hasNotBeenDownloaded(downloadType) || $("div h4").text() === "Thank you for your feedback on this track!  Enjoy the download!") {
    rated = true;
  }

  if (autorate) {
    rate(rating);
    if (downloadToggle && actionsAllowed && hasNotBeenDownloaded(downloadType)) {
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
  
  $("body").keydown(function(e) {
    if (!focused) {
      var keyIsNumber = keycodes[e.keyCode];
      if (keyIsNumber) {
        if (actionsAllowed && downloadToggle) {
          rate(keyIsNumber);
        }
      }
      if (e.keyCode === 68) {
        if (actionsAllowed && hasNotBeenDownloaded(downloadType)) {
          download(downloadType);
        }
      }
      if (e.keyCode === 80) {
        playPause();
      }
    }
  });
});
