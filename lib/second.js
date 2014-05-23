var phantom = require('phantom');
phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open("http://www.imdb.com/title/tt0831387/?ref_=hm_cht_t1", function(status) {
      console.log("opened site? ", status);

      page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
          // setTimeout(function() {
            return page.evaluate(function() {
              var text = "";
              var path = "div.titlePageSprite.star-box-giga-star";
              debugger;
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
