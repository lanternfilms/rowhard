/* Custom scripting for the site */

/* New modernizr test for all touch devices */
Modernizr.addTest('touchcapable', function () {
    var bool;
    if (
        ('ontouchstart' in window) || 
        (window.DocumentTouch && document instanceof DocumentTouch) || 
        (navigator.maxTouchPoints > 0) || 
        (navigator.msMaxTouchPoints > 0)
    ){
        // Secondary test to rule out some false positives
        if (
            (window.screen.width > 1279 && window.devicePixelRatio == 1) ||
            (window.screen.width > 1000 && window.innerWidth < (window.screen.width * 0.9)) // this checks if a user is using a resized browser window, not common on mobile devices
        ){
            bool = false;
        } else {
            bool = true;
        }
    } else {
        bool = false;
    }
    return bool;
});

/* Global namespace */
var RowHard = RowHard || {};

RowHard.data = RowHard.data || {};

RowHard.el = {
    html            : $('html'),
    win             : $(window),
    doc             : $(document),
    body            : $('body'),
    footer          : $('.footer')
};

RowHard.isPageloaded = false;

RowHard.util = {
    hasTouch        : Modernizr.touchcapable,
    orientation     : function() {
        if (typeof orientation != 'undefined') {
            return (Math.abs(window.orientation) === 90)? "landscape" : "portrait";
        } else {
            return (RowHard.util.viewportWidth() >= RowHard.util.viewportHeight()) ? "landscape" : "portrait";
        }
    },
    isOldIE: function() {
        return (($.browser.msie) && ($.browser.version <= 8))? true : false;
    }
};

/* Set up link behaviors
   ========================================================================== */
RowHard.links = {
    init: function() {
        // Prevent jumping to top upon clicking blank links
        $('a[href="#"]').click(function(e){e.preventDefault();});
        
        // Open PDF links in a new window
        $('a[href$=".pdf"]').attr('target', '_blank');
    }
};

/* Set up modals
   ========================================================================== */
RowHard.modals = {
    triggered: false,
    init: function() {
        enquire.register("screen and (min-width:1026px)", {
            match : function() {
                if (RowHard.modals.triggered === false) {
                    // Open the trailer modal
                    $('#trailerModal').foundation('reveal', 'open');
                    RowHard.modals.triggered = true;
                }
            }
              
        }); 
    }
};

/* Initialize/Fire
   ========================================================================== */
RowHard.startup = {
    init : function () {
        //console.log("Initial load: scripting initializing");
        RowHard.links.init();
        RowHard.modals.init();
    },
    finalize : function() {
        //console.log("Initial load: scripting finalized");
    }
};

$(document).ready(function() {

    Modernizr.load([
        
        // Test need for matchMedia polyfill
        {
            test: window.matchMedia,
            nope: ['/assets/js/vendor/media.match.min.js'],
            load: ['/assets/js/vendor/enquire.min.js'],
            complete: function() {

                /* Fire based on document context 
                ========================================================================== */

                var namespace  = RowHard.startup, context = document.body.id;
                if (typeof namespace.init === 'function') {
                    namespace.init();
                }
                if (namespace && namespace[ context ] && (typeof namespace[ context ] === 'function')) {
                    namespace[ context ]();
                }
                if (typeof namespace.finalize === 'function') {
                    namespace.finalize();
                }

                RowHard.isPageloaded = true;
 
            }
        }
    ]);
});