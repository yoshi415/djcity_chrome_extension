var Config = require('./config');
var Links = require('./helpers/links');
var Overlay = require('./helpers/overlay');
var Song = require('./helpers/manageSongs');

var autorate, rating, downloadToggle, downloadType, displayOverlay, downloadValue;
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

function setOptions(option, settings) {
  Config.options[option] = settings[option] ? settings[option] : Config.options[option];
}

chrome.storage.local.get(["autorate", "rating", "downloadToggle", "downloadType", "downloadedSongs", "displayOverlay"], function(settings) {
  for (var option in settings) {
    Config.options[option] = settings[option] ? settings[option] : Config.options[option];
    console.log("Setting", option, "to", Config.options[option])
  }
  Config.options.autorate = settings.autorate ? true : false;
  // setOptions("autorate", settings)

  Config.options.rating = settings.rating ? settings.rating : 5; 

  Config.options.downloadToggle = settings.downloadToggle ? true : false;

  Config.options.downloadType = settings.downloadType ? settings.downloadType : "Dirty";

  Config.options.downloadedSongs = settings.downloadedSongs ? settings.downloadedSongs : {};

  Config.options.displayOverlay = settings.displayOverlay ? true : false;
  // console.log(Config.options.displayOverlay)
  
  // if (Config.songTypes[downloadType]) {
  Config.options.downloadValue = Config.songTypes[downloadType][0];
  // }
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
    downloadValue = Config.songTypes[downloadType][0];
  }

  if (changes.displayOverlay) {
    displayOverlay = changes.displayOverlay.newValue;
  }

  Overlay.create(displayOverlay, autorate, downloadToggle, downloadValue);
});

$(function() {
  var url = window.location.href;
  var hasNotBeenDownloaded = Song.hasNotBeenDownloaded(downloadType, downloadedSongs, actionsAllowed, $insertMessage);

  if (~Config.disabledURLs.indexOf(url))  {
    actionsAllowed = false;
  }
  
  if ($(document).width() > 1300) {
    Overlay.create(displayOverlay, autorate, downloadToggle, downloadValue);
  }

  if (!hasNotBeenDownloaded || $("div h4").text() === "Thank you for your feedback on this track!  Enjoy the download!") {
    rated = true;
  }

  if (Config.options.autorate) {
    Song.rate(Config.options.rating, $submit);
    if (downloadToggle && actionsAllowed && hasNotBeenDownloaded) {
      Song.download(rated, downloadType, downloadedSongs, downloadToggle, actionsAllowed, $insertMessage);
    }
  }

  Links.create($artist);
  if ($featuring.text() === "Featuring") {
    Links.create($featured);
  }

  $search.focus(function() {
    focused = true;
  });
  $search.blur(function() {
    focused = false;
  });

  $(".searchArtist").click(function(e) {
    e.preventDefault();
    searchArtist($(this).text(), $search, $searchBtn);
  });
  
  $("body").keydown(function(e) {
    if (!focused) {
      var keyIsNumber = Config.keyCodes[e.keyCode];
      if (keyIsNumber) {
        if (actionsAllowed && downloadToggle) {
          Song.rate(keyIsNumber, $submit);
        }
      }
      if (e.keyCode === 68) {
        if (actionsAllowed && hasNotBeenDownloaded) {
          Song.download(rated, downloadType, downloadedSongs, downloadToggle, actionsAllowed, $insertMessage);
        }
      }
      if (e.keyCode === 80) {
        Song.playPause();
      }

      if (e.shiftKey === true) {
        if (e.keyCode === 38) {
          downloadValue = downloadValue === 0 ? 6 : downloadValue - 1;
          $("#dropdownDL").val(downloadValue).trigger("change");
        }
        if (e.keyCode === 40) {
          downloadValue = downloadValue === 6 ? 0 : downloadValue + 1;
          $("#dropdownDL").val(downloadValue).trigger("change");
        }
      }
    }
  });

  $(window).resize(Overlay.throttledResize);

  // $("#dropdownDL").val(downloadValue).trigger("change");
});
