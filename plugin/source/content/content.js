var Config = require('./config');
var options = require('./config').options;
var Links = require('./helpers/links');
var Overlay = require('./helpers/overlay');
var Song = require('./helpers/manageSongs');

chrome.storage.local.get(["autorate", "rating", "downloadToggle", "downloadType", "downloadedSongs", "displayOverlay"], function(settings) {
  for (var option in settings) {
    options[option] = settings[option] ? settings[option] : options[option];
  }
  options.downloadValue = Config.songTypes[options.downloadType][0];
  options.actionsAllowed = ~Config.disabledURLs.indexOf(window.location.href) ? false : true;
});

chrome.storage.onChanged.addListener(function(changes) {
  if (changes.autorate) {
    if (changes.autorate.newValue) {
      options.autorate = true;
    } else {
      options.autorate = false;
    }
  }

  if (changes.rating) {
    options.rating = changes.rating.newValue;
  }

  if (changes.downloadToggle) {
    if (changes.downloadToggle.newValue) {
      options.downloadToggle = true;
    } else {
      options.downloadToggle = false;
    }
  }

  if (changes.downloadType) {
    options.downloadType = changes.downloadType.newValue;
    options.downloadValue = Config.songTypes[options.downloadType][0];
  }

  if (changes.displayOverlay) {
    options.displayOverlay = changes.displayOverlay.newValue;
  }

  Overlay.create(options);
});

$(function() {
  var $artist = $("#artist_details li:first div.artist_details");
  var $featured = $("#artist_details li:nth-child(3) div.artist_details");
  var $featuring = $("#artist_details li:nth-child(3) div.artist_label");
  var $search = $("input[type=text]");
  var url = window.location.href;
  var hasNotBeenDownloaded = Song.hasNotBeenDownloaded();
  var alreadyDownloaded = $("div h4").text() === "Thank you for your feedback on this track!  Enjoy the download!";
  var focused = false;
  var rated = false;
  
  if ($(document).width() > 1300) {
    Overlay.create(options);
  }

  if (!hasNotBeenDownloaded || alreadyDownloaded) {
    rated = true;
  }

  if (options.autorate) {
    Song.rate(options.rating);
    if (options.downloadToggle && options.actionsAllowed && hasNotBeenDownloaded) {
      Song.download(rated);
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
    Links.searchArtist($(this).text());
  });
  
  $("body").keydown(function(e) {
    if (!focused) {
      var keyIsNumber = Config.keyCodes[e.keyCode];
      if (keyIsNumber) {
        if (options.actionsAllowed && options.downloadToggle) {
          Song.rate(keyIsNumber);
        }
      }
      if (e.keyCode === 68) {
        if (options.actionsAllowed && hasNotBeenDownloaded) {
          Song.download(rated);
        }
      }
      if (e.keyCode === 80) {
        Song.playPause();
      }

      if (e.shiftKey === true) {
        if (e.keyCode === 38) {
          options.downloadValue = options.downloadValue === 0 ? 6 : options.downloadValue - 1;
          $("#dropdownDL").val(options.downloadValue).trigger("change");
        }
        if (e.keyCode === 40) {
          options.downloadValue = options.downloadValue === 6 ? 0 : options.downloadValue + 1;
          $("#dropdownDL").val(options.downloadValue).trigger("change");
        }
      }
    }
  });

  $(window).resize(Overlay.throttledResize);
});
