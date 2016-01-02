var autorate, rating;
var playing = false;
var keycodes = {
  49: 1,
  50: 2,
  51: 3,
  52: 4,
  53: 5
};
var songTypes = {
  dirty:      /^Dirty$/,
  clean:      /^Clean$/, 
  introdirty: /^Intro - Dirty$/,
  introclean: /^Intro - Clean$/,
  main:       /^Main$/,
  inst:       /^Inst$/,
  acap:       /^Acap - Dirty$/

}
// var $play = $("a.jp-play");
// var $pause = $("a.jp-pause");

function rate(rating) {
    $('option[value="' + rating + '"]').attr('selected', 'selected').parent().focus();
    $('#ctl00_PageContent_submit').click();
    // console.log("Rating the song at a ", rating)
    playPause();
}

function download(songType) {
  var re = new RegExp(songTypes[songType]);
  re.test
  // $("#ad_sublisting").find("li:contains(" + songType + ")").find("div.reviw_tdonw").children()[0].click()
}

function playPause(e) {
  if (!playing) {
    document.getElementsByClassName("jp-play")[0].click()
    playing = true;
    // $play.click(function(e) {
    //   e.preventDefault();
    // });
    // $play.trigger('click')
  } else {
    document.getElementsByClassName("jp-pause")[0].click()
    playing = false;
    // $pause.click(function(e) {
    //   e.preventDefault();
    // })
    // console.log("playin")
  }
}

document.addEventListener('keydown', function(e) {
  var keycode = keycodes[e.keyCode];
  if (keycode) {
    rate(keycode);
  }
  if (e.keyCode === 68) {
    download()
  }
  if (e.keyCode === 80) {
    playPause();
  }
}, true);

chrome.storage.local.get(["autorate", "rating"], function(settings) {
  if (!settings["autorate"]) {
    autorate = false;
  } else {
    autorate = true;
  }

  rating = settings["rating"]; 
});

chrome.storage.onChanged.addListener(function(changes, local) {
  if (changes.autorate) {
    if (changes.autorate.newValue) {
      autorate = true;
      // console.log("Enabling autorating for DJCity Easy Rate");
    } else {
      autorate = false;
      // console.log("Disabling autorate for DJCity Auto Rate");
    }
  }

  if (changes.rating) {
    rating = changes.rating.newValue;
    // console.log("Songs will be rated at a ", rating);
  }
});

$(function() {
  if (autorate) {
    rate(rating);
  }
})
