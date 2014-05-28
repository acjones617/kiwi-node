/**
 * Compares the original value to the rest of the values and 
 * processes is what is to be a valid format for the rest of the
 * values.
 * @param {[string]} original [the original value]
 * @param {[array]} rest  [the rest of the values]
 */
var NumberParser = function(original, rest) {
  this.initialize = function() {
    this.original = original;
    this.rest = rest;
    this.forumla = null;
    this.origLength = original.length;
  };
  this.initialize();
};

/**
 * Returns whether the original mostly consists of integers
 * We assume that if it does, the thing will be parsed like a number
 * @return {Boolean}
 */
NumberParser.prototype.isNumerical = function() {
  var numberCount = this.original.match(/[a-zA-Z]/g).length;
  var letterCount = this.original.match(/[0-9]/g).length;
  return numberCount > letterCount;
}

NumberParser.prototype._cleanNumber = function(item) {
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

NumberParser.prototype._matchLength = function(item) {
  if(item.indexOf(this.original) !== -1) {
    return this.original;
  } else {
    return item.substr(0, this.origLength);
  }
};

NumberParser.prototype._getCurrency = function() {
  var currency = this.original.match(/\$/g);
  return currency && currency.length ? currency[0] : '';
};

NumberParser.prototype.parseAll = function() {
  return _.flatten([this._cleanNumber(this.original), this.parse()]);
};

/**
 * Parses the rest of the values and returns the formatted values
 * @return {[array]} [the reformatted array]
 */
NumberParser.prototype.parse = function() {
  var res = [];
  var original = this.original;
  var origLength = this.origLength;
  var that = this;
  _.each(this.rest, function(item) {

    // var currency = that._getCurrency();
    var parsed = that._cleanNumber(item);
    if(parsed){
      parsed = that._matchLength(parsed);
      res.push(parsed);
    }

  });
  return res;
};
