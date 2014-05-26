var _ = require('underscore');
var expect = require('chai').expect;
var Utils = {};
var ValueParser = require('../../../../app/scripts/lib/ValueParser');

describe('value parser', function () {
  it('exists', function () {
    expect(ValueParser).to.exist;
    expect(ValueParser).to.be.a('function');
  });

  it('parses the value with a naive algorithm', function () {
    var original = "$585.64";
    var rest = ["$585.64$581.35", "$585.66$582.25", "$586.03$583.38"];
    var parser = new ValueParser(original, rest);
    expect(parser.parse()).to.eql(["$585.64", "$585.66", "$586.03"]);
  });
});