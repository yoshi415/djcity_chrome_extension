var songTypes = require('../config').songTypes;
var options = require('../config').options;
var messages = require('./messages');

function trackDownloaded(type) {
  var songID = window.location.search;
  options.downloadedSongs[songID].push(type);
  chrome.storage.local.set({"downloadedSongs": options.downloadedSongs});
}

exports.rate = function rate(rating) {
  var $submit = $('#ctl00_PageContent_submit');
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
      var re = new RegExp(songTypes[songType][1]);
      var $availFormats = $("#ad_sublisting li");
      var typeText = ".float_left";
      var dlButton = ".reviw_tdonw";
      var found = false;

      $availFormats.each(function(index, li) {
        if ($(this).find(typeText).text().match(re)) {
          found = true;
          $(this).find(dlButton).children()[0].click();
          trackDownloaded(songType);
          var success = messages.create("Song was downloaded successfully!", "green");
          messages.insert(success, false);
        }
      });

      if (!found) {
        var text = songType + " isn't an track option on this song! Try another option";
        var message = messages.create(text, "red");
        if (options.autorate && options.downloadToggle) {
          messages.insert(message, false);
        } else {
          messages.insert(message, true);
        }

      }
    } else {
      var message = messages.create("You must rate the song before downloading", "red")
      messages.insert(message, true);
    }
  }
};

exports.hasNotBeenDownloaded = function hasNotBeenDownloaded() {
  var songID = window.location.search;
  options.downloadedSongs[songID] = options.downloadedSongs[songID] || [];
  if (options.downloadedSongs[songID].indexOf(options.downloadType) > -1) {
    var message = messages.create("The " + options.downloadType + " version of this song has already been downloaded by the extension", "green");
    messages.insert(message, false);
    return false;
  } 
  return true;
};