var config = require('./config');
var options = config.options;
var links = require('./helpers/links');
var overlay = require('./helpers/overlay');
var song = require('./helpers/managesongs');

chrome.storage.local.get(["autorate", "rating", "downloadToggle", "downloadType", "downloadedSongs", "displayOverlay"], function(settings) {
  for (var option in settings) {
    options[option] = settings[option] ? settings[option] : options[option];
  }
  options.downloadValue = config.songTypes[options.downloadType][0];
  options.actionsAllowed = ~config.disabledURLs.indexOf(window.location.href) ? false : true;
});

chrome.storage.onChanged.addListener(function(changes) {
  if (changes.autorate) {
    options.autorate = changes.autorate.newValue ? true : false;
  }

  if (changes.rating) {
    options.rating = changes.rating.newValue;
  }

  if (changes.downloadToggle) {
    options.downloadToggle = changes.downloadToggle.newValue ? true : false;
  }

  if (changes.downloadType) {
    options.downloadType = changes.downloadType.newValue;
    options.downloadValue = config.songTypes[options.downloadType][0];
  }

  if (changes.displayOverlay) {
    options.displayOverlay = changes.displayOverlay.newValue;
  }

  overlay.create(options);
});

$(function() {
  var $artist = $("#artist_details li:first div.artist_details");
  var $featured = $("#artist_details li:nth-child(3) div.artist_details");
  var $featuring = $("#artist_details li:nth-child(3) div.artist_label");
  var $search = $("input[type=text]");
  var url = window.location.href;
  var hasNotBeenDownloaded = song.hasNotBeenDownloaded();
  var alreadyDownloaded = $("div h4").text() === "Thank you for your feedback on this track!  Enjoy the download!";
  var focused = false;
  var rated = false;
  
  if ($(document).width() > 1300) {
    overlay.create(options);
  }

  if (!hasNotBeenDownloaded || alreadyDownloaded) {
    rated = true;
  }

  if (options.autorate) {
    song.rate(options.rating);
    if (options.downloadToggle && options.actionsAllowed && hasNotBeenDownloaded) {
      song.download(rated);
    }
  }

  links.create($artist);
  if ($featuring.text() === "Featuring") {
    links.create($featured);
  }

  $search.focus(function() {
    focused = true;
  });
  $search.blur(function() {
    focused = false;
  });

  $(".searchArtist").click(function(e) {
    e.preventDefault();
    links.searchArtist($(this).text());
  });
  
  $("body").keydown(function(e) {
    if (!focused) {
      var keyIsNumber = config.keyCodes[e.keyCode];
      if (keyIsNumber) {
        if (options.actionsAllowed && options.downloadToggle) {
          song.rate(keyIsNumber);
        }
      }
      if (e.keyCode === 68) {
        if (options.actionsAllowed && hasNotBeenDownloaded) {
          song.download(rated);
        }
      }
      if (e.keyCode === 80) {
        song.playPause();
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

  $(window).resize(overlay.throttledResize);
  $("#dropdownDL").val(options.downloadValue).attr("selected", "selected");  
});
