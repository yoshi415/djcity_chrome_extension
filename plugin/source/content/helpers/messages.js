var options = require('../Config').options;

exports.create = function createMessage(text, color) {
  return "<div style='text-align:center' id='removeMe'><br /><p style='color:" + color + ";font-size:15px;' id='message'>" + text + "</p></div>"
};

exports.insert = function insertMessage(text, remove) {
  var $insertMessage = $("div.header_border_bottom:first");
  if ($("#message").length > 0) {
    $("#removeMe").remove();
  }
  if (options.actionsAllowed) {
    $insertMessage.after(text);
    if (remove) {
      setTimeout(function() {
        $("#removeMe").remove();
      }, 3000);
    }
  }
};