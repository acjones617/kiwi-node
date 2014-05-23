var phantom = require('phantom');
phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open("http://www.example.com/", function(status) {
      console.log("opened site? ", status);

      page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
          // setTimeout(function() {
            return page.evaluate(function() {
              console.log($('body'));
                var text = "";
                var isSearching = true;
                var path = "html>body>div>p:eq(1)>a";
                debugger;
                while(isSearching) {
                  // text = $(path).text();
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
                // console.log(result.html);
                ph.exit();
            });
          // }, 5000);

      });
    });
    });
});
