exports.create = function createMessage(text, color) {
  return "<div style='text-align:center' id='removeMe'><br /><p style='color:" + color + ";font-size:15px;' id='message'>" + text + "</p></div>"
};

exports.insert = function insertMessage(text, remove, actionsAllowed, $insertMessage) {
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
};