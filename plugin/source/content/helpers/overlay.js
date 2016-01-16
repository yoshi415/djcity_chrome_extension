function onOff(id, onOff) {
  var color = onOff === "ON" ? "#70AB8F" : "#ff030d";
  return "<a href='#' id='" + id + "'' style='color:" + color + "'>" + onOff + "</a>";
}

function createOverlay(displayOverlay, autorate, downloadToggle, downloadValue) {
  $("#extensionOverlay").remove();
  if (displayOverlay) {
    var ratingsDropdown = "<select id='dropdownDL' style='background:transparent; color:white;'><option value='0'>Dirty</option><option value='1'>Clean</option><option value='2'>Inst</option><option value='3'>Acap</option><option value='4'>Main</option><option value='5'>Intro - Dirty</option><option value='6'>Intro - Clean</option></select>";
    var text = "<p>Autorate: ";
    text += autorate ? onOff("autorate", "ON")
                     : onOff("autorate", "OFF");
    text += "</p><p>1-Button Download: ";
    text += downloadToggle ? onOff("1btnDL", "ON") + "<br> Track Type: " + ratingsDropdown
                           : onOff("1btnDL", "OFF");
    text += "</p>";

    var overlay = "<div id='extensionOverlay' style='position:absolute; z-index:2147483647; color:white; font-family: GothamHTFBold; font-size: 12px'><div style='padding:0 0 0 5px;>'>" + text + "</div>"
    $("#container").prepend(overlay);
    $("#dropdownDL").val(downloadValue).attr("selected", "selected");

    $("#autorate").click(function() {
      chrome.storage.local.set({"autorate": !autorate});
    });

    $("#1btnDL").click(function() {
      chrome.storage.local.set({"downloadToggle": !downloadToggle})
    })

    $("#dropdownDL").change(function() {
      downloadType = $("#dropdownDL option:selected").text();
      chrome.storage.local.set({"downloadType": downloadType});
    });
  }
}

function toggleOverlayOnResize() {
  var width = $(document).width();
  if (width < 1300) {
    $("#extensionOverlay").remove();
  } else {
    createOverlay(displayOverlay, autorate, downloadToggle, downloadValue);
  }
}

exports.create = createOverlay;

exports.throttledResize = (function throttledResize() {
  var last, deferTimer, threshhold = 75;
  return function () {
    var now = +(new Date());
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        toggleOverlayOnResize();
      }, threshhold);
    } else {
      last = now;
      toggleOverlayOnResize();
    }
  };
})();