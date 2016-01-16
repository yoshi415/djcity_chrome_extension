module.exports = {
  keyCodes: {
  49: 1,
  50: 2,
  51: 3,
  52: 4,
  53: 5
  },

  songTypes: {
    "Dirty":         [ 0, /^Dirty$/ ],
    "Clean":         [ 1, /^Clean$/ ], 
    "Inst":          [ 2, /^Inst$/ ],
    "Acap":          [ 3, /^Acap/ ],
    "Main":          [ 4, /^Main$/ ],
    "Intro - Dirty": [ 5, /^Intro - Dirty$/ ],
    "Intro - Clean": [ 6, /^Intro - Clean$/ ],
  },

  disabledURLs: [
    "http://www.djcity.com/",
    "http://www.djcity.com/#",
    "http://www.djcity.com/default.aspx",
    "http://www.djcity.com/digital/record-pool.aspx",
    "http://www.djcity.com/charts/"
  ], 

  options: {
    // default values, will be overwritten on storage.get
    autorate: false,
    rating: 5,
    downloadToggle: false,
    downloadType: "Dirty",
    downloadedSongs: {},
    displayOverlay: false,
    downloadValue: 0
  }
};