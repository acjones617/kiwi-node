if(!Utils) {
  var Utils = {};
}

/**
 * Compares the original value to the rest of the values and 
 * processes is what is to be a valid format for the rest of the
 * values.
 * @param {[string]} original [the original value]
 * @param {[array]} rest  [the rest of the values]
 */
Utils.ValueParser = function(original, rest) {
  this.initialize = function() {
    this.original = original;
    this.rest = rest;
    this.forumla = null;
    this.originalLength = original.length;
  };
  this.initialize();
};

/**
 * Algorithm for setting the format for the rest of the values
 */
Utils.ValueParser.prototype.setFormat = function() {
  _.each(this.rest, function(item) {

  });
};

/**
 * Gets the regex derived from setFormat
 * @return {[regex]}
 */
Utils.ValueParser.prototype.getFormula = function() {

};

/**
 * Parses the rest of the values and returns the formatted values
 * @return {[array]} [the reformatted array]
 */
Utils.ValueParser.prototype.parse = function() {
  var res = [];
  _.each(this.rest, function(item) {
    res.push(item.substr(0, this.originalLength));
  });
  return res;
};

if(module.exports !== undefined) {
  module.exports = Utils.ValueParser;
}
