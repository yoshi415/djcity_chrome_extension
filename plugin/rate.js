function rate(rating) {
    $('option[value="' + rating + '"]').attr('selected', 'selected').parent().focus();
    $('#ctl00_PageContent_submit').click();
}

document.addEventListener('keydown', function(e) {
  var keycode = e.keyCode;
  switch(keycode) {
    case 49:
    console.log("rating 1")
      rate(1);
      break;
    case 50: 
      rate(2);
      break;
    case 51: 
      rate(3)
      break;
    case 52: 
      rate(4);
      break;
    case 53: 
      rate(5);
      break;
  }
}, true);