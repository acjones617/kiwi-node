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

/**
 * Algorithm for setting the format for the rest of the values
 */
ValueParser.prototype.setFormat = function() {
  _.each(this.rest, function(item) {

  });
};

/**
 * Gets the regex derived from setFormat
 * @return {[regex]}
 */
ValueParser.prototype.getFormula = function() {

};

/**
 * Parses the rest of the values and returns the formatted values
 * @return {[array]} [the reformatted array]
 */
ValueParser.prototype.parse = function() {
  var res = [];
  var original = this.original;
  var origLength = this.origLength;
  _.each(this.rest, function(item) {
    var diff = Diff.diff(item, original);
    debugger;
    res.push(item.substr(0, origLength));
  });
  return res;
};
