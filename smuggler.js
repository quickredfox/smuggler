/*
   Smuggler.js

   Copyright (c) 2009 Francois Lafortune (aka: Quickredfox)

   Permission is hereby granted, free of charge, to any person
   obtaining a copy of this software and associated documentation
   files (the "Software"), to deal in the Software without
   restriction, including without limitation the rights to use,
   copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the
   Software is furnished to do so, subject to the following
   conditions:

   The above copyright notice and this permission notice shall be
   included in all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
   OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
   WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
   OTHER DEALINGS IN THE SOFTWARE.
*/
// Tested in IE6, Opera 9.20, Firefox 3.0.5, Safari
 (function() {
    if (undefined === window.Smuggler) window.Smuggler = {};
    /*
    * These "Method Scoped Constants" make Smuggler.js Faster.
    */
    // empty function
    var K = function() {}
    // default settings to merge with provided options
    var DEFAULTS = {
        onStart: K,
        onComplete: K,
        onFail: K,
        ensure: null,
        source: ''
    };
    // And object to contain the script URL that have been
    // loaded
    var LOADED = {};
    // Keeps trac of the loading state of a script before
    // fetching the next one.
    var LOADING_STATE = 'ready';
    // Having this as a constant instead of using 0.1 in each setTimeout call
    // seems to make things a wee bit faster according to jslitmus
    var SHORT_TIMEOUT = 1;

    /*   
    * Tested against multiple approaches, this way seemed the fastest,
    * This method stringified method chain and checks the global space
    * to see if it's defined
    */
    function ensure(fullname) {
        var ns = ensure.namespace ? ensure.namespace: window;
        var names = ('string' != typeof fullname) ? fullname: fullname.split('.');
        if (names.length > 0) {
            var testMethod = ns[names.shift()];
            if (testMethod) {
                ensure.namespace = testMethod;
                return ensure(names);
            } else {
                ensure.namepsace = window;
                return false;
            }

        } else {
            ensure.namepsace = window;
            return true
        }
    };
    // sets default options or overides them with new ones.
    function setup(options) {
        for (var k in DEFAULTS) {
            if (!options[k]) {
                options[k] = DEFAULTS[k];
            }
        }
        return options;
    };
    function makeAndAppendScriptTag(url, callback) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        // Uncomment the last part if you're having trouble with refreshes
        // while developing your whatever.
        s.src = url;
        // + '?'+(new Date()).getTime()
        if (undefined === s.onreadystatechange) s.onload = function() {
            callback();
        }
        else s.onreadystatechange = function() {
            if (/^(loaded|complete)$/.test(s.readyState)) callback();
        };
        document.getElementsByTagName('head')[0].appendChild(s);
        return s;
    };

    /* 
    * Gets all the document's script nodes as an Array instead of a Nodelist
    */
    function getScripts() {
        try {
            return Array.prototype.slice.call(document.getElementsByTagName('script'));
        } catch(E) {
            //slower for IE
            var scripts = [];
            for (var i = 0, node; node = document.getElementsByTagName('script')[i++];) {
                scripts.push(node);
            };
            return scripts;
        }
    }

    /*
    * If a path has been specified as argument, grab the argument and 
    * set it up for import
    */
    function loadPath() {
        if (!loadPath.scripts) {
            loadPath.scripts = getScripts();
        }
        var tag = loadPath.scripts.shift();
        if (!tag) {
            return (loadPath.scripts = false)
        };
        if ( !! (m = tag.src.match(/smuggler\.js\?path=([^&]+)/))) {
            Smuggler.fetch({
                source: escape(m[1])
            });
        }
        loadPath();
    }
    /*
    * Smuggler Public Object. 
    * currently has one method only and this is the only method 
    * users of this tool should be using, since the rest is subject to
    * major refactoring, this Object will attempt to
    * keep it's interface intact.
    */
    var Smuggler = {
        fetch: function(options) {
            if (options.constructor == Array) {
                Smuggler.fetch(options.shift());
                if (options.length > 0) Smuggler.fetch(options);
                return options;
            } else {
                var tag,
                options = setup(options);
                if (!LOADED[options.source]) {
                    if (LOADING_STATE != 'loading') {
                        LOADING_STATE = 'loading';
                        options.onStart();
                        tag = makeAndAppendScriptTag(options.source,
                        // Called when script tag has finished loading.
                        function SmugglerScriptLoadedCallback() {
                            setTimeout(function() {
                                tag.parentNode.removeChild(tag)
                            },
                            SHORT_TIMEOUT);
                            try {
                                if ((typeof options.ensure == 'string') && !ensure(options.ensure)) {
                                    return options.onFail(options);
                                }
                            } catch(E) {
                                options.error = E;
                                return options.onFail(options);
                            }
                            LOADED[options.source] = true;
                            LOADING_STATE = 'ready';
                            return options.onComplete(options);
                        });
                    } else {
                        setTimeout(function() {
                            Smuggler.fetch(options)
                        },
                        SHORT_TIMEOUT);
                    }
                } else {
                    options.onComplete(options);
                }
            };
            return options;
        }
    };

    setTimeout(function() {
        if (!document || (document && !document.getElementsByTagName('head'))) {
            setTimeout(arguments.callee, SHORT_TIMEOUT)
        } else {
            loadPath();
        }
    },
    SHORT_TIMEOUT);
    window.Smuggler = Smuggler;
})();
