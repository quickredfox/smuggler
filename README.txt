Smuggler.js 

    Here's the dilly yo!

    I sometimes find myself doing incredible things 
    that you're not supposed to be doing. And while 
    I'm doing that, I like to work with tools I know 
    and stable libraries that have lots of people 
    working on them for free(as in beer).  Let's just say
    it's a nice way to grok stuff and generate proofs of concept
    and whatnot. 

    So seeing here as I'd rather code cool things than 
    bother with browsers, I made myself this little shindig 
    here that I like to call Smuggler.js.

    The nitty Gritty:

    What Smuggler.js does is similar to the dojo loader
    or Package.js or the likes but had a couple important
    differences: The "packages" dont have to respond to any 
    specific methods (no expected interface). Really, this 
    is meant to be a raw, minimal tool so I can load jQuery 
    and whatever suits my fancy in any way I want.

    Example:

    You can pass the fetch method an array of options or just one
    options object depending on what you need... 
    I like to keep my "itinerary" in a separate file, so
    i've added support for a "path" parameter in the smuggler.js's 
    script tag. 

So a really rough walkthrough here:

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

 
TODO: Come up with better documentation and a better explanation as to why I re-wrote the wheel. 