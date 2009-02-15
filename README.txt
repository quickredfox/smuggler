Smuggler.js 

Rough example: 
    
[index.html]---------------------------------------------

    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
    <head>
    	<title>Example</title>
       <script src="http://example1.com/smuggler.js?path=http://example1.com/itinerary.js" type="text/javascript" charset="utf-8"></script>
    </head>
    <body>

    </body>
    </html>

[itinerary.js]-------------------------------------------

Smuggler.fetch(
   [
   // Lets say we load jquery first and then some other thing.... 
      {
         source: 'http://some.place.com/where/you/find/jquery.js',
         ensure: 'jQuery',
         onStart: function(){
            // show a loader or something 
         },
         onFail: function(o){
            // plan 9 from outter space
         },
         onComplete: function(){
            // create our interface for our next script to put stuff in once it's loaded (or whatever)
         }
      },
      // now we have jQuery and we are going to cornify!
      {
         source: 'http://www.cornify.com/js/cornify.js',
         onComplete: function(){
            // like I said... whatever...
            cornify_add();
         }
      }
      
   ]
)

 
TODO: Come up with better docs