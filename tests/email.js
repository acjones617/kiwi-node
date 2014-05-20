var expect = require('chai').expect;
var smtp = require('../lib/email');

describe('emails', function() {
  it('sends emails', function() {
    smtp.init();
    var options = {
      name: 'Sean <andrewk0291@gmail.com>',
      to: 'dokko1230@gmail.com, syeoryn@gmail.com',
      subject: 'TEST EMAIL',
      text: 'THIS IS A TEST',
      html: '<div> THIS IS A TEST YO</div>'
    };
    smtp.sendMail(options);
  });
});
