var Config = require('../config');
var Messages = require('./messages');

function trackDownloaded(type, downloadedSongs) {
  var songID = window.location.search;
  downloadedSongs[songID].push(type);
  chrome.storage.local.set({"downloadedSongs": downloadedSongs});
}

exports.rate = function rate(rating, $submit) {
  var $submit = $('#ctl00_PageContent_submit');
  $('option[value="' + rating + '"]').attr('selected', 'selected').parent().focus();
  $submit.click();
  rated = true;
};

exports.playPause = function playPause(e) {
  if (!playing) {
    document.getElementsByClassName("jp-play")[0].click()
    playing = true;
  } else {
    document.getElementsByClassName("jp-pause")[0].click()
    playing = false;
  }
};

exports.download = function download(rated, songType, downloadedSongs, downloadToggle, actionsAllowed, $insertMessage) {
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
          trackDownloaded(songType, downloadedSongs);
          var success = Messages.create("Song was downloaded successfully!", "green");
          Messages.insert(success, false, actionsAllowed, $insertMessage);
        }
      });

      if (!found) {
        var text = songType + " isn't an track option on this song! Try another option";
        var message = Messages.create(text, "red");
        if (autorate && downloadToggle) {
          Messages.insert(message, false, actionsAllowed, $insertMessage);
        } else {
          Messages.insert(message, true, actionsAllowed, $insertMessage);
        }

      }
    } else {
      var message = Messages.create("You must rate the song before downloading", "red")
      Messages.insert(message, true, actionsAllowed, $insertMessage);
    }
  }
};

exports.hasNotBeenDownloaded = function hasNotBeenDownloaded(type, downloadedSongs, actionsAllowed, $insertMessage) {
  var songID = window.location.search;
  downloadedSongs[songID] = downloadedSongs[songID] || [];
  if (downloadedSongs[songID].indexOf(type) > -1) {
    var message = Messages.create("The " + type + " version of this song has already been downloaded by the extension", "green");
    Messages.insert(message, false, actionsAllowed, $insertMessage);
    return false;
  } 
  return true;
};