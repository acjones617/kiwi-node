var phantom = require('phantom');
phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open("http://www.imdb.com/showtimes/title/tt1877832/2014-05-22/?ref_=tt_wbr", function(status) {
      console.log("opened site? ", status);

            page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
                //jQuery Loaded.
                //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
                setTimeout(function() {
                    return page.evaluate(function() {

                        //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object.
                        var text = "";
                        var isSearching = true;
                        var path = "html>body>div:eq(0)>div>div:eq(3)>div:eq(2)>div:eq(0)>div:eq(0)>h1";
                        while(isSearching) {
                          text = $(path).text();
                          if(text === "") {
                            path = path.split(">").slice(0, -1).join(">");
                          } else {
                            isSearching = false;
                          }
                        }
                        return {
                          text: text,
                          html: $('body').html()
                        };
                    }, function(result) {
                        console.log(result.text);
                        ph.exit();
                    });
                }, 5000);

            });
    });
    });
});
