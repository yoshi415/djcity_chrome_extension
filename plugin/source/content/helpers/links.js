function createLink(artist) {
  return "<a href='" + artist + "' class='searchArtist'>" + artist + "</a>";
}

exports.searchArtist = function searchArtist($search, $searchBtn, artist) {
  $search.val(artist);
  $searchBtn.click();
}

exports.create = function createLinks(artist) {
  var artistNames = artist.text().replace(/\&/g, ",").split(",").filter(function(item) {
    return item !== " ";
  });
  var artistLength = artistNames.length;
  var searchString = "<span>"

  artistNames.forEach(function(artistName, index) {
    searchString += createLink(artistName.trim());
    if (!(artistLength - 1 === index)) {
      if (artistLength === 2) {
        searchString += " & ";
      }

      if ((artistLength > 2)) {
        searchString += ", ";
        if (artistLength - 2 === index) {
          searchString += "& ";
        }
      }
    }
  });

  searchString += "</span>";
  artist.html(searchString);
}