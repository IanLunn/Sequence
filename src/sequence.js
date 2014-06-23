/*
 * Sequence
 * The CSS3 Animation Framework
 *
 * @link https://github.com/IanLunn/Sequence
 * @author IanLunn
 * @version 2.0.0-alpha.3
 * @license https://github.com/IanLunn/Sequence/blob/master/LICENSE
 * @copyright IanLunn
 */

function defineSequence(imagesLoaded, Hammer) {

  'use strict';

  /**
   * Sequence function
   *
   * @param {Object} element - the element Sequence is bound to
   * @param {Object} options - this instance's options
   * @return {Object} self - Properties and methods available to this instance
   * @api public
   */
  var Sequence = (function(element, options) {

    // Prevent an element from have multiple instances of Sequence applied to it
    if (element.dataset.sequence === "true") {
      return;
    }

    // The element now has Sequence attached to it
    element.dataset.sequence = true;

    /* --- PRIVATE VARIABLES/FUNCTIONS --- */

    // Default Sequence settings
    var defaults = {

      /* --- General --- */

      // The first step to show
      startingStepId: 1,

      // Should the starting step animate in to begin with?
      startingStepAnimatesIn: false,

      // When the last step is reached, should Sequence cycle back to the start?
      cycle: true,

      // How long to wait between the current phase animating out, and the next
      // animating in.
      phaseThreshold: true,

      // Should animations be reversed when navigating backwards?
      reverseWhenNavigatingBackwards: false,

      // Should the active step be given a higher z-index?
      moveActiveStepToTop: true,


      /* --- Canvas Animation --- */

      // Should the canvas automatically animate between steps?
      animateCanvas: true,

      // Time it should take to animate between steps
      animateCanvasDuration: 500,


      /* --- autoPlay --- */

      // Cause Sequence to automatically navigate between steps
      autoPlay: true,

      // How long to wait between each step before navigation occurs again
      autoPlayThreshold: 5000,

      // Direction of navigation when autoPlay is enabled
      autoPlayDirection: 1,


      /* --- Navigation Skipping --- */

      // Allow the user to navigate between steps even if they haven't
      // finished animating
      navigationSkip: true,

      // How long to wait before the user is allowed to skip to another step
      navigationSkipThreshold: 250,

      // Fade a step when it has been skipped
      fadeStepWhenSkipped: false,

      // How long the fade should take
      fadeStepTime: 500,

      // Don't allow the user to go to a previous step when the current one is
      // still active
      preventReverseSkipping: false,


      /* --- Next/Prev Button --- */

      // Use next and previous buttons? You can also specify a CSS selector to
      // change what element acts as the button. If true, the element uses
      // classes of "sequence-next" and "sequence-prev"
      nextButton: true,
      prevButton: true,


      /* --- Pause Button --- */

      // Use a pause button? You can also specify a CSS selector to
      // change what element acts as the button. If true, the element uses the
      // class of "sequence-pause"
      pauseButton: true,

      // Amount of time to wait until autoPlay starts again after being unpaused
      unpauseThreshold: null,

      // Pause autoPlay when the Sequence element is hovered over
      pauseOnHover: true,


      /* --- Pagination --- */

      // Use pagination? You can also specify a CSS selector to
      // change what element acts as pagination. If true, the element uses the
      // class of "sequence-pagination"
      pagination: true,


      /* --- Preloader --- */

      // You can also specify a CSS selector to
      // change what element acts as the preloader. If true, the element uses
      // the class of "sequence-preloader"
      preloader: false,

      // Preload all images from specific steps
      preloadTheseSteps: [1],

      // Preload specified images
      preloadTheseImages: [
        /**
         * Example usage
         * "images/catEatingSalad.jpg",
         * "images/grandmaDressedAsBatman.png"
         */
      ],

      // Hide Sequence's steps until it has preloaded
      hideStepsUntilPreloaded: true,


      /* --- Keyboard --- */

      // Can the user navigate between steps by pressing keyboard buttons?
      keyNavigation: false,

      // When numeric keys 1 - 9 are pressed, Sequence will navigate to the
      // corresponding step
      numericKeysGoToSteps: false,

      // Events to run when the user presses the left/right keys
      keyEvents: {
        left: function(sequence) {sequence.prev()},
        right: function(sequence) {sequence.next()}
      },


      /* --- Touch Swipe --- */

      // Can the user navigate between steps by swiping on a touch enabled device?
      swipeNavigation: true,

      // Events to run when the user swipes in a particular direction
      swipeEvents: {
        left: function(sequence) {sequence.prev()},
        right: function(sequence) {sequence.next()},
        up: false,
        down: false
      },

      // Options to supply the third-party Hammer library See: https://github.com/EightMedia/hammer.js/wiki/Getting-Started
      swipeHammerOptions: {
        prevent_mouseevents: true,
        drag_min_distance: 10,
        stop_browser_behavior: false
      },


      /* --- hashTags --- */

      // Should the URL update to include a hashTag that relates to the current
      // step being shown?
      hashTags: false,

      // Get the hashTag from an ID or data-sequence-hashtag attribute?
      hashDataAttribute: false,

      // Should the hash change on the first step?
      hashChangesOnFirstStep: false,


      /* --- Fallback Theme --- */

      // Settings to use when the browser doesn't support CSS transitions
      fallback: {

        // The speed to transition between steps
        speed: 500,

        /**
         * auto   - Sequence will detect the best layout to use based on the
         *          animateCanvas option. If animateCanvas is false, the "basic"
         *          layout will be used. If animateCanvas is true, the "custom"
         *          layout is used.
         * basic  - Layout each step in one row using inline-block
         * custom - Assume the developer defined layout is to be used and don't
         *          layout the steps in any way.
         *
         * See sequence._animationFallback.setupCanvas();
         */
        layout: "auto"
      }
    }

    // See Sequence._animation.domDelay() for an explanation of this
    var domThreshold = 50;

    // Throttle the window resize event
    // see self.manageEvent.add.resizeThrottle()
    var resizeThreshold = 100;

    // Translate step data-attributes to a CSS property and unit
    var translateAttributes = {
      "sequenceX": {
        "name": "translateX",
        "unit": "px"
      },
      "sequenceY": {
        "name": "translateY",
        "unit": "px"
      },
      "sequenceZ": {
        "name": "translateZ",
        "unit": "px"
      },
      "sequenceRotateX": {
        "name": "rotateX",
        "unit": "deg"
      },
      "sequenceRotateY": {
        "name": "rotateY",
        "unit": "deg"
      },
      "sequenceRotate": {
        "name": "rotateZ",
        "unit": "deg"
      },
      "sequenceScale": {
        "name": "scale",
        "unit": ""
      }
    };

    /**
     * This version of Modernizr is for use with Sequence.js and is included
     * internally to prevent conflicts with other Modernizr builds.
     *
     * Modernizr 2.8.2 (Custom Build) | MIT & BSD
     * Build: http://modernizr.com/download/#-cssanimations-csstransitions-svg-prefixed-testprop-testallprops-domprefixes
     */
    var Modernizr=function(a,b,c){function x(a){i.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for (var d in a){var e=a[d];if (!A(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for (var e in a){var f=b[a[e]];if (f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+m.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+n.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.8.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l="Webkit Moz O ms",m=l.split(" "),n=l.toLowerCase().split(" "),o={svg:"http://www.w3.org/2000/svg"},p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if (typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if (this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.cssanimations=function(){return D("animationName")},p.csstransitions=function(){return D("transition")},p.svg=function(){return!!b.createElementNS&&!!b.createElementNS(o.svg,"svg").createSVGRect};for (var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if (typeof a=="object")for (var d in a)w(a,d)&&e.addTest(d,a[d]);else {a=a.toLowerCase();if (e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},x(""),h=j=null,e._version=d,e._domPrefixes=n,e._cssomPrefixes=m,e.testProp=function(a){return B([a])},e.testAllProps=D,e.prefixed=function(a,b,c){return b?D(a,b,c):D(a,"pfx")},e}(this,window.document);

    // Convert a prefixed transformOrigin to transform-origin
    var transformOrigin = Modernizr.prefixed("transformOrigin").replace("mO", "m-o");

    /**
     * Is an object an array?
     *
     * @param {Object} object - The object we want to test
     * @api private
     */
    function isArray(object) {

      if ( Object.prototype.toString.call( object ) === '[object Array]' ) {
        return true;
      }else {
        return false;
      }
    }

    /**
     * Extend object a with the properties of object b.
     * If there's a conflict, object b takes precedence.
     *
     * @param {Object} a - The first object to merge
     * @param {Object} b - The second object to merge (takes precedence)
     * @api private
     */
    function extend(a, b) {

      for (var i in b) {
        a[i] = b[i];
      }

      return a;
    }

    /**
     * Cross Browser helper to addEventListener
     * Source: http://ejohn.org/projects/flexible-javascript-events/
     *
     * @param {Object} obj - The Element to attach event to.
     * @param {String} type - The event that will trigger the binded function.
     * @param {Function} fn - The function to bind to the element.
     * @return {Function} fn - Return the function so it can be removed later
     * @api private
     */
    function addEvent(obj, type, fn) {

      if (obj.attachEvent === true) {

        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
        obj.attachEvent('on'+type, obj[type+fn]);
      }else {
        obj.addEventListener(type, fn, false);
      }

      return fn;
    }

    /**
     * Cross Browser helper to removeEventListener
     * Source: http://ejohn.org/projects/flexible-javascript-events/
     *
     * @param {Object} obj - The element to remove the event from.
     * @param {string} type - The event to remove from the element.
     * @param {Function} fn - The function to remove from the the element.
     * @api private
     */
    function removeEvent(obj, type, fn) {

      if (obj.detachEvent === true) {

        obj.detachEvent('on'+type, obj[type+fn]);
        obj[type+fn] = null;
      }else {
        obj.removeEventListener(type, fn, false);
      }
    }

    function toArray(obj) {
      var array = [];
      // iterate backwards ensuring that length is an UInt32
      for (var i = obj.length >>> 0; i--;) {
        array[i] = obj[i];
      }
      return array;
    }

    /**
     * Get an element by its class name
     *
     * @param {HTMLElement} node - The parent element the element you want to find belongs to
     * @param {String} classname - The name of the class to find
     * @return {HTMLElement} - The element within the parent with the defined class
     * @api private
     */
    function getElementsByClassName(node, classname) {

      // Use native implementation if available
      if (node.getElementsByClassName === true) {
        return node.getElementsByClassName(classname);
      }

      // Browser doesn't support getElementsByClassName
      else {
        return(function getElementsByClass(searchClass,node) {
          if (node === null)
            node = document;
            var classElements = [],
                els = node.getElementsByTagName("*"),
                elsLen = els.length,
                pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;

          for (i = 0, j = 0; i < elsLen; i++) {

            if (pattern.test(els[i].className)) {
              classElements[j] = els[i];
              j++;
            }
          }

          return classElements;
        })(classname, node);
      }
    }

    /**
     * Converts a time value taken from a CSS property, such as "0.5s"
     * and converts it to a number in milliseconds, such as 500
     *
     * @param {String} time - the time in a string
     * @return {Number}
     * @api private
     */
    function convertTimeToMs(time) {

      var convertedTime;
      var fraction;

      // Deal with milliseconds and seconds
      if (time.indexOf("ms") > -1) {
        fraction = 1;
      }else {
        fraction = 1000;
      }

      if (time == "0s") {
        convertedTime = 0;
      }else {
        convertedTime = parseFloat(time.replace("s", "")) * fraction;
      }

      return convertedTime;
    }

    /**
     * Does an element have a particular class?
     *
     * @param {Object} el - The element to check
     * @param {String} name - The name of the class to check for
     * @return {Boolean}
     * @api private
     */
    function hasClass(el, name) {
      return new RegExp('(\\s|^)' + name + '(\\s|$)').test(el.className);
    }

    /**
     * Add a class to an element
     *
     * @param {Object} elements - The element to add a class to
     * @param {String} name - The class to add
     * @api private
     */
    function addClass(elements, name) {

      var element,
          elementsLength = elements.length,
          i;

      // If only one element is defined, turn it into a nodelist so it'll pass
      // through the for loop
      if (isArray(elements) === false) {
        elementsLength = 1;
        elements = [elements];
      }

      for (i = 0; i < elementsLength; i++) {

        element = elements[i];

        if (hasClass(element, name) === false) {
          element.className += (element.className ? ' ': '') + name;
        }
      }
    }

    /**
     * Remove a class from an element
     *
     * @param {Object} elements - The element to remove a class from
     * @param {String} name - The class to remove
     * @api private
     */
    function removeClass(elements, name) {

      var element,
          elementsLength = elements.length,
          i;

      // If only one element is defined, turn it into a nodelist so it'll pass
      // through the for loop
      if (isArray(elements) === false) {
        elementsLength = 1;
        elements = [elements];
      }

      for (i = 0; i < elementsLength; i++) {

        element = elements[i];

        if (hasClass(element, name) === true) {
          element.className = element.className.replace(new RegExp('(\\s|^)' + name + '(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
        }
      }
    }

    /**
     * Remove the no-JS "animate-in" class from a step
     *
     * @param {Object} self - Properties and methods available to this instance
     * @api private
     */
    function removeNoJsClass(self) {

      if (self.transitionsSupported === false) {
        return;
      }

      // Look for the step with the "animate-in" class and remove the class
      for (var i = 0; i < self.steps.length; i++) {
        var element = self.steps[i];

        if (hasClass(element, "animate-in") === true) {
          var step = "step" + (i + 1);

          self._animation.resetInheritedSpeed(step, "animate-in");
          removeClass(element, "animate-in");
        }
      }
    };

    /**
     * Determine if an element has a specified parent, and if so, return the index
     * number for the element.
     *
     * The index is taken from the top level elements witint a pagination
     * element. This function will iterate through each parent until it
     * reaches the top level, then get all top level elements and determine
     * the index of the chosen top level.
     *
     * @param {Object} parent - The parent element that the child should be within
     * @param {Object} target - The child element to test if it has the parent
     * @param {Object} previousTarget - The element that was previously checked to determine if it was top level
     * @api private
     */
    function hasParent(parent, target, previousTarget) {

      if (target.localName === "body") {
        return false;
      }

      // We're at the pagination parent
      if (parent === target) {

        if (previousTarget !== undefined) {

          // Get the top level element clicked and all top level elements
          var topLevel = previousTarget;
          var allTopLevel = parent.getElementsByTagName(topLevel.localName);

          // Count the number of top level elements
          var i = allTopLevel.length;

          // Which top level element was clicked?
          while(i--) {
            if (topLevel === allTopLevel[i]) {

              // One-base the index and return it
              return i + 1;
            }
          }
        }
      }

      // Not yet at the pagination parent element, iterate again
      else {
        var previousTarget = target;
        return hasParent(parent, target.parentNode, previousTarget);
      }
    }

    /**
     * Get Sequence's steps
     *
     * @param {HTMLElement} parent - The parent element of the steps
     * @return {Array} steps - The elements that make up Sequence's steps
     * @api private
     */
    function getSteps(parent) {

      var steps = [];

      // Get all of Sequence's elements and count them
      var elements = parent.getElementsByTagName("*");
      var elementsLength = elements.length;

      // Get the elements that have a parent with a class of "sequence-canvas"
      for (var i = 0; i < elementsLength; i++) {

        var element = elements[i];
        var parent = element.parentNode;

        if (hasClass(parent, "sequence-canvas") === true) {
          steps.push(element);
        }
      }

      return steps;
    }

    /**
     * Take transform properties and convert them into a CSS string
     *
     * @param {Object} properties - The transform properties to convert to a string
     * @param {Boolean} polar - Whether the rotate X/Y/Z properties should be reversed
     * @return {String} The transform properties in a CSS string
     * @api private
     */
    function propertiesToCss(properties, polar) {

      var css = "",
          value,
          property,
          propertyName,
          unit;

      css += "translateX(" + properties.sequenceX + "px) ";
      css += "translateY(" + properties.sequenceY + "px) ";
      css += "translateZ(" + properties.sequenceZ + "px) ";

      // Add rotate X/Y/Z and reverse them if necessary
      if (polar !== true) {

        css += "rotateX(" + properties.sequenceRotateX + "deg) ";
        css += "rotateY(" + properties.sequenceRotateY + "deg) ";
        css += "rotateZ(" + properties.sequenceRotate + "deg) ";
        css += "scale(" + properties.sequenceScale + ")";
      } else {

        css += "rotateZ(" + properties.sequenceRotate + "deg) ";
        css += "rotateY(" + properties.sequenceRotateY + "deg) ";
        css += "rotateX(" + properties.sequenceRotateX + "deg) ";
      }

      return css;
    }

    /* --- PUBLIC PROPERTIES/METHODS --- */

    var self = {};

    /**
     * Create an object map containing the elements that will animate, their
     * duration time and the maximum duration each phase's animation will last.
     * This enables Sequence to determine when a phase has finished animating and
     * when to start the next phase's animation (if autoPlay is being used).
     * Sequence can also quickly get elements to manipulate in
     * Sequence._animation.resetInheritedSpeed() without querying the DOM again.
     *
     * A phase's duration consists of the highest combination of
     * transition-duration and transition-delay
     *
     * @api private
     */
    self._getAnimationMap = {

      /**
       * Start getting the animation map.
       *
       * @param {HTMLElement} element - the Sequence element
       * @return {Object}
       */
      init: function(element) {

        // Where we'll save the animations
        this.animationMap = {};

        if (self.transitionsSupported === true) {

          // Clone Sequence so it can be quickly forced through each step
          // and get the canvas and each step
          this.clonedSequence = this.createClone(element);
          this.clonedCanvas = getElementsByClassName(this.clonedSequence, "sequence-canvas")[0];
          this.clonedSteps = getSteps(this.clonedCanvas);

          // Get any non-animation class names applied to Sequence
          this.originalClasses = this.clonedSequence.className;

          // Where we'll save how many steps are animating
          this.animationMap["stepsAnimating"] = 0;

          // Initiate each Sequence step on the cloned Sequence
          this.steps();

          // Remove the Sequence clone now we've got the animation map
          this.destroyClone(this.clonedSequence);
        }

        // CSS transitions aren't supported, just return the step elements
        else {

          for (var i = 0; i < self.noOfSteps; i++) {

            var step = "step" + (i + 1);
            this.animationMap[step] = {};
            this.animationMap[step]["element"] = self.steps[i];
          }
        }

        return this.animationMap;
      },

      /**
       * Get transform properties from a steps data-attributes and return them
       * for later use.
       *
       * @param {String} stepName - The Name of the step, "step1" for example
       * @param {HTMLElement} step - The step to get the properties from
       * @return {String} transformCss - The CSS string containing transform properties
       */
      getTransformProperties: function(stepName, step) {

        var stepProperties = step.dataset,
            index,
            attribute,
            attributeReversed,
            property,
            origins,
            originX = 0,
            originY = 0,
            originZ = 0;

        // Default transforms
        var stepTransform = {
          "sequenceX": 0,
          "sequenceY": 0,
          "sequenceZ": 0,
          "sequenceRotateX": 0,
          "sequenceRotateY": 0,
          "sequenceRotate": 0,
          "sequenceScale": 1
        };

        var canvasTransform = {
          "sequenceX": 0,
          "sequenceY": 0,
          "sequenceZ": 0,
          "sequenceRotateX": 0,
          "sequenceRotateY": 0,
          "sequenceRotate": 0,
          "sequenceScale": 1
        };

        var styles = getComputedStyle(step, null);

        // Set up the transform CSS for each data-attribute used
        for (property in stepProperties) {

          if (stepProperties.hasOwnProperty(property) === true) {

            var attribute = stepProperties[property];
            stepTransform[property] = attribute;

            if (property !== "sequenceScale") {
              var attributeReversed = attribute * -1;
            }else{
              var attributeReversed = 1 / attribute;
            }

            canvasTransform[property] = attributeReversed;
          }
        }

        // Add the offset left/top onto the X/Y coordinates
        // (after making them polar)
        canvasTransform.sequenceX += step.offsetLeft * -1;
        canvasTransform.sequenceY += step.offsetTop * -1;

        // Get the origins
        origins = styles[Modernizr.prefixed("transformOrigin")].split(" ");
        originX = parseFloat(origins[0]);
        originY = parseFloat(origins[1]);

        if (origins[2] !== undefined) {
          originZ = parseFloat(origins[2]);
        }

        this.animationMap[stepName].transformOrigin = {
          "x": originX,
          "y": originY,
          "z": originZ
        };

        this.animationMap[stepName].stepTransform = stepTransform;
        this.animationMap[stepName].canvasTransform = canvasTransform;
      },

      /**
       * Initiate each Sequence step on the cloned Sequence and apply CSS
       * transforms from data-attributes, where specified
       */
      steps: function() {

        var stepName,
            clonedStepElement,
            realStepElement,
            clonedStepChildren,
            realStepChildren,
            noOfStepChildren,
            transformProperties,
            transformCss;

        for (var i = 0; i < self.noOfSteps; i++) {

          // Get the step, step number (one-based),
          // the step's children and count them
          stepName = "step" + (i + 1);
          clonedStepElement = this.clonedSteps[i];
          realStepElement = self.steps[i];
          clonedStepChildren = clonedStepElement.getElementsByTagName("*");
          realStepChildren = realStepElement.getElementsByTagName("*");
          noOfStepChildren = clonedStepChildren.length;

          // Set up an object where we'll save the step's phase properties
          // Save the step element for later manipulation
          this.animationMap[stepName] = {};
          this.animationMap[stepName].element = realStepElement;

          // Get the transform properties from the data-attributes and apply the
          // transform to the step
          this.getTransformProperties(stepName, realStepElement);

          // Get the CSS string consisting of the transform properties and apply
          transformCss = propertiesToCss(this.animationMap[stepName].stepTransform);
          realStepElement.style[Modernizr.prefixed("transform")] = transformCss;
          realStepElement.style[Modernizr.prefixed("transformStyle")] = "preserve-3d";

          // Add the step class to the sequence element
          addClass(this.clonedSequence, stepName);

          // Get the animations for this step's "animate-in"
          // and "animate-out" phases
          this.phases("animate-in", stepName, clonedStepElement, clonedStepChildren, realStepChildren, noOfStepChildren);
          this.phases("animate-out", stepName, clonedStepElement, clonedStepChildren, realStepChildren, noOfStepChildren);

          // Remove the step class now we're done with it
          removeClass(this.clonedSequence, stepName);
        }
      },

      /**
       * Initiate the "animate-in" and "animate-out" phases for a Sequence step
       *
       * @param {String} phase - The phase "animate-in" or "animate-out"
       * @param {Number} stepName - The step number
       * @param {Object} clonedStepElement - The cloned element associated with the step
       * @param {Array} clonedStepChildren - All of the cloned step's child elements
       * @param {Array} realStepChildren - All of the real step's child elements
       * @param {Number} noOfStepChildren - The number of step child elements
       */
      phases: function(phase, stepName, clonedStepElement, clonedStepChildren, realStepChildren, noOfStepChildren) {

        // Where we'll save this phase's elements and computed duration
        var elements = [];
        var maxDuration = undefined;
        var maxDelay = undefined;
        var maxComputedDuration = undefined;
        var element,
            realElement,
            styles,
            elementNo,
            elementProperties = {};

        // Add the phase class to the current step
        addClass(clonedStepElement, phase);

        // Where we'll save this phase's properties
        this.animationMap[stepName][phase] = {};

        /**
         * Save the step's child element properties if it will animate in the
         * phase being tested
         */
        for (elementNo = 0; elementNo < noOfStepChildren; elementNo++) {

          // Get the cloned element being tested and the real element to be saved
          element = clonedStepChildren[elementNo];
          realElement = realStepChildren[elementNo];

          // Get the element's styles
          styles = getComputedStyle(element, null) || element.currentStyle;
          elementProperties = {};

          // Get the element's transition-duration and transition-delay, then
          // calculate the computed duration
          var transitionDuration = convertTimeToMs(styles[Modernizr.prefixed("transitionDuration")]);
          var transitionDelay = convertTimeToMs(styles[Modernizr.prefixed("transitionDelay")]);
          var transitionTimingFunction = styles[Modernizr.prefixed("transitionTimingFunction")];
          var computedDuration = transitionDuration + transitionDelay;

          /**
           * Will the element animate in this phase?
           *
           * If the element from the cloned Sequence will animate in this phase,
           * add the equivalent real element to the list of elements that will
           * animate, and its duration and delay.
           */
          if (computedDuration !== 0) {

            elementProperties.element = realElement;
            elementProperties.duration = transitionDuration;
            elementProperties.delay = transitionDelay;
            elementProperties.timingFunction = transitionTimingFunction;
            elements.push(elementProperties);

            if (maxDuration === undefined || transitionDuration > maxDuration) {
              maxDuration = transitionDuration;
            }

            if (maxDelay === undefined || transitionDelay > maxDelay) {
              maxDelay = transitionDelay;
            }

            // Save the computed duration if it's the longest one yet
            if (maxComputedDuration === undefined || computedDuration > maxComputedDuration) {
              maxComputedDuration = computedDuration;
            }
          }
        }

        // Remove the phase class from the current step
        removeClass(clonedStepElement, phase);

        // Save this phase's animated elements and maxium computed duration
        this.animationMap[stepName][phase]["elements"] = elements;
        this.animationMap[stepName][phase]["noOfElements"] = elements.length;
        this.animationMap[stepName][phase]["maxDuration"] = maxDuration;
        this.animationMap[stepName][phase]["maxDelay"] = maxDelay;
        this.animationMap[stepName][phase]["computedDuration"] = maxComputedDuration;
      },

      /**
       * Clone an instance of Sequence to get the animation map from
       *
       * @param {Object} element - The Sequence element to clone
       * @return {Object} The cloned element
       */
      createClone: function(element) {

        var clonedSequence = element.cloneNode(true);
        clonedSequence.style.display = "none";
        clonedSequence.id = "sequence";
        element.parentNode.insertBefore(clonedSequence, element);

        return clonedSequence;
      },

      /**
       * Destroy a cloned Sequence element
       *
       * @param {Object} element - The cloned element to destroy
       */
      destroyClone: function(element) {

        // TODO: make IE7 compatible

        element.parentNode.removeChild(element);
      }
    }

    /**
     * Manage UI elements such as nextButton, prevButton, and pagination
     *
     * @api private
     */
    self._ui = {

      // Default UI elements
      defaultElements: {
        "nextButton" : ".sequence-next",
        "prevButton" : ".sequence-prev",
        "pauseButton": ".sequence-pause",
        "pagination" : ".sequence-pagination",
        "preloader"  : ".sequence-preloader"
      },

      /**
       * Get an UI element
       *
       * @param {String} type - The type of UI element (nextButton for example)
       * @return {Boolean | HTMLElement} option - True if using the default
       *                                          element, else an HTMLElement
       */
      getElements: function(type, option) {

        // TODO - change querySelectorAll to something IE7 compatible

        var element,
            elements,
            elementsLength,
            relatedElements = [],
            rel,
            i;

        // Get the element being used
        if (option === true) {

          // Default elements
          elements = document.querySelectorAll(this.defaultElements[type]);
        } else {

          // Custom elements
          elements = document.querySelectorAll(option);
        }

        elementsLength = elements.length;

        // Does the element control this instance of Sequence? We're looking
        // for either a global element or one with a rel attribute the same
        // as this instances ID
        for (i = 0; i < elementsLength; i++) {

          element = elements[i];
          rel = element.getAttribute("rel");

          if (rel === null || rel === self.container.getAttribute("id")) {
            relatedElements.push(element);
          }
        }

        return relatedElements;
      },

      /**
       * Fade an element in using transitions if they're supported, else use JS
       *
       * @param {HTMLElement} element - The element to show
       * @param {Number} duration - The duration to show the element over
       */
      show: function(element, duration) {

        if (self.transitionsSupported === true) {

          element.style[Modernizr.prefixed("transitionDuration")] = duration + "ms";
          element.style[Modernizr.prefixed("transitionProperty")] = "opacity, " + Modernizr.prefixed("transform");
          element.style.opacity = 1;
        }else {

         // TODO - make the step fade out using JS
        }
      },

      /**
       * Fade an element out using transitions if they're supported, else use JS
       *
       * @param {HTMLElement} element - The element to hide
       * @param {Number} duration - The duration to hide the element over
       * @param {Function} callback - Function to execute when the element is hidden
       */
      hide: function(element, duration, callback) {

        if (self.transitionsSupported === true) {

          element.style[Modernizr.prefixed("transitionDuration")] = duration + "ms";
          element.style[Modernizr.prefixed("transitionProperty")] = "opacity, " + Modernizr.prefixed("transform");
          element.style.opacity = ".2";
        }else {

         // TODO - make the step fade out using JS
        }

        if (callback !== undefined) {
          setTimeout(function() {
            callback();
          }, duration);
        }
      }
    }

    /**
     * Methods relating to autoPlay
     *
     * @api private
     */
    self._autoPlay = {

      /**
       * Start or restart autoPlay only if autoPlay is enabled and Sequence
       * isn't currently paused.
       */
      init: function() {

        self.isAutoPlayActive = false;
        self.isPaused = (self.options.autoPlay === true) ? false: true;

        // Should the unpause threshold be taken from the autoPlayThreshold or
        // has the developer defined an unpauseThreshold?
        self.options.unpauseThreshold = (self.options.unpauseThreshold === null) ? self.options.autoPlayThreshold : self.options.unpauseThreshold;

        // Start autoPlay
        if (self.options.autoPlay === true && self.isPaused === false) {
          this.start();
        }
      },

      /**
       * Unpause autoPlay
       */
      unpause: function() {

        if (self.isPaused === true) {

          self.isPaused = false;
          this.start();

          removeClass(self.container, "sequence-paused");
          removeClass(self.pauseButton, "sequence-paused");

          // Callback
          self.unpaused(self);
        }
      },

      /**
       * Pause autoPlay
       */
      pause: function() {

        if (self.isPaused === false) {

          self.isPaused = true;
          this.stop();

          addClass(self.container, "sequence-paused");
          addClass(self.pauseButton, "sequence-paused");

          // Callback
          self.paused(self);
        }
      },

      /**
       * Start autoPlay
       */
      start: function() {

        var threshold;

        // How long to wait before autoPlay should start?
        if (self.isPaused === false) {
          threshold = self.options.autoPlayThreshold;
        }else {
          threshold = self.options.unpauseThreshold;
        }

        // autoPlay is now active
        self.isAutoPlayActive = true;
        self.options.autoPlay = true;

        // Clear the previous autoPlayTimer
        clearTimeout(self.autoPlayTimer);

        // Choose the direction and start autoPlay
        self.autoPlayTimer = setTimeout(function() {

          if (self.options.autoPlayDirection === 1) {
            self.next();
          }else {
            self.prev();
          }
        }, threshold);
      },

      /**
       * Stop autoPlay
       */
      stop: function() {

        self.isAutoPlayActive = false;
        self.options.autoPlay = false;

        clearTimeout(self.autoPlayTimer);
      }
    }

    /**
     * Controls Sequence's canvas
     *
     * @api private
     */
    self._canvas = {

      /**
       * Get the canvas' transform-origins and the transform properties converted into
       * a CSS string
       *
       * @param {Number} id -
       * @return {Object} -
       *
       */
      getTransformCss: function(id) {

        var transformCss,
            transformScale,
            stepName = "step" + id;

        var origin = self.animationMap[stepName].transformOrigin,
            canvasTransformProperties = self.animationMap[stepName].canvasTransform,
            stepTransformProperties = self.animationMap[stepName].stepTransform;

        // Get the step's X and Y transform origins, then flip the X/Y/Z
        // values (positive to negative) and add them to the origins
        var originX = origin.x + (canvasTransformProperties.sequenceX * -1),
            originY = origin.y + (canvasTransformProperties.sequenceY * -1),
            originZ = origin.z + (canvasTransformProperties.sequenceZ * -1);

        // Turn the transform properties into a CSS string
        transformCss = propertiesToCss(canvasTransformProperties, true);

        return {
          "origins": originX + "px " + originY + "px " + originZ + "px",
          "string": transformCss,
          "scale": canvasTransformProperties.sequenceScale
        }
      },

      /**
       * Move the canvas to show a specific step
       *
       * @param {Number} id - The ID of the step to move to
       * @param {Boolean} animate - Should the canvas animate or snap?
       */
      move: function(id, animate) {

        if (self.options.animateCanvas === true) {

          // Get the canvas element and step element to animate to
          var canvas = self.canvas,
              duration = 0,
              transformCss;

          // Should the canvas animate?
          if (animate === true && self._firstRun === false) {
            duration = self.options.animateCanvasDuration;
          }

          // Animate the canvas using CSS transitions
          if (self.transitionsSupported === true) {

            // Get the transform properties translate X/Y/Z, rotate X/Y/Z,
            // scale, and transform-origin
            transformCss = this.getTransformCss(id);

            // Apply the scale transform CSS to the screen
            self.screen.style[Modernizr.prefixed("transitionDuration")] = duration + "ms";
            self.screen.style[Modernizr.prefixed("transitionProperty")] = Modernizr.prefixed("transform");
            self.screen.style[Modernizr.prefixed("transform")] = "scale(" + transformCss.scale + ")";

            // Apply the translate/rotate transform CSS to the canvas
            canvas.style[Modernizr.prefixed("transitionDuration")] = duration + "ms";
            canvas.style[Modernizr.prefixed("transitionProperty")] = Modernizr.prefixed("transform") + ", " + transformOrigin;
            canvas.style[Modernizr.prefixed("transformOrigin")] = transformCss.origins;
            canvas.style[Modernizr.prefixed("transform")] = transformCss.string;
          }

          // Animate the canvas using JavaScript
          else {

            // TODO
          }
        }
      }
    }

    /**
     * Controls Sequence's step animations
     *
     * @api private
     */
    self._animation = {

      /**
       * If the moveActiveStepToTop option is being used, move the next step
       * to the top (via a z-index equivalent to the number of steps), and the
       * current step to the bottom
       *
       * @param {HTMLElement} currentStepElement - The current step to be moved off the top
       * @param {HTMLElement} nextStepElement - The next step to be moved to the top
       */
      moveActiveStepToTop: function(currentStepElement, nextStepElement) {

        if (self.options.moveActiveStepToTop === true) {

          var prevStepElement = self.animationMap["step" + self.prevStepId].element;

          prevStepElement.style.zIndex = 1;
          currentStepElement.style.zIndex = self.noOfSteps - 1;
          nextStepElement.style.zIndex = self.noOfSteps;
        }
      },

      /**
       * If the navigationSkipThreshold option is being used, prevent the use
       * of goTo() during the threshold period
       *
       * @param {Number} id - The ID of the step Sequence is trying to go to
       * @param {Number} direction - The direction Sequence is trying to go
       * @param {String} currentStep - The current step that is active
       * @param {String} nextStep - The next step to become active
       * @param {HTMLObject} nextStepElement -  The element that is to become the next step
       */
      manageNavigationSkip: function(id, direction, currentStep, nextStep, nextStepElement) {

        if (self.transitionsSupported === false) {
          return;
        }

        var _animation = this;

        // Show the next step again
        self._ui.show(nextStepElement, 0);

        if (self.options.navigationSkip === true) {

          // Start the navigation skip threshold
          self.navigationSkipThresholdActive = true;

          // Count the number of steps currently animating
          var activeStepsLength = self.animationMap["stepsAnimating"];

          // Add the steps to the list of active steps
          self.animationMap[currentStep]["isAnimating"] = true;
          self.animationMap[nextStep]["isAnimating"] = true;
          self.animationMap["stepsAnimating"] += 2;

          // Are there steps currently animating that need to be faded out?
          if (activeStepsLength !== 0) {

            // If a step is waiting to animate in based on the phaseThreshold,
            // cancel it
            clearTimeout(self.phaseThresholdTimer);

            // Fade a step out if the user navigates to another prior to its
            // animation finishing
            if (self.options.fadeStepWhenSkipped === true) {

              // Fade all elements that are animating
              // (not including the current one)
              for (var i = 1; i <= self.noOfSteps; i++) {

                var step = "step" + i;
                var stepProperties = self.animationMap[step];

                if (stepProperties.isAnimating === true && i !== id) {
                  var stepElement = stepProperties.element;
                  self._animation.stepSkipped(direction, step, stepElement);
                }
              }
            }
          }

          // Start the navigationSkipThreshold timer to prevent being able to
          // navigate too quickly
          setTimeout(function() {
            self.navigationSkipThresholdActive = false;
          }, self.options.navigationSkipThreshold);
        }
      },

      /**
       * Deal with a step when it has been skipped
       *
       * @param {Number} direction - The direction of navigation when the step was skipped
       * @param {String} step - The step that was skipped
       * @param {HTMLElement} stepElement - The step element that was skipped
       */
      stepSkipped: function(direction, step, stepElement) {

        var phase = (direction === 1) ? "animate-out": "animate-in";

        // Fade the step out
        self._ui.hide(stepElement, self.options.fadeStepTime, function() {

          // Stop the skipped element from animating
          // TODO
        });
      },

      /**
       * Change a step's class. Example: go from step1 to step2
       *
       * @param {Number} id - The ID of the step to change
       */
      changeStep: function(id) {

        // Get the step to add
        var stepToAdd = "step" + id;

        // Add the new step and remove the previous
        if (self.currentStepId !== undefined) {

          var stepToRemove = "step" + self.currentStepId;
          addClass(self.container, stepToAdd);
          removeClass(self.container, stepToRemove);
        }else {
          addClass(self.container, stepToAdd);
        }
      },

      /**
       * Apply the reversed properties to all animatable elements within a step
       *
       * @param {String} step - The step that the elements we'll override belong to
       * @param {Number} phase - The animation phase "animate-in" or "animate-out"
       * @return {Object} stepDurations - How long a step will animate for,
       *                                  including animation, delay, and total
       */
      reverseProperties: function(step, phase, stepDurations) {

        var _animation = this;

        var stepProperties = self.animationMap[step][phase];

        // Apply the transition properties to each element
        for (var i = 0; i < stepProperties.noOfElements; i++) {
          var stepElements = stepProperties.elements[i];

          stepElements.element.style[Modernizr.prefixed("transition")] =
            stepDurations["animation"] + "ms "
            + stepDurations["delay"] + "ms "
            + _animation.reverseTimingFunction(stepElements.timingFunction);
        }

        // Remove transition properties from each element once it has finished
        // animating; allowing for the inherited styles to take effect again.
        setTimeout(function() {
          for (var i = 0; i < stepProperties.noOfElements; i++) {
            var stepElements = stepProperties.elements[i];

            stepElements.element.style[Modernizr.prefixed("transition")] = "";
          }
        }, stepDurations["total"]);
      },

      /**
       * Go forward to the next step
       *
       * @param {Number} id - The ID of the next step
       * @param {String} nextStep - The name of the next step
       * @param {HTMLElement} nextStepElement - The element that is the next step
       * @param {String} currentStep - The name of the current step
       * @param {HTMLElement} currentStepElement - The element that is the current step
       * @param {Object} stepDurations - How long a step will animate for,
       *                                 including animation, delay, and total
       * @param {Boolean} hashTagNav - If navigation is triggered by the hashTag
       */
      forward: function(id, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, hashTagNav) {

        var _animation = this;

        // Snap the step to the "animate-start" phase
        removeClass(nextStepElement, "animate-out");

        _animation.domDelay(function() {
          // Make the current step transition to "animate-out"
          addClass(currentStepElement, "animate-out");
          removeClass(currentStepElement, "animate-in");

          // Make the next step transition to "animate-in"
          _animation.startAnimateIn(id, 1, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, hashTagNav);
        });
      },

      /**
       * Go in reverse to the next step
       *
       * @param {Number} id - The ID of the next step
       * @param {String} nextStep - The name of the next step
       * @param {HTMLElement} nextStepElement - The element that is the next step
       * @param {String} currentStep - The name of the current step
       * @param {HTMLElement} currentStepElement - The element that is the current step
       * @param {Object} stepDurations - How long a step will animate for,
       *                                 including animation, delay, and total
       * @param {Boolean} hashTagNav - If navigation is triggered by the hashTag
       */
      reverse: function(id, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, hashTagNav) {

        var _animation = this;

        // Snap the step to the "animate-out" phase
        addClass(nextStepElement, "animate-out");

        _animation.domDelay(function() {

          // Reverse properties for both the current and next steps
          _animation.reverseProperties(currentStep, "animate-out", stepDurations["current-phase"]);
          _animation.reverseProperties(nextStep, "animate-in", stepDurations["next-phase"]);

          // Make the current step transition to "animate-start"
          removeClass(currentStepElement, "animate-in");

          // Make the next step transition to "animate-in"
          _animation.startAnimateIn(id, -1, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, hashTagNav);
        });
      },

      /**
       * Start the next step's "animate-in" phase
       *
       * @param {Number} id - The ID of the next step
       * @param {Number} direction - The direction of navigation
       * @param {String} nextStep - The name of the next step
       * @param {HTMLElement} nextStepElement - The element that is the next step
       * @param {String} currentStep - The name of the current step
       * @param {HTMLElement} currentStepElement - The element that is the current step
       * @param {Object} stepDurations - How long a step will animate for,
       *                                 including animation, delay, and total
       * @param {Boolean} hashTagNav - If navigation is triggered by the hashTag
       */
      startAnimateIn: function(id, direction, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, hashTagNav) {

        var _animation = this;

        var currentPhaseDuration = 0,
            nextPhaseDuration = 0,
            nextPhaseThreshold = 0,
            stepDurationTotal = 0;

        // The next ID is now the current ID
        self.prevStepId = self.currentStepId;
        self.currentStepId = id;

        // Callback
        self.animationStarted(id, self);
        _animation._currentPhaseStarted();

        // When should the "animate-in" phase start and how long until the step
        // completely finishes animating?
        if (self._firstRun === false) {
          currentPhaseDuration = stepDurations["current-phase"]["total"];
          nextPhaseDuration = stepDurations["next-phase"]["total"];
          nextPhaseThreshold = stepDurations["next-phase-threshold"];
          stepDurationTotal = stepDurations["step-total"];

          // Start the "animate-in" phase
          self.phaseThresholdTimer = setTimeout(function() {

            _animation._nextPhaseStarted(hashTagNav);
            addClass(nextStepElement, "animate-in");
            removeClass(nextStepElement, "animate-out");
          }, nextPhaseThreshold);
        }

        // This is the first run
        else {

          // Snap the first step into place without animation
          if (self.options.startingStepAnimatesIn === false) {

            // Set the first step's speed to 0 to have it immediately snap into place
            _animation.resetInheritedSpeed(nextStep, "animate-in");
          }

          // Animate the first step into place
          else {

            // The step duration total is the same as the next phase's total animation
            nextPhaseDuration = stepDurations["next-phase"]["total"];
            stepDurationTotal = nextPhaseDuration;
          }

          // We're now done with the first run
          // Add the "animate-in" class to the next step
          _animation._nextPhaseStarted(hashTagNav);
          self._firstRun = false;
          addClass(nextStepElement, "animate-in");
          removeClass(nextStepElement, "animate-out");
        }

        // Wait for the current and next phases to end
        _animation.phaseEnded(currentPhaseDuration, currentStep, _animation._currentPhaseEnded);
        _animation.phaseEnded(nextPhaseDuration, nextStep, _animation._nextPhaseEnded);

        // Wait for the step (both phases) to finish animating
        _animation.stepEnded(id, stepDurationTotal);
      },

      /**
       * When the current phase starts animating
       */
      _currentPhaseStarted: function() {

        // Callback
        self.currentPhaseStarted(self);

        self._pagination.update();
      },

      /**
       * When the current phase finishes animating
       */
      _currentPhaseEnded: function() {

        // Callback
        self.currentPhaseEnded(self);
      },

      /**
       * When the next phase starts animating
       *
       * @param {Boolean} hashTagNav - If navigation is triggered by the hashTag
       */
      _nextPhaseStarted: function(hashTagNav) {

        // Update the hashTag if being used
        if (hashTagNav === undefined) {
          self._hashTags.update();
        }

        // Callback
        self.nextPhaseStarted(self);
      },

      /**
       * When the next phase finishes animating
       */
      _nextPhaseEnded: function() {

        // Callback
        self.nextPhaseEnded(self);
      },

      /**
       * When a phase's animations have completely finished
       *
       * @param {Number} stepDurationTotal - The amount of time before the step finishes animating
       * @param {String} step - The name of the step that ended
       * @param {Function} callback - A function to execute when the phase ends
       */
      phaseEnded: function(stepDurationTotal, step, callback) {

        setTimeout(function() {

          self.animationMap[step]["isAnimating"] = false;
          self.animationMap["stepsAnimating"] -= 1;

          // Callback
          callback();
        }, stepDurationTotal);
      },

      /**
       * When a step's animations have completely finished
       *
       * @param {Number} id - The ID of the step that ended
       * @param {Number} stepDurationTotal - The amount of time before the step finishes animating
       */
      stepEnded: function(id, stepDurationTotal) {

        setTimeout(function() {
          self._autoPlay.init();

          self.isActive = false;

          // Callback
          self.animationFinished(id, self);
        }, stepDurationTotal);
      },

      /**
       * Determine how long a step's phases will animate for
       *
       * Note: the first time sequence.goTo() is run, the step duration
       * will always be the longest computed duration from the "animate-in"
       * phase, as the "animate-out" phase is immediately snapped into place.
       *
       * @param {Number} nextStepId - The ID of the next step
       * @param {String} nextStep - The step that will be animated-in
       * @param {String} currentStep - The step that will be animated-out
       * @param {Number} direction - The direction of navigation
       * @return {Number} stepDuration - The time the step will take to animate
       */
      getStepDurations: function(nextStepId, nextStep, currentStep, direction) {

        if (self.transitionsSupported === false) {
          return;
        }

        var durations = {};
        durations["current-phase"] = {};
        durations["next-phase"] = {};

        // How long the phase will animate (not including delays)
        // How long the phase will be delayed
        // The total duration of the phase (animation + delay)
        durations["current-phase"]["animation"] = 0;
        durations["current-phase"]["delay"] = 0;
        durations["current-phase"]["total"] = 0;
        durations["next-phase"]["animation"] = 0;
        durations["next-phase"]["delay"] = 0;
        durations["next-phase"]["total"] = 0;

        // The time the next phase should wait before being set to "animate-in"
        // The total time it'll take for both phases to finish
        durations["next-phase-threshold"] = 0;
        durations["step-total"] = 0;

        var nextPhaseDuration = 0;
        var currentPhaseDuration = 0;

        // Where we'll save the delays
        var nextDelay = 0;
        var currentDelay = 0;

        var phaseThreshold = self.options.phaseThreshold;

        // Navigating forwards
        if (direction === 1) {
          currentPhaseDuration = self.animationMap[currentStep]["animate-out"].computedDuration;
          nextPhaseDuration = self.animationMap[nextStep]["animate-in"].computedDuration;
        }

        // Navigating in reverse
        else {

          /**
           * Does a phase require a delay to make it perfectly reverse in
           * synchronisation with the other phase?
           *
           * Example: When navigating forward, if the current phase in step 1
           * animates out over 3 seconds, and the next phase in step 2 animates
           * in over 1 second, when reversed, step 2 animating back to its start
           * position should be given a 2 (3 - 1) second delay to create a perfect
           * reversal of animation.
           *
           */
          if (phaseThreshold !== true) {

            // Add the delay to whichever element animates for the shortest period

            var reverseThreshold = self.animationMap[currentStep]["animate-in"].maxDuration - self.animationMap[nextStep]["animate-out"].maxDuration;
            if (reverseThreshold > 0) {
              nextDelay = reverseThreshold;
            }else {
              currentDelay = Math.abs(reverseThreshold);
            }
          }

          currentPhaseDuration = self.animationMap[currentStep]["animate-in"].maxDuration;
          nextPhaseDuration = self.animationMap[nextStep]["animate-out"].maxDuration;

          // Reverse CSS defined delays
          nextDelay += self.animationMap[currentStep]["animate-in"].maxDelay;
          currentDelay += self.animationMap[nextStep]["animate-out"].maxDelay;
        }

        var currentPhaseDurationTotal = currentPhaseDuration + currentDelay;
        var nextPhaseDurationTotal = nextPhaseDuration + nextDelay;

        durations["current-phase"]["animation"] = currentPhaseDuration;
        durations["current-phase"]["delay"] = currentDelay;
        durations["current-phase"]["total"] = currentPhaseDurationTotal;
        durations["next-phase"]["animation"] = nextPhaseDuration;
        durations["next-phase"]["delay"] = nextDelay;

        // When should "animate-in" start and how long does a step last for?
        switch(phaseThreshold) {

          case false:
            // The next phase should be set to "animate-in" immediately
            // The step ends whenever the longest phase has finished
            durations["next-phase"]["total"] = nextPhaseDurationTotal;
            if (currentPhaseDurationTotal > nextPhaseDurationTotal) {
              durations["step-total"] = currentPhaseDurationTotal;
            }else {
              durations["step-total"] = nextPhaseDurationTotal;
            }
          break;

          case true:
            // The next phase should start only once the current phase has finished
            // The step ends once both phases have finished
            durations["next-phase-threshold"] = currentPhaseDurationTotal;
            durations["next-phase"]["total"] = currentPhaseDurationTotal + nextPhaseDurationTotal;
            durations["step-total"] = currentPhaseDurationTotal + nextPhaseDurationTotal;
          break;

          default:
            // The next phase should be set to "animate-in" after a specific time
            // The step ends whenever the longest phase has finished (including
            // the phaseThreshold time)
            durations["next-phase-threshold"] = phaseThreshold;
            var nextPhaseDurationIncThreshold = nextPhaseDurationTotal + phaseThreshold;
            durations["next-phase"]["total"] = nextPhaseDurationIncThreshold;

            if (currentPhaseDurationTotal > nextPhaseDurationIncThreshold) {
              durations["step-total"] = currentPhaseDurationTotal;
            }else {
              durations["step-total"] = nextPhaseDurationIncThreshold;
            }
        }

        return durations;
      },

      /**
       * Change "animate-out" to "animate-in" and vice-versa.
       *
       * @param {String} phase - The phase to reverse
       * @return {String} - The reversed phase
       */
      reversePhase: function(phase) {

        var reversePhase = {
            "animate-out": "animate-in",
            "animate-in": "animate-out"
        }

        return reversePhase[phase];
      },

      /**
       * Apply a short delay to a function that manipulates the DOM. Allows for
       * sequential DOM manipulations.
       *
       * Why is this needed?
       *
       * When sequentially manipulating a DOM element (ie, removing a class then
       * immediately applying another on the same element), the first manipulation
       * appears not to apply. This function puts a small gap between sequential
       * manipulations to give the browser a chance visually apply each manipulation.
       *
       * Some browsers can apply a succession of classes quicker than
       * this but 50ms is enough to capture even the slowest of browsers.
       *
       * @param {Function} callback - a function to run after the delay
       */
      domDelay: function(callback) {

        setTimeout(function() {
          callback();
        }, domThreshold);
      },

      /**
       * Reverse a CSS timing function
       *
       * @param {String} timingFunction - The timing function to reverse
       * @return {String} timingFunction - The reverse timing function
       */
      reverseTimingFunction: function(timingFunction) {

        // Convert timingFunction keywords to a cubic-bezier function
        // This is needed because some browsers return a keyword, others a function
        var timingFunctionToCubicBezier = {
          "linear"     : "cubic-bezier(0.0,0.0,1.0,1.0)",
          "ease"       : "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
          "ease-in"    : "cubic-bezier(0.42, 0.0, 1.0, 1.0)",
          "ease-in-out": "cubic-bezier(0.42, 0.0, 0.58, 1.0)",
          "ease-out"   : "cubic-bezier(0.0, 0.0, 0.58, 1.0)"
        };

        // Convert the timing function to a cubic-bezier if it is a keyword
        if (timingFunction.indexOf("cubic-bezier") < 0) {
          timingFunction = timingFunctionToCubicBezier[timingFunction];
        }

        // Remove the CSS function and just get the array of points
        var cubicBezier = timingFunction.replace('cubic-bezier(', '').replace(')', '').split(',');
        var cubicBezierLength = cubicBezier.length;

        // Convert each point into a number (rather than a string)
        for (var i = 0; i < cubicBezierLength; i++) {
          cubicBezier[i] = parseFloat(cubicBezier[i]);
        }

        // Reverse the cubic bezier
        var reversedCubicBezier = [
          1 - cubicBezier[2],
          1 - cubicBezier[3],
          1 - cubicBezier[0],
          1 - cubicBezier[1]
        ];

        // Add the reversed cubic bezier back into a CSS function
        timingFunction = 'cubic-bezier('+reversedCubicBezier+')';

        return timingFunction;
      },

      /**
       * Get the duration, delay, computedDuration, elements and number of
       * elements for a step. This function just tidies up the
       * variable names for easier readability.
       *
       * @param {String} step - The step that the elements we'll override belong to
       * @param {String} phase - The next phase "animate-in" or "animate-out"
       * @return {Object} stepProperties - The step properties
       */
      getStepProperties: function(step, phase) {

        var stepProperties = {};

        stepProperties.duration = self.animationMap[step][phase].maxDuration;
        stepProperties.delay = self.animationMap[step][phase].maxDelay;
        stepProperties.computedDuration = self.animationMap[step][phase].computedDuration;
        stepProperties.elements = self.animationMap[step][phase].elements;
        stepProperties.noOfElements = self.animationMap[step][phase].noOfElements;

        return stepProperties;
      },

      /**
       * Apply a transition-duration and transition-delay to each element
       * then remove these temporary values once the phase is reset.
       *
       * Can be used to apply 0 to both duration and delay so animates reset
       * back into their original places for example.
       *
       * @param {String} step - The step that the elements we'll reset belong to
       * @param {String} phase - The next phase "animate-in" or "animate-out"
       */
      resetInheritedSpeed: function(step, phase) {

        if (self.transitionsSupported === false) {
          return;
        }

        var _animation = this;

        // Get the step's elements and count them
        var stepElements = self.animationMap[step][phase].elements;
        var numberOfStepElements = self.animationMap[step][phase].noOfElements;

        // Temporarily apply a transition-duration and transition-delay to each
        // element.
        for (var i = 0; i < numberOfStepElements; i++) {
          var stepProperties = stepElements[i];

          // Apply the transition-duration and transition-delay
          stepProperties.element.style[Modernizr.prefixed("transition")] = "0ms 0ms";
        }

        /**
         * Note: Synchronously, an element's phase class is added/removed here.
         * To save the need for a callback though (and extra code), we instead rely
         * on the necessity for the .domDelay() function which doesn't remove the
         * inheritedStyles until after a brief delay. What would be the callback
         * is instead just placed after the call to .resetInheritedSpeed() and
         * from a synchronous point of view, occurs at this point, before the
         * following .domDelay();
         */

        // Remove the temporary transition-duration and transition-delay from each
        // element now it has been manipulated; allowing for the inherited styles
        // to take effect again.
        setTimeout(function() {
          for (var i = 0; i < numberOfStepElements; i++) {
            var stepProperties = stepElements[i];

            stepProperties.element.style[Modernizr.prefixed("transition")] = "";
          }
        }, domThreshold);
      },

      /**
       * When the sequence.goTo() function is specified without a direction, and
       * the cycle option is being used, get the shortest direction to the next step
       *
       * @param {Number} nextId - The Id of the step to go to
       * @param {Number} currentId - The Id of the current step
       * @param {Number} noOfSteps - The number of steps
       * @return {Number} direction - The shortest direction between the current slide and the next
       */
      getShortestDirection: function(nextId, currentId, noOfSteps) {

        var forwardDirection;
        var reverseDirection;
        var direction;

        if (nextId > currentId) {
          forwardDirection = nextId - currentId;
          reverseDirection = currentId + (noOfSteps - nextId);
        }else {
          reverseDirection = currentId - nextId;
          forwardDirection = nextId + (noOfSteps - currentId);
        }

        direction = (forwardDirection <= reverseDirection) ? 1: -1;

        return direction;
      },

      /**
       * Get the direction to navigate in based on whether the .goTo() function
       * has a defined direction, and if not, what options are being used.
       *
       * @param {Number} id - The id of the step to go to
       * @param {Number} direction - The defined direction 1 or -1
       * @return {Number} direction - The direction 1 or -1
       */
      getDirection: function(id, direction) {

        var _animation = this;

        // If the developer has defined a direction, then use that
        if (direction !== undefined) {
          return direction;
        }

        // If a direction wasn't defined, work out the best one to use
        if (self.options.reverseWhenNavigatingBackwards === true || self.transitionsSupported === false) {

          if (direction === undefined && self.options.cycle === true) {
            direction = _animation.getShortestDirection(id, self.currentStepId, self.noOfSteps);
          }else if (direction === undefined) {
            direction = (id < self.currentStepId) ? -1: 1;
          }
        }

        else {

          direction = 1;
        }

        return direction;
      },

      /**
       * Determine what properties the browser supports. Currently tests
       * transitions and animations
       */
      propertySupport: function() {

        self.transitionsSupported = false;
        self.animationsSupported = false;

        // Are transitions supported?
        if (Modernizr.csstransitions === true) {
          self.transitionsSupported = true;
        }

        // Are animations supported?
        if (Modernizr.cssanimations === true) {
          self.animationsSupported = true;
        }
      },
    }

    /**
     * Controls Sequence's animations when in a browser that doesn't support
     * CSS transitions
     *
     * @api private
     */
    self._animationFallback = {

      /**
       * Animate an element using JavaScript
       *
       * @param {HTMLElement} element - The element to animate
       * @param {String} style - The style to be animated
       * @param {String} unit - The value unit such as "px", "%" etc
       * @param {Number} from - The start value of the animation
       * @param {Number} to - The end value of the animation
       * @param {Number} time - how long to animate for
       * @param {Function} callback - A function to execute once the animation has finished
       */
      animate: function(element, style, unit, from, to, time, callback) {

        if (element === false) {
          return;
        }

        var start = new Date().getTime();

        var timer = setInterval(function() {

          var step = Math.min(1, (new Date().getTime()-start) / time);

          element.style[style] = (from + step * (to - from)) + unit;

          if (step === 1) {

            if (callback !== undefined) {
              callback();
            }

            clearInterval(timer);
          }
        },25);

        element.style[style] = from + unit;
      },

      /**
       * Setup the canvas ready for the fallback animation
       *
       * @param {Number} id - The first Id that Sequence will go to
       */
      setupCanvas: function(id) {

        if (self.transitionsSupported === false) {

          // Add the "sequence-fallback" class to the Sequence element
          addClass(self.container, "sequence-fallback");

          // Prevent steps from appearing outside of the Sequence element
          self.container.style.overflow = "hidden";
          self.container.style.whiteSpace = "nowrap";

          // Get the width of the canvas
          this.canvasWidth = self.canvas.offsetWidth;

          // Make the canvas 100% width/height
          self.canvas.style.position = "relative";
          self.canvas.style.width = "100%";
          self.canvas.style.height = "100%";

          // Make each step 100% width/height
          for (var i = 0; i < self.noOfSteps; i++) {

            // Get the step and its ID (one-based)
            var step = self.steps[i];
            var stepId = i + 1;

            /**
             * Move each step to its "animate-in" position
             *
             * Note: in fallback mode, steps will always remain in their
             * "animate-in" position and the canvas will be animated
             */
            addClass(step, "animate-in");

            // Make the step 100% width/height
            step.style.width = "100%";
            step.style.height = "100%";

            // Should we use the basic layout or let the developer use a
            // custom one?
            var layoutOption = self.options.fallback.layout;

            if (
              (layoutOption === "auto" && self.options.animateCanvas === false)
              || layoutOption === "basic"
            ) {

              step.style.display = "inline-block";
              step.style.position = "relative";
            }
          }
        }
      },

      /**
       * Move the canvas using basic animation
       *
       * @param {HTMLElement} currentStepElement - The element that is the current step
       * @param {HTMLElement} nextStepElement - The element that is the next step
       * @param {Boolean} animate - Show the canvas animate or snap?
       */
      moveCanvas: function(currentStepElement, nextStepElement, animate) {

        // Get the canvas element and step element to animate to
        var canvas = self.canvas;

        // Get the X, Y positions of the current and next step
        var currentStepX = currentStepElement.offsetLeft;
        var currentStepY = currentStepElement.offsetTop;
        var nextStepX = nextStepElement.offsetLeft;
        var nextStepY = nextStepElement.offsetTop;

        // Animate the canvas
        if (animate === true) {

          // Animate to the X, Y positions of the next step
          this.animate(canvas, "left", "px", -currentStepX, -nextStepX, self.options.fallback.speed);
          this.animate(canvas, "top", "px", -currentStepY, -nextStepY, self.options.fallback.speed);
        }

        // Snap the canvas into place
        else {

          canvas.style.left = -nextStepX + "px";
          canvas.style.top = -nextStepY + "px";
        }
      },

      /**
       * Go to a step using basic animation
       *
       * @param {Number} id - The ID of the step to go to
       * @param {String} currentStep - The name of the current step
       * @param {HTMLElement} currentStepElement - The element that is the current step
       * @param {String} nextStep - The name of the next step
       * @param {HTMLElement} nextStepElement - The element that is the next step
       * @param {Number} direction - The direction of navigation
       * @param {Boolean} hashTagNav - If navigation is triggered by the hashTag
       */
      goTo: function(id, currentStep, currentStepElement, nextStep, nextStepElement, direction, hashTagNav) {

        var from;

        // The next ID is now the current ID
        self.prevStepId = self.currentStepId;
        self.currentStepId = id;

        // Update the hashTag if being used
        if (hashTagNav === undefined) {
          self._hashTags.update();
        }

        // When should the "animate-in" phase start and how long until the step
        // completely finishes animating?
        if (self._firstRun === false) {

          this._canvas.move(currentStepElement, nextStepElement, true);

          // Callback
          self.animationStarted(self.currentStepId, self);
        }

        // This is the first step we're going to
        else {

          this._canvas.move(currentStepElement, nextStepElement);
          self._firstRun = false;
        }

        // Wait for the step (both phases) to finish animating
        self._animation.stepEnded(id, self.options.fallback.speed);
      }
    }

    /**
     * Manage pagination
     *
     * @api private
     */
    self._pagination = {

      /**
       * Get the links from each pagination element (any top level elements)
       *
       * @param {HTMLElement} element - The pagination element
       * @param {String} rel - Which Sequence element the pagination relates to (if any)
       * @param {Number} i - The number of the pagination element
       */
      getLinks: function(element, rel, i) {

        var childElement,
            childElements,
            childElementsLength,
            paginationLinks = [],
            j;

        // Get the pagination's link elements and count them
        childElements = element.childNodes;
        childElementsLength = childElements.length;

        // Get each top level pagination link and add it to the array
        for (j = 0; j < childElementsLength; j++) {

          childElement = childElements[j];

          if (childElement.nodeType === 1) {
            paginationLinks.push(childElement);
          }
        }

        // Save the pagination element and its links
        self.paginationLinks.push(paginationLinks);
      },

      /**
       * Update the pagination to activate the relevant link
       */
      update: function() {

        // Count how many pagination elements there are
        var paginationLength = self.pagination.length;

        if (paginationLength > 0) {

          var i,
              j,
              id = self.currentStepId - 1,
              currentPaginationLink,
              currentPaginationLinksLength;

          // Remove the "sequence-current" class from a previous pagination link
          // if there is one
          if (self.currentPaginationLinks !== undefined) {

            currentPaginationLinksLength = self.currentPaginationLinks.length;

            for (var i = 0; i < currentPaginationLinksLength; i++) {

              currentPaginationLink = self.currentPaginationLinks[i];
              removeClass(currentPaginationLink, "sequence-current");
            }
          }

          // Where we'll save the current pagination links
          self.currentPaginationLinks = [];

          // Get the current pagination link from each pagination element,
          // add the "sequence-current" class to them, then save them for later
          // for when they need to have the "sequence-current" class removed
          for (j = 0; j < paginationLength; j++) {

            currentPaginationLink = self.paginationLinks[j][id];
            self.currentPaginationLinks.push(currentPaginationLink);

            addClass(currentPaginationLink, "sequence-current");
          }
        }
      }
    }

    /**
     * Manage Sequence hashTag support
     *
     * @api private
     */
    self._hashTags = {

      /**
       * Set up hashTags
       *
       * @param {Number} id - The id of the first step
       * @return {Number} id - The id of the first step (_hashTags.init() will
       * override this if an entering URL contains a hashTag that corresponds
       * to a step)
       */
      init: function(id) {

        if (self.options.hashTags === true) {

          var correspondingStepId,
              newHashTag;

          // Does the browser support pushstate?
          self.hasPushstate = !!(window.history && history.pushState);

          // Get the current hashTag
          newHashTag = location.hash.replace("#!", "");

          // Get each step's hashTag
          self.stepHashTags = this.getStepHashTags();

          // If there is a hashTag but no value, don't go any further
          if (newHashTag === "") {
            return id;
          }

          // Get the current hashTag's step ID's
          self.currentHashTag = newHashTag;
          correspondingStepId = this.hasCorrespondingStep();

          // If the entering URL contains a hashTag, and the hashTag relates to
          // a corresponding step, the step's ID will override the startStepId
          // defined in options
          if (correspondingStepId > -1) {
            id = correspondingStepId + 1;
          }
        }

        // Return either the startingStepId as defined in settings or if the
        // entering URL contained a hashTag that corresponds to a step, return
        // its ID instead
        return id;
      },

      /**
       * Does a hashTag have a corresponding step?
       *
       * @return {Number} correspondingStep - The step ID relating to the hashTag
       */
      hasCorrespondingStep: function() {

        var correspondingStep = -1;
        var correspondingStepId = self.stepHashTags.indexOf(self.currentHashTag);

        if (correspondingStepId > -1) {
          correspondingStep = correspondingStepId;
        }

        return correspondingStep;
      },

      /**
       * Get each steps hashTag to return an array of hashTags
       *
       * @return {Array} stepHashTags - An array of hashTags
       */
      getStepHashTags: function() {

        var elementHashTag,
            stepHashTags = [];

        // Get each steps hashtag
        for (var i = 0; i < self.noOfSteps; i++) {

          elementHashTag = (self.options.hashDataAttribute === false) ? self.steps[i].id: self.steps[i].dataset.sequenceHashtag;

          // Add the hashtag to an array
          stepHashTags.push(elementHashTag);
        }

        return stepHashTags;
      },

      /**
       * Update the hashTag if:
       *
       * - hashTags are being used and this isn't the first run
       * - hashTags are being used, this is the first run, and the first hash change is allowed in the options
       * - the current step has a hashTag
       */
      update: function() {

        if (
          self.options.hashTags === true
          && self._firstRun === false
          || (self.options.hashTags === true && self._firstRun === true && self.options.hashChangesOnFirstStep === true)) {

            // Zero-base the currentStepId
            var hashTagId = self.currentStepId - 1;

            // Get the current hashTag
            self.currentHashTag = self.stepHashTags[hashTagId];

            if(self.currentHashtag !== "") {

              // Add the hashTag to the URL
              if (self.hasPushstate === true) {
                history.pushState(null, null, "#!" + self.currentHashTag);
              }
              else {
                location.hash = "#!" + self.currentHashTag;
              }
            }


        }
      },

      /**
       * Cross Browser helper for an hashchange event
       * Source: http://stackoverflow.com/questions/9339865/get-the-hashchange-event-to-work-in-all-browsers-including-ie7/
       */
      setupEvent: function() {

        if ('onhashchange' in window) {

          if (window.addEventListener) {

            window.addHashChange = function(func, before) {
              window.addEventListener('hashchange', func, before);
            };

            window.removeHashChange = function(func) {
              window.removeEventListener('hashchange', func);
            };
          }else if (window.attachEvent) {

            window.addHashChange = function(func) {
              window.attachEvent('onhashchange', func);
            };

            window.removeHashChange = function(func) {
              window.detachEvent('onhashchange', func);
            };
          }
        }else {

          var hashChangeFuncs = [];
          var oldHref = location.href;

          window.addHashChange = function(func, before) {

            if (typeof func === 'function') {
              hashChangeFuncs[before?'unshift':'push'](func);
            }
          };

          window.removeHashChange = function(func) {

            for (var i=hashChangeFuncs.length-1; i>=0; i--) {
              if (hashChangeFuncs[i] === func) {
                hashChangeFuncs.splice(i, 1);
              }
            }
          };

          setInterval(function() {
            var newHref = location.href;

            if (oldHref !== newHref) {
              var _oldHref = oldHref;
              oldHref = newHref;
              for (var i=0; i < hashChangeFuncs.length; i++) {
                hashChangeFuncs[i].call(window, {
                  'type': 'hashchange',
                  'newURL': newHref,
                  'oldURL': _oldHref
                });
              }
            }
          }, 100);
        }
      }
    }

    /**
     * Manage Sequence preloading
     *
     * @api private
     */
    self._preload = {

      /**
       * Setup Sequence preloading
       *
       * @param {Function} callback - Function to execute when preloading has finished
       */
      init: function(callback) {

        var _preload = this;

        if (self.options.preloader !== false) {

          // Add a class of "sequence-preloading" to the Sequence element
          addClass(self.container, "sequence-preloading");

          // Get the preloader
          self.preloader = self._ui.getElements("preloader", self.options.preloader);

          // Add the preloader element if necessary
          _preload.append();

          // Add the preloader's default styles
          _preload.addStyles();

          // Hide steps if necessary
          _preload.hideAndShowSteps("hide");

          // Get images from particular Sequence steps to be preloaded
          // Get images with specific source values to be preloaded
          var stepImagesToPreload = this.saveImagesToArray(self.options.preloadTheseSteps);
          var individualImagesToPreload = this.saveImagesToArray(self.options.preloadTheseImages, true);

          // Combine step images and individual images
          var imagesToPreload = stepImagesToPreload.concat(individualImagesToPreload);

          // Initiate the imagesLoaded plugin
          var imgLoad = imagesLoaded(imagesToPreload);

          // When imagesLoaded() has finished (regardless of whether images
          // completed or failed to load)
          imgLoad.on("always", function(instance) {
            _preload.complete(callback);
          });

          // Track the number of images that have loaded so far
          var progress = 1;

          imgLoad.on("progress", function( instance, image ) {

            // Has the image loaded or is it broken?
            var result = image.isLoaded ? 'loaded' : 'broken';

            // Callback
            self.preloadProgress(result, image.img.src, progress++, imagesToPreload.length, self);
          });
        }
      },

      /**
       * When preloading has finished, show the steps again and hide the preloader
       *
       * @param {Function} callback - Function to execute when preloading has finished
       */
      complete: function(callback) {

        // Callback
        self.preloaded(self);

        // Show steps if necessary
        this.hideAndShowSteps("show");

        // Remove the "preloading" class and add the "preloaded" class
        removeClass(self.container, "sequence-preloading");
        addClass(self.container, "sequence-preloaded");

        // Hide the preloader
        this.hide();

        callback();
      },

      /**
       * Sequence's default preloader styles and animation for the preloader icon
       */
     defaultStyles: '.sequence-preloader {position: absolute;z-index: 9999;height: 100%;width: 100%;}.sequence-preloader .preload .circle {position: relative;top: -50%;display: inline-block;height: 12px;width: 12px;fill: #ff9442;}.preload {position: relative;top: 50%;display: block;height: 12px;width: 48px;margin: -6px auto 0 auto;}.preload-complete {opacity: 0;visibility: hidden;'+Modernizr.prefixed("transition")+': .5s;}.preload.fallback .circle {float: left;margin-right: 4px;background-color: #ff9442;border-radius: 6px;}',

      /**
       * Add the preloader's styles to the <head></head>
       */
      addStyles: function() {

        if (self.options.preloader === true) {

          // Get the <head> and create the <style> element
          var head = document.head || document.getElementsByTagName('head')[0];
          this.styleElement = document.createElement('style');

          // Add the default styles to the <style> element
          this.styleElement.type = 'text/css';
          if (this.styleElement.styleSheet) {
            this.styleElement.styleSheet.cssText = this.defaultStyles;
          }else {
            this.styleElement.appendChild(document.createTextNode(this.defaultStyles));
          }

          // Add the <style> element to the <head>
          head.appendChild(this.styleElement);

          // Animate the preloader using JavaScript if the browser doesn't support SVG
          if (Modernizr.svg === false) {

            // Get the preload indicator
            var preloadIndicator = self.preloader.firstChild;

            // Make the preload indicator fade in and out
            this.preloadIndicatorTimer = setInterval(function() {
              self._ui.hide(preloadIndicator, 500, function() {
                self._ui.show(preloadIndicator, 500);
              });
            }, 1000);
          }
        }
      },

      /**
       * Remove the preloader's styles from the <head></head>
       */
      removeStyles: function() {

        this.styleElement.parentNode.removeChild(this.styleElement);
      },

      /**
       * Get <img> elements and return them to be preloaded. Elements can be got
       * either via the <img> element itself or a src attribute.
       *
       * @param {Number} images - The <img> elements or image src attributes to save
       * @param {Boolean} srcOnly - Is the element to be retrieved via the src?
       * @return {Array} imagesToPreload - The images to preload
       */
      saveImagesToArray: function(images, srcOnly) {

        // Where we'll save the images
        var imagesToPreload = [];

        // If there aren't any images, return an empty array
        if (isArray(images) === false) {
          return imagesToPreload;
        }

        // Count the number of images
        var imageLength = images.length;

        // Get each step's <img> elements and add them to imagesToPreload
        if (srcOnly !== true) {

          // Get each step
          for (var i = 0; i < imageLength; i++) {

            // Get the step and any images belonging to it
            var step = self.steps[i];
            var imagesInStep = step.getElementsByTagName("img");
            var imagesInStepLength = imagesInStep.length;

            // Get each image within the step
            for (var j = 0; j < imagesInStepLength; j++) {

              var image = imagesInStep[j];
              imagesToPreload.push(image);
            }
          }
        }

        // Get each step's <img> elements via the src and add them to imagesToPreload
        else {

          var img = [];

          for (var i = 0; i < imageLength; i++) {
            var src = images[i];

            img[i] = new Image();
            img[i].src = src;

            imagesToPreload.push(img[i]);
          }
        }

        return imagesToPreload;
      },

      /**
       * Hide the preloader using CSS transitions if supported, else use JavaScript
       */
      hide: function() {

        var _preload = this;

        if (self.transitionsSupported === true) {
          addClass(self.preloader, "preload-complete");
        }else {
          self._ui.hide(self.preloader, 500);
        }

        // Stop the preload inidcator fading in/out (for non-SVG browsers only)
        clearInterval(this.preloadIndicatorTimer);

        // Remove the preloader once it has been hidden
        setTimeout(function() {
          _preload.remove();
        }, 500);
      },

      /**
       * Append the default preloader
       */
      append: function() {

        if (self.options.preloader === true && self.preloader.length === 0) {

          // Set up the preloader container
          self.preloader = document.createElement("div");
          self.preloader.className = "sequence-preloader";

          self.preloader = [self.preloader];

          // Use the SVG preloader
          if (Modernizr.svg === true) {

            self.preloader[0].innerHTML = '<svg class="preload" xmlns="http://www.w3.org/2000/svg"><circle class="circle" cx="6" cy="6" r="6" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" /></circle><circle class="circle" cx="22" cy="6" r="6" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="150ms" repeatCount="indefinite" /></circle><circle class="circle" cx="38" cy="6" r="6" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="300ms" repeatCount="indefinite" /></circle></svg>';
          }

          // Use the Non-SVG preloader
          else {

            self.preloader[0].innerHTML = '<div class="preload fallback"><div class="circle"></div><div class="circle"></div><div class="circle"></div></div>';
          }

          // Add the preloader
          self.container.insertBefore(self.preloader[0], null);
        }
      },

      /**
       * Remove the preloader
       */
      remove: function() {

        self.preloader[0].parentNode.removeChild(self.preloader[0]);

        // If using the default preloader, remove its styles
        if (self.options.preloader === true) {
          this.removeStyles();
        }
      },

      /**
       * If enabled, hide/show Sequence steps until preloading has finished
       *
       * @param {String} type - "show" or "hide"
       */
      hideAndShowSteps: function(type) {

        if (self.options.hideStepsUntilPreloaded === true && self.preloader.length !== 0) {

          // Hide or show each step
          for (var i = 0; i < self.noOfSteps; i++) {
            var step = self.steps[i];

            if (type === "hide") {
              self._ui.hide(step, 0);
            }else {
              self._ui.show(step, 0);
            }

          }
        }
      }
    }

    /**
     * Add and remove Sequence events
     *
     * @api public
     */
    self.manageEvent = {

      // Keep track of the added events here
      list: {
        "load": [],
        "click": [],
        "mousemove": [],
        "mouseleave": [],
        "Hammer": [],
        "keydown": [],
        "hashchange": [],
        "resize": []
      },

      /**
       * Set up events on init
       */
      init: function() {

        this.add.hashChange();

        if (self.options.swipeNavigation === true) {
          this.add.swipeNavigation();
        }

        if (self.options.keyNavigation === true) {
          this.add.keyNavigation();
        }

        if (self.options.animateCanvas === true) {
          this.add.resizeThrottle();
        }

        // If being used, get the next button(s) and set up the events
        if (self.options.nextButton !== false) {
          self.nextButton = self._ui.getElements("nextButton", self.options.nextButton);
          this.add.button(self.nextButton, "nav", self.next);
        }

        // If being used, get the next button(s) and set up the events
        if (self.options.prevButton !== false) {
          self.prevButton = self._ui.getElements("prevButton", self.options.prevButton);
          this.add.button(self.prevButton, "nav", self.prev);
        }

        // If being used, get the pause button(s) and set up the events
        if (self.options.pauseButton !== false) {
          self.pauseButton = self._ui.getElements("pauseButton", self.options.pauseButton);
          this.add.button(self.pauseButton, "nav", self.togglePause);
        }

        // If being used, set up the pauseOnHover event
        this.add.pauseOnHover();

        // If being used, get the pagination element(s) and set up the events
        if (self.options.pagination !== false) {

          self.paginationLinks = [];

          self.pagination = self._ui.getElements("pagination", self.options.pagination);
          this.add.button(self.pagination, "pagination");
        }
      },

      /**
       * Remove an event from all of the elements it is attached to
       *
       * @param {String} type - The type of event to remove eg. "click"
       */
      remove: function(type) {

        // Get the elements using the event and count them
        var eventElements = self.manageEvent.list[type];
        var eventElementsLength = eventElements.length;

        switch(type) {

          case "hashchange":
            removeHashChange(eventElements[0].handler);
          break;

          case "Hammer":
            var handler = self.manageEvent.list.Hammer[0].handler;
            self.hammerTime.off("dragleft dragright release", handler);
          break;

          default:
            // Remove the event from each element
            for (var i = 0; i < eventElementsLength; i++) {
              var eventProperties = eventElements[i];
              removeEvent(eventProperties.element, type, eventProperties.handler);
            }
        }
      },

      add: {

        /**
         * Add the hashchange event
         */
        hashChange: function() {

          // Setup the cross-browser hashchange event
          self._hashTags.setupEvent();

          var handler = function(e) {

            var newHashTag,
                id;

            // Get the hashTag from the URL
            newHashTag = e.newURL || location.href;
            newHashTag = newHashTag.split("#!")[1];

            // Go to the new step if we're not already on it
            if (self.currentHashTag !== newHashTag) {

              // Get the ID of the new hash tag and one-base it
              id = self.stepHashTags.indexOf(newHashTag) + 1;

              self.currentHashTag = newHashTag;

              /**
               * Go to the new step
               *
               * Note: When the user is navigating through history via their
               * browser's back/forward buttons for example, we can't prevent
               * going to a step to meet the navigationSkipThreshold option. To
               * prevent the hashTag and the current step from becoming
               * unsynchronized we must ignore the navigationSkipThreshold
               * setting.
               */
              self.goTo(id, undefined, undefined, true);
            }
          }

          addHashChange(handler);

          self.manageEvent.list["hashchange"].push({"element": window, "handler": handler});
        },

        /**
         * Add next/prev/pause buttons
         *
         * @param {Array} elements - The element or elements acting as the next button
         * @param {String} type - The type of button being added - "nav" or "pagination"
         * @param {Function} callback - Function to execute when the button is clicked
         */
        button: function(elements, type, callback) {

          // Count the number of elements being added
          var elementLength = elements.length,
              handler,
              element,
              rel,
              id,
              i;

          // Set up a click event for navigation elements
          if (type === "nav") {

            var buttonEvent = function() {
              handler = addEvent(element, "click", function(e) {
                callback();
              });
            }
          }

          // Set up a click event for pagination
          else {

            var buttonEvent = function(element, rel, i) {
              handler = addEvent(element, "click", function(e, element) {

                // Get the ID of the clicked pagination link
                id = hasParent(this, e.target);

                // Go to the clicked pagination ID
                self.goTo(id);
              });

              // Get the pagination links
              self._pagination.getLinks(element, rel, i);
            }
          }

          // Add a click event for each element
          for (i = 0; i < elementLength; i++) {
            element = elements[i];

            // Does the button control a specific Sequence instance?
            rel = element.getAttribute("rel");

            // The button controls one Sequence instance
            // (defined via the rel attribute)
            if (rel === self.container.getAttribute("id") && element.dataset.sequence !== "true") {

              element.dataset.sequence = true;
              buttonEvent(element, rel, i);
            }

            // The button controls all Sequence instances
            else if (rel === null && element.dataset.sequence !== "true") {
              buttonEvent(element, rel, i);
            }

            // Save the element and its handler for later, should it need to
            // be removed
            self.manageEvent.list["click"].push({"element": element, "handler": handler});
          }
        },

        /**
         * Pause and unpause autoPlay when the user's cursor enters and leaves
         * the Sequence element accordingly.
         *
         * Note: autoPlay will be paused only when the cursor is inside the
         * boundaries of the Sequence element, either on the element itself or
         * its children. Child elements overflowing the Sequence element will
         * not cause Sequence to be paused.
         */
        pauseOnHover: function() {

          /**
           * Determine if the cursor is inside the boundaries of the Sequence
           * element.
           *
           * @param {Object} element - The Sequence element
           * @param {Object} cursor - The event holding cursor properties
           */
          var insideElement = function(element, cursor) {

            // Get the boundaries of the Sequence element
            var elementLeft = element.offsetLeft;
            var elementRight = elementLeft + element.clientWidth;
            var elementTop = element.offsetTop;
            var elementBottom = elementTop + element.clientHeight;

            // Return true if inside the boundaries of the Sequence element
            if (cursor.clientX >= elementLeft && cursor.clientX <= elementRight && cursor.clientY >= elementTop && cursor.clientY <= elementBottom) {
              return true;
            }else {
              return false;
            }
          }

          var previouslyInside = false,
              handler;

          /**
           * Pause autoPlay only when the cursor is inside the boundaries of the
           * Sequence element
           */
          handler = addEvent(self.container, "mousemove", function(e) {

            // Is the cursor inside the Sequence element?
            if (insideElement(this, e) === true) {

              // Pause if the cursor was previously outside the Sequence element
              if (previouslyInside === false && self.options.pauseOnHover === true) {
                self._autoPlay.pause();
              }

              // We're now inside the Sequence element
              previouslyInside = true;
            }

            else {

              // Unpause if the cursor was previously inside the Sequence element
              if (previouslyInside === true && self.isHardPaused === false && self.options.pauseOnHover === true) {
                self._autoPlay.unpause();
              }

              // We're now outside the Sequence element
              previouslyInside = false;
            }
          });

          self.manageEvent.list["mousemove"].push({"element": self.container, "handler": handler});

          /**
           * Unpause autoPlay when the cursor leaves the Sequence element
           */
          handler = addEvent(self.container, "mouseleave", function(e) {

            if (self.isHardPaused === false && self.options.pauseOnHover === true) {
              self._autoPlay.unpause();
            }

            // We're now outside the Sequence element
            previouslyInside = false;
          });

          self.manageEvent.list["mouseleave"].push({"element": self.container, "handler": handler});
        },

        /**
         * Navigate to a step when Sequence is swiped
         */
        swipeNavigation: function() {

          var handler = function(e) {

            switch(e.type) {

                // Prevent the browser scrolling will dragging left and right
              case "dragleft":
              case "dragright":
                e.gesture.preventDefault();
              break;

              // Execute a swipe event when the user releases their finger
              case "release":

                // Execute the swipe event if the user swipes more than the
                // drag_min_distance option
                if (
                     Math.abs(e.gesture.deltaX) >= self.hammerTime.options.drag_min_distance
                  || Math.abs(e.gesture.deltaY) >= self.hammerTime.options.drag_min_distance
                ){

                  switch(e.gesture.direction) {

                    case "left":
                      self.options.swipeEvents.left(self);
                    break;

                    case "right":
                      self.options.swipeEvents.right(self);
                    break;

                    case "up":
                      if (self.options.swipeEvents.up !== false) {
                        self.options.swipeEvents.up(self);
                      }
                    break;

                    case "down":
                      if (self.options.swipeEvents.down !== false) {
                        self.options.swipeEvents.down(self);
                      }
                    break;
                  }
                }

              break;
            }
          };

          self.hammerTime = Hammer(self.container, self.options.swipeHammerOptions).on("dragleft dragright release", handler);

          self.manageEvent.list["Hammer"].push({"element": self.container, "handler": handler});
        },

        /**
         * Navigate to a step when corresponding keys are pressed
         */
        keyNavigation: function() {

          var handler = addEvent(window, "keydown", function(e) {

            // Get the key pressed
            var keyCodeChar = parseInt(String.fromCharCode(e.keyCode));

            // Go to the numeric key pressed
            if ((keyCodeChar > 0 && keyCodeChar <= self.noOfSteps) && (self.options.numericKeysGoToSteps)) {
              self.goTo(keyCodeChar);
            }

            // When left/right arrow keys are pressed, go to prev/next steps
            switch(e.keyCode) {
              case 37:
                self.options.keyEvents["left"](self);
              break;

              case 39:
                self.options.keyEvents["right"](self);
              break;
            }
          });

          self.manageEvent.list["keydown"].push({"element": window, "handler": handler});
        },

        /**
         * Throttle the window resize event so it only occurs every x amount of
         * milliseconds, as defined by the resizeThreshold global variable.
         */
        resizeThrottle: function() {

          // Events to be executed when the throttled window resize occurs
          function throttledEvents() {

            var i,
                step,
                stepName;

            // Work out the transform properties for each step again
            for (i = 0; i < self.noOfSteps; i++) {

              // Get the step and stepName
              step = self.steps[i];
              stepName = "step" + (i + 1);

              // Get the transform properties from the data-attributes
              self._getAnimationMap.getTransformProperties(stepName, step);
            }

            /**
             * Snap to the currently active step
             *
             * Assume the canvas is laid out in a 2 x 2 grid, the Sequence
             * element has a height of 100%, and the user is viewing the second
             * row of steps -- when the user resizes the window, the second row
             * of steps will no longer be positioned perfectly in the window.
             * This event will immediately snap the canvas back into place.
             */
            self._canvas.move(self.currentStepId, false);

            // Callback
            self.throttledResize(self);
          }

          /**
           * Throttle the resize event to only execute throttledEvents() every
           * 100ms. This is so not too many events occur during a resize. The
           * threshold can be changed using the resizeThreshold global variable.
           */
          var throttleTimer,
              handler;

          handler = addEvent(window, "resize", function(e) {

            clearTimeout(throttleTimer);
            throttleTimer = setTimeout(throttledEvents, resizeThreshold);
          });

          self.manageEvent.list["resize"].push({"element": window, "handler": handler});
        }
      }
    }

    /**
     * Set up an instance of Sequence
     *
     * @param {Object} element - The element Sequence is attached to
     * @api private
     */
    self._init = function(element) {

      var id,
          prevStep,
          prevStepId,
          goToFirstStep;

      // Merge developer options with defaults
      self.options = extend(defaults, options);

      // Get the element Sequence is attached to, the screen,
      // the canvas and it's steps
      self.container = element;
      self.screen = getElementsByClassName(self.container, "sequence-screen")[0];
      self.canvas = getElementsByClassName(self.container, "sequence-canvas")[0];
      self.steps = getSteps(self.canvas);

      self.isHardPaused = false;

      // Get number of steps
      self.noOfSteps = self.steps.length;

      // Find out what properties the browser supports and add classes to Sequence
      self._animation.propertySupport();

      // Get Sequence's animation map (which elements will animate and their timings)
      self.animationMap = self._getAnimationMap.init(element);

      // Add transform-style: preserve-3d to the screen and canvas
      self.screen.style.height = "100%";
      self.screen.style.width = "100%";
      self.screen.style[Modernizr.prefixed("transformStyle")] = "preserve-3d";
      self.canvas.style[Modernizr.prefixed("transformStyle")] = "preserve-3d";

      // Remove the no-JS "animate-in" class from a step
      removeNoJsClass(self);

      // Set up events
      self.manageEvent.init();

      // Set up autoPlay
      self._autoPlay.init();

      // On the first run, we need to treat the animation a little differently
      self._firstRun = true;

      // Keep track of which elements are animating
      self.elementsAnimating = [];

      // Get the first step's ID
      id = self.options.startingStepId;

      // Set up hashTag support if being used and override the first ID if there
      // is a hashTag in the entering URL that has a corresponding step
      id = self._hashTags.init(id);

      // Get the previous step ID
      if (self.options.autoPlayDirection === 1) {
        prevStepId = id - 1;
        self.prevStepId = (prevStepId < 1) ? self.noOfSteps: prevStepId;
      }else {
        prevStepId = id + 1;
        self.prevStepId = (prevStepId > self.noOfSteps) ? 1: prevStepId;
      }

      // Get the previous step and next step
      self.currentStepId = self.prevStepId;
      prevStep = "step" + self.prevStepId;

      // If the browser doesn't support CSS transitions, setup the fallback
      self._animationFallback.setupCanvas(id);

      goToFirstStep = function() {

        // Callback
        if (self.options.autoPlay === true) {
          self.unpaused(self);
        }

        // Snap the previous step into position
        self._animation.domDelay(function() {
          self._animation.resetInheritedSpeed(prevStep, "animate-out");
        });

        // Go to the first step
        self.goTo(id, self.options.autoPlayDirection, true);
      }

      // Set up preloading if required, then go to the first step
      if (self.options.preloader !== false) {
        self._preload.init(function() {
          goToFirstStep();

          self._animation.domDelay(function() {
            self.ready(self);
          });
        });
      }else {
        goToFirstStep();

        self._animation.domDelay(function() {
          self.ready(self);
        });
      }
    }

    /**
     * Destroy an instance of Sequence
     *
     * @return {Boolean}
     * @api public
     */
    self.destroy = function() {

      var eventList,
          eventType,
          theEvents,
          i,
          step,
          lastStep;

      // Stop timers
      clearTimeout(self.autoPlayTimer);
      clearTimeout(self.phaseThresholdTimer);

      // Get all events
      eventList = self.manageEvent.list;

      // Remove each event
      for (eventType in eventList) {
        if (eventList.hasOwnProperty(eventType) === true) {

          theEvents = eventList[eventType];
          self.manageEvent.remove(eventType);
        }
      }

      // Remove classes:
      // - the "sequence-current" class from the active pagination links
      // - the "sequence-paused" class from the container
      // - the step index class from the container
      removeClass(self.currentPaginationLinks, "sequence-current");
      removeClass(self.container, "sequence-paused");
      removeClass(self.container, "step" + self.currentStepId);

      // Remove styles
      self.screen.removeAttribute("style");
      self.canvas.removeAttribute("style");

      // Remove styles from steps and snap them to their "animate-out" position
      for (i = 0; i < self.noOfSteps; i++) {
        step = self.steps[i];

        step.removeAttribute("style");
        self._animation.resetInheritedSpeed("step" + (i + 1), "animate-out");
        removeClass(step, "animate-in");
        removeClass(step, "animate-out");
      }

      // Snap the starting step back into its "animate-in" position
      lastStep = self.steps[self.options.startingStepId - 1];
      self._animation.resetInheritedSpeed("step" + self.options.startingStepId, "animate-in");
      addClass(lastStep, "animate-in");

      // Allow the same element to have Sequence initated on it in the future
      element.dataset.sequence = false;

      // Callback
      self.destroyed(self);

      // Finally, clear the instance's properties and methods
      self = {};
    }

    /**
     * Go to the next step
     *
     * @api public
     */
    self.next = function() {

      var nextStepId = self.currentStepId + 1;

      if (nextStepId > self.noOfSteps && self.options.cycle === true) {
        nextStepId = 1;
      }

      self.goTo(nextStepId);
    }

    /**
     * Go to the previous step
     *
     * @api public
     */
    self.prev = function() {

      var prevStepId = self.currentStepId - 1;

      if (prevStepId < 1 && self.options.cycle === true) {
        prevStepId = self.noOfSteps;
      }

      self.goTo(prevStepId);
    }

    /**
     * Stop and start Sequence's autoPlay feature
     *
     * @api public
     */
    self.togglePause = function() {

      if (self.isPaused === false) {
        self.pause();
      }else {
        self.unpause();
      }
    }

    /**
     * Stop Sequence's autoPlay feature
     *
     * isPaused = autoPlay is paused by Sequence and expects to be unpaused in
     * the future. For example: when the user hovers over the Sequence element.
     *
     * isHardPaused = autoPlay is paused by the user via a pause button or
     * public method. For example: whent the user presses a pause button.
     *
     * @api public
     */
    self.pause = function() {

      self.isHardPaused = true;
      self._autoPlay.pause();
    }

    /**
     * Start Sequence's autoPlay feature
     *
     * @api public
     */
    self.unpause = function() {

      self.isHardPaused = false;
      self._autoPlay.unpause();
    }

    /**
     * Go to a specific step
     *
     * @param {Number} id - The ID of the step to go to
     * @param {Number} direction - Direction to get to the step (1 = forward, -1 = reverse)
     * @param {Boolean} ignorePhaseThreshold - if true, ignore the transitionThreshold setting and immediately go to the specified step
     * @param {Boolean} hashTagNav - If navigation is triggered by the hashTag
     * @api public
     */
    self.goTo = function(id, direction, ignorePhaseThreshold, hashTagNav) {

      // Get the direction to navigate if one wasn't specified
      direction = self._animation.getDirection(id, direction);

      /**
       * Don't go to a step if:
       *
       * - ID isn't defined
       * - It doesn't exist
       * - It is already active
       * - navigationSkip isn't allowed and an animation is active
       * - navigationSkip is allowed but the threshold is yet to expire (unless
       *   navigating via forward/back button with hashTags enabled - see
       *   manageEvent.add.hashChange() for an explanation of this)
       * - preventReverseSkipping is enabled and the user is trying to navigate
           in a different direction to the one already active
       */
      if (
           id === undefined
        || id < 1 || id > self.noOfSteps
        || id === self.currentStepId
        || (self.options.navigationSkip === false && self.isActive === true)
        || (self.options.navigationSkip === true && self.navigationSkipThresholdActive === true && hashTagNav === undefined)
        || (self.options.preventReverseSkipping === true && self.direction !== direction && self.isActive === true)
      ) {
        return false;
      }

      var phaseThreshold = 0;

      // Save the latest direction
      self.direction = direction;

      // Ignore the phaseThreshold (on first run for example)
      if (ignorePhaseThreshold === undefined) {
        phaseThreshold = self.options.phaseThreshold;
      }

      // Get the next and current steps, and their elements
      var currentStep = "step" + self.currentStepId,
          nextStep = "step" + id,
          currentStepElement = self.animationMap[currentStep].element,
          nextStepElement = self.animationMap[nextStep].element;

      // Determine how often goTo() can be used based on navigationSkipThreshold
      // and manage step fading accordingly
      self._animation.manageNavigationSkip(id, direction, currentStep, nextStep, nextStepElement);

      // Move the active step to the top (via a higher z-index)
      self._animation.moveActiveStepToTop(currentStepElement, nextStepElement);

      // Sequence is now animating
      self.isActive = true;

      // Change the step number on the Sequence element
      self._animation.changeStep(id);

      if (self.transitionsSupported === true) {

        // Animate the canvas
        self._canvas.move(id, true);

        // Reset the next step's elements durations to 0ms so it can be snapped into place
        self._animation.resetInheritedSpeed(nextStep, "animate-out");

        // Determine how long the phases will last for, as well as the total length of the step
        var stepDurations = self._animation.getStepDurations(id, nextStep, currentStep, direction);

        // Are we moving the phases forward or in reverse?
        if (direction === 1) {
          self._animation.forward(id, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, hashTagNav);
        }else {
          self._animation.reverse(id, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, hashTagNav);
        }
      }

      // Use fallback animation
      else {

        self._animationFallback.goTo(id, currentStep, currentStepElement, nextStep, nextStepElement, direction, hashTagNav);
      }
    }

    /* --- CALLBACKS --- */

    /**
     * Callback executed when autoPlay is paused
     */
    self.paused = function(self) {

    }

    /**
     * Callback executed when autoPlay is unpaused
     */
    self.unpaused = function(self) {

    }

    /**
     * Callback executed when a step animation starts
     *
     * @param {Number} id - The ID of the step that was started
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.animationStarted = function(id, self) {

      // console.log("started", id);
    }

    /**
     * Callback executed when a step animation finishes
     *
     * @param {Number} id - The ID of the step that finished
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.animationFinished = function(id, self) {

      // console.log("finished", id);
    }

    /**
     * Callback executed when the current phase starts animating
     *
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.currentPhaseStarted = function(self) {

      // console.log("currentstarted");
    }

    /**
     * Callback executed when the current phase finishes animating
     *
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.currentPhaseEnded = function(self) {

      // console.log("currentended")
    }

    /**
     * Callback executed when the next phase starts animating
     *
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.nextPhaseStarted = function(self) {

      // console.log("nextstarted");
    }

    /**
     * Callback executed when the next phase finishes animating
     *
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.nextPhaseEnded = function(self) {

      // console.log("nextended")
    }

    /**
     * When the throttled window resize event occurs
     *
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.throttledResize = function(self) {

      // console.log("throttleResized")
    }

    /**
     * Callback executed when preloading has finished
     *
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.preloaded = function(self) {

      // console.log("preloaded");
    }

    /**
     * Callback executed every time an image to be preloaded returns a status
     *
     * @param {String} result - Whether the image is "loaded" or "broken"
     * @param {String} src - The source of the image
     * @param {Number} progress - The number of images that have returned a result
     * @param {Number} length - The total number of images that are being preloaded
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.preloadProgress = function(result, src, progress, length, self) {

      // console.log( "image is " + result + " for " + src );
      // console.log("progress: " + progress + " of " + length);
    }

    /**
     * Callback executed when Sequence is ready to be interacted with
     * = preloading + domDelay
     *
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.ready = function(self) {

      // console.log("ready");
    }

    /**
     * Callback executed when Sequence has finished being destroyed via .destroy()
     *
     * @param {Object} self - Properties and methods available to this instance
     * @api public
     */
    self.destroyed = function(self) {

      // console.log("goodbye!");
    }


    /* --- INIT --- */

    // Set up an instance of Sequence
    self._init(element);

    // Expose this instances public variables and methods
    return self;
  });

  return Sequence;
}

sequence = defineSequence(imagesLoaded, Hammer);
