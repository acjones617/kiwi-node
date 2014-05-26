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

  it('parses when the number of digits on the value has increased', function () {
    var original = "$585.64";
    var rest = ["$5850.64", "$5850.66", "$5860.03"];
    var parser = new ValueParser(original, rest);
    expect(parser.parse()).to.eql(["$5850.64", "$5850.66", "$5860.03"]);
  });

  it('parses when the number of digits on the value has decreased', function () {
    var original = "$585.64";
    var rest = ["$58.64", "$50.66", "$58.03"];
    var parser = new ValueParser(original, rest);
    expect(parser.parse()).to.eql(["$58.64", "$58.66", "$58.03"]);
  });

  it('parses when decimals go away', function () {
    var original = "$585.64";
    var rest = ["$585", "$505", "$586"];
    var parser = new ValueParser(original, rest);
    expect(parser.parse()).to.eql(["$585", "$505", "$586"]);
  });

  it('parses when there are additional crap values', function () {
    var original = "50";
    var rest = ["501261645More "];
    var parser = new ValueParser(original, rest);
    expect(parser.parse()).to.eql(["50"]);

    var original = "7,235,750,012";
    var rest = ["7,235,750,13255,204,652371,72922,778,102153,38032,426,550218,349$ 10,204,217,040$ 9,045,598,549$ 4,677,712,87627,262,56055,678,197114,691,291986,876490,860,637639,8774,943,300$ 179,637,7212,903,193,932202,177,817,9703,396,134595,271,6443,716,640,2942,064,9312,779,95513,878,797,6214,764,7433,888,181890,895,6331,591,753,377530,584,45929,900$ 465,283,366$ 184,831,6671,968,509715,025739,458,867382,986,055310,217,01872,769,0372,859,482,573,97181,960,0281,212,690,859,73514,4371,137,390,935,33159,8634,379,942,519,414151,0335,154,1873,017,87916,679,732136,49336,287,159667,4393,260,812389,44414,799,518,8021,984,788993,020425,759$ 158,833,119,767535,955"];
    var parser = new ValueParser(original, rest);
    expect(parser.parse()).to.eql(["7,235,750,012"]);
  });

});