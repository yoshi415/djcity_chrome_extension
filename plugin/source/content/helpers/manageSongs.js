var Config = require('../config');
var options = require('../config').options;
var Messages = require('./messages');

function trackDownloaded(type) {
  var songID = window.location.search;
  options.downloadedSongs[songID].push(type);
  chrome.storage.local.set({"downloadedSongs": options.downloadedSongs});
}

exports.rate = function rate(rating) {
  var $submit = $('#ctl00_PageContent_submit');
  console.log("rating", rating, $submit)
  $('option[value="' + rating + '"]').attr('selected', 'selected').parent().focus();
  $submit.click();
  rated = true;
};

exports.playPause = function playPause() {
  if (!options.playing) {
    document.getElementsByClassName("jp-play")[0].click()
    options.playing = true;
  } else {
    document.getElementsByClassName("jp-pause")[0].click()
    options.playing = false;
  }
};

exports.download = function download(rated) {
  var songType = options.downloadType;
  var downloadBtnExists = $(".reviw_tdonw").length > 0;
  if (downloadBtnExists) {
    if (rated) {
      var re = new RegExp(Config.songTypes[songType][1]);
      var $availFormats = $("#ad_sublisting li");
      var typeText = ".float_left";
      var dlButton = ".reviw_tdonw";
      var found = false;

      $availFormats.each(function(index, li) {
        if ($(this).find(typeText).text().match(re)) {
          found = true;
          $(this).find(dlButton).children()[0].click();
          trackDownloaded(songType);
          var success = Messages.create("Song was downloaded successfully!", "green");
          Messages.insert(success, false);
        }
      });

      if (!found) {
        var text = songType + " isn't an track option on this song! Try another option";
        var message = Messages.create(text, "red");
        if (options.autorate && options.downloadToggle) {
          Messages.insert(message, false);
        } else {
          Messages.insert(message, true);
        }

      }
    } else {
      var message = Messages.create("You must rate the song before downloading", "red")
      Messages.insert(message, true);
    }
  }
};

exports.hasNotBeenDownloaded = function hasNotBeenDownloaded() {
  var songID = window.location.search;
  var downloadedSongs = options.downloadedSongs[songID];
  downloadedSongs = downloadedSongs || [];
  if (downloadedSongs.indexOf(options.downloadType) > -1) {
    var message = Messages.create("The " + options.type + " version of this song has already been downloaded by the extension", "green");
    Messages.insert(message, false);
    return false;
  } 
  return true;
};