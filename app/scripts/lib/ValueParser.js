/**
 * Compares the original value to the rest of the values and 
 * processes is what is to be a valid format for the rest of the
 * values.
 * @param {[string]} original [the original value]
 * @param {[array]} rest  [the rest of the values]
 */
var ValueParser = function(original, rest) {
  this.initialize = function() {
    this.original = original;
    this.rest = rest;
    this.forumla = null;
    this.origLength = original.length;
  };
  this.initialize();
};

ValueParser.prototype._cleanNumber = function(item) {
  var nonWhiteSpace = item.replace(/\s/g, '');
  var matches = nonWhiteSpace.match(/[0-9 , \.]+/g);
  // if(currency) {
  //   var index = item.indexOf(currency[0]);
  //   if(index > this.original.length) {
  //     currency = null;
  //   }
  // }
  if(matches !== null) {
    return matches[0];
  }
};

ValueParser.prototype._matchLength = function(item) {
  /**
   * if original value is contained in the item,
   *   assume that nothing has changed
   * else
   *   go from the leftmost part of the string
   *   iterate through the thing
   *   make 
   */
  if(item.indexOf(this.original) !== -1) {
    return this.original;
  } else {
    // var cleanOriginal = this.original.replace(/\s/g, '').match(/[0-9 , \.]+/g).split('.')[0];
    // var nonWhiteSpace = item.replace(/\s/g, '');
    // var matches = nonWhiteSpace.match(/[0-9 , \.]+/g);
    // var decimalLess = matches.split('.')[0];
    // if(cleanOriginal.length - matches[0].length > 2) {
    //   return 
    // }

    return item.substr(0, this.origLength);
  }
};

ValueParser.prototype._getCurrency = function() {
  var currency = this.original.match(/\$/g);
  return currency && currency.length ? currency[0] : '';
};

ValueParser.prototype.parseAll = function() {
  return _.flatten([this._cleanNumber(this.original), this.parse()]);
};

/**
 * Parses the rest of the values and returns the formatted values
 * @return {[array]} [the reformatted array]
 */
ValueParser.prototype.parse = function() {
  var res = [];
  var original = this.original;
  var origLength = this.origLength;
  var that = this;
  _.each(this.rest, function(item) {

    // var currency = that._getCurrency();
    var parsed = that._cleanNumber(item);
    if(!parsed){
      throw 'Cannot parse an undefined';
    }
    parsed = that._matchLength(parsed);

    res.push(parsed);
  });
  return res;
};
