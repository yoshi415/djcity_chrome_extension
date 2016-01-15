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
    "Intro - Dirty": [ 2, /^Intro - Dirty$/ ],
    "Intro - Clean": [ 3, /^Intro - Clean$/ ],
    "Main":          [ 4, /^Main$/ ],
    "Inst":          [ 5, /^Inst$/ ],
    "Acap":          [ 6, /^Acap/ ]
  },

  disabledURLs: [
    "http://www.djcity.com/",
    "http://www.djcity.com/#",
    "http://www.djcity.com/default.aspx",
    "http://www.djcity.com/digital/record-pool.aspx",
    "http://www.djcity.com/charts/"
  ]
};