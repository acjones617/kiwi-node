var phantom = require('phantom');
phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open("https://twitter.com/seandokko", function(status) {
      console.log("opened site? ", status);

      page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
          // setTimeout(function() {
            return page.evaluate(function() {
              var text = "";
              var path = "html>body>div>div>div>div>div>div>div>div>div>div>div>ul>li>a>span.ProfileNav-value";
              text = $(path).text();
              return {
                text: text,
                html: $('body').html()
              };
            }, function(result) {
                console.log('text', result.text);
                // console.log(result.html);
                ph.exit();
            });
          // }, 5000);

      });
    });
    });
});
