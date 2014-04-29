/*
 * Sequence
 * The CSS3 Animation Framework
 *
 * @link https://github.com/IanLunn/sequence
 * @author IanLunn
 * @version 2.0.0
 * @license https://github.com/IanLunn/sequence/blob/master/LICENSE
 * @copyright IanLunn
 */

;(function (global) { function defineSequence(Hammer) {

  'use strict';

  /**
   * Default Sequence settings
   */
  var defaults = {
    autoPlay: true,
    autoPlayThreshold: 3000,
    autoPlayDirection: 1,
    startingStepId: 1,
    startingStepAnimatesIn: false,
    cycle: true,
    debug: false
  }

  // See Sequence._animation.domDelay() for an explanation of this
  var domDelayDuration = 50;

  /**
   * Extend object a with the properties of object b.
   * If there's a conflict, object b takes precedence.
   *
   * @param {Object} a - The first object to merge
   * @param {Object} b - The second object to merge (takes precedence)
   */
  function extend(a, b) {
    for(var i in b) {
      a[i] = b[i];
    }

    return a;
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
    if(time.indexOf("ms") > -1) {
      fraction = 1;
    }else{
      fraction = 1000;
    }

    if(time == "0s") {
      convertedTime = 0;
    }else{
      convertedTime = parseFloat(time.replace("s", "")) * fraction;
    }

    return convertedTime;
  }

  /**
   * Gets all styles for a given element and returns them in one text string
   * to be easily compared to another elements styles
   *
   * @param {} element - The element to get the computed styles from
   * @return {String} - The elements styles (in a string for easy comparison)
   * @api private
   */
  function getAllComputedStyles(element) {

    var style;
    var styles = {};

    // FireFox and Chrome way
    if(window.getComputedStyle) {
      style = window.getComputedStyle(element, null);
      var numberOfStyles = style.length;
      for(var i = 0; i < numberOfStyles; i++) {
        var prop = style[i];
        var val = style.getPropertyValue(prop);
        styles[prop] = val;
      }

    }
    // IE and Opera way
    else if(element.currentStyle) {
      style = element.currentStyle;
      for(var prop in style){
          styles[prop] = style[prop];
      }
    }
    // Style from style attribute
    else if(style = element.style) {
      for(var prop in style) {
        if(typeof style[prop] != 'function') {
          styles[prop] = style[prop];
        }
      }
    }

    return JSON.stringify(styles);
  }

  /**
   * Add and/or remove classes to/from an element
   *
   * @param {Object} element - The element to add/remove classes to/from
   * @param {String} classToAdd - A single string list of classes to add separated by a space
   * @param {String} classToRemove - A single string list of classes to remove separated by a space
   * @api private
   */
  function updateClassList(element, classToAdd, classToRemove) {

    // Get the existing list of class names applied to the element
    var existingClassList = element.className;
    var newClassList;

    // Add a class
    if(classToAdd !== undefined) {
      newClassList = existingClassList + " " + classToAdd;
    }

    // Remove a class
    if(classToRemove !== undefined) {
      newClassList = newClassList.replace(classToRemove, "");
    }

    // Add the new class list
    element.className = newClassList;
  }

  /**
   * Constructor
   *
   * @param {Object} element - the element Sequence is bound to
   * @param {Number} numberOfSteps - the number of steps Sequence will consist of
   * @param {Object} options - this instance's options
   * @return {Object} self - Variables and methods available to this instance
   * @api public
   */
  function Sequence(element, numberOfSteps, options) {

    var self = {};

    /**
     * Create an object map containing the elements that will animate, their
     * duration time and the maximum duration each phase's animation will last.
     * This enables Sequence to determine when a phase has finished animating and
     * when to start the next phase's animation (if autoPlay is being used).
     * Sequence can also quickly get elements to manipulate in
     * Sequence._animation.overrideInheritedSpeed() without querying the DOM again.
     *
     * A phase's duration consists of the highest combination of
     * transition-duration and transition-delay
     *
     * @api public
     */
    self._getAnimationMap = {

      /**
       * Start getting the animation map.
       *
       * @param {Object} element - the Sequence element
       * @param {Number} numberOfSteps - the number of steps Sequence consists of
       * @return {Object}
       * @api public
       */
      init: function(element, numberOfSteps) {

        // Clone Sequence so it can be quickly forced through each step
        this.clonedSequence = this.createClone(element);

        // Get all of the cloned elements and real elements within Sequence
        this.allClonedElements = this.clonedSequence.getElementsByTagName("*");
        this.allElements = element.getElementsByTagName("*");

        // Count cloned elements
        this.numberOfElements = this.allClonedElements.length;

        // Get any non-animation class names applied to Sequence
        this.originalClasses = this.clonedSequence.className;

        // Where we'll save the animations
        this.animationMap = {};

        // Initiate each Sequence step on the cloned Sequence
        this.steps(numberOfSteps);

        // Remove the Sequence clone now we've got the animations
        this.destroyClone(this.clonedSequence);

        return this.animationMap;
      },

      /**
       * Get the number of steps being used (TODO)
       *
       * Currently this is specified by the developer but it'd be nice to have it
       * automated. This could be achieved perhaps by running through the stylesheet
       * search for instances of "sequence1", "sequence2" and so on.
       * Care needs to be taken to ensure this returns the correct number of steps.
       *
       * @param {}
       * @return {Number}
       * @api private
       */
      getNumberOfSteps: function(element) {

      },

      /**
       * Initiate each Sequence step on the cloned Sequence
       *
       * @param {Number} numberOfSteps - The number of steps Sequence consists of
       * @api private
       */
      steps: function(numberOfSteps) {

        // Get all of the elements in the start-phase
        this.startPhase();

        for(var stepNo = 1; stepNo <= numberOfSteps; stepNo++) {

          // Which step is being initiated?
          this.stepNo = "step" + stepNo;

          // Where we'll save the phases
          this.animationMap[this.stepNo] = {};

          // Get the animations for this step's in" and "out" phases
          this.phases("in", stepNo);
          this.phases("out", stepNo);
        }
      },


      /**
       * Get all of the elements in the "start" phase
       *
       * @return {Boolean}
       * @api private
       */
      startPhase: function() {

        // Where we'll save this phase's properties
        var startElements = [];
        this.animationMap["start"] = {};

        // Get all elements and their styles for the "start" phase
        for(var elementNo = 0; elementNo < this.numberOfElements; elementNo++) {

          // Get the cloned element being tested and the real element
          var element = this.allClonedElements[elementNo];
          var realElement = this.allElements[elementNo];
          var elementProperties = {};

          // Get all of the elements computed styles for comparison
          // (to work out if the element is animating in this phase)
          var allStyles = getAllComputedStyles(element);

          // Save all elements and all styles
          elementProperties.element = realElement;
          elementProperties.styles = allStyles;
          startElements.push(elementProperties);
        }

        // Save the start phase elements
        this.animationMap["start"]["allElements"] = startElements;
      },


      /**
       * Initiate the "in" and "out" phases for a Sequence step
       *
       * @param {String} direction - The direction of the phase "in" or "out"
       * @param {Number} stepNo - The step number
       * @return {Boolean}
       * @api private
       */
      phases: function(direction, stepNo) {

        // Where we'll save this phase's elements and computed duration
        var animatedElements = [];
        var allElements = [];
        var maxComputedDuration = 0;

        // Which phase is being initiated?
        var phase = this.stepNo + "-" + direction;

        // Add the phase class
        updateClassList(this.clonedSequence, phase);

        // Where we'll save this phase's properties
        this.animationMap[this.stepNo][direction] = {};

        /**
         * Determine if elements in this phase will animate and if they do,
         * which one will animate the longest.
         * Phase duration = transition-duration + transition-delay
         */
        for(var elementNo = 0; elementNo < this.numberOfElements; elementNo++) {

          // Get the cloned element being tested and the real element to be saved
          // Get the element's styles
          var element = this.allClonedElements[elementNo];
          var realElement = this.allElements[elementNo];
          var styles = getComputedStyle(element, null) || element.currentStyle;
          var animatedElementProperties = {};
          var allElementProperties = {};

          // Get all of the elements computed styles for comparison
          // (to work out if the element is animating in this phase)
          var allStyles = getAllComputedStyles(element);


          // Get the previous phase and its styles for comparison to this
          // phase's elements
          if(direction === "in") {
            var prevStyles = this.animationMap["start"]["allElements"][elementNo]["styles"];
          }else{
            var prevStyles = this.animationMap[this.stepNo]["in"]["allElements"][elementNo]["styles"];
          }

          /**
           * Will the element animate in this phase?
           *
           * If the element from the cloned Sequence will animate in this phase,
           * work out its computed duration. Add the equivalent real element to
           * the list of elements that will animate, and its duration and delay
           * for manipulation later.
           */
          if(prevStyles !== allStyles) {

            var transitionDuration = convertTimeToMs(styles[Modernizr.prefixed("transitionDuration")]);
            var transitionDelay = convertTimeToMs(styles[Modernizr.prefixed("transitionDelay")]);
            var computedDuration = transitionDuration + transitionDelay;
            animatedElementProperties.element = realElement;
            animatedElementProperties.duration = transitionDuration;
            animatedElementProperties.delay = transitionDelay;
            animatedElements.push(animatedElementProperties);

            // Save the computed duration if it's the longest one yet
            if(computedDuration !== 0 && computedDuration > maxComputedDuration) {
              maxComputedDuration = computedDuration;
            }
          }

          allElementProperties.element = realElement;
          allElementProperties.styles = allStyles;
          allElements.push(allElementProperties)
        }

        // Remove the phase class now we're done with it
        updateClassList(this.clonedSequence, "", phase);

        // Save this phase's animated elements and maxium computed duration
        this.animationMap[this.stepNo][direction]["animatedElements"] = animatedElements;
        this.animationMap[this.stepNo][direction]["allElements"] = allElements;
        this.animationMap[this.stepNo][direction]["maxDuration"] = maxComputedDuration;
      },

      /**
       * Clone an instance of Sequence to get the animation map from
       *
       * @param {Object} element - The Sequence element to clone
       * @return {Object} The cloned element
       * @api private
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
       * @api private
       */
      destroyClone: function(element) {

        // TODO: make IE7 compatible

        element.parentNode.removeChild(element);
      }
    }

    /**
     * Controls all of Sequence's animations and DOM manipulations
     */
    self._animation = {

      /**
       * Move a Sequence step forward
       *
       * @param {Number} nextStepId - the ID of the next step
       * @param {String} direction - the direction of the next step
       * @param {Object} self - Variables and methods available to this instance
       * @api private
       */
      forward: function(nextStepId, direction, self) {

        var _animation = this;

        // Get the next and current steps
        var nextStep = "step" + nextStepId;
        var currentStep = "step" + self.currentStepId;

        // Temporarily apply 0s transition-duration and transition-delay then
        // move the next step to its start-phase position
        _animation.overrideInheritedSpeed(nextStep, "out", true, self);
        var phaseToRemove = nextStep + "-out";
        updateClassList(self.element, "", phaseToRemove);

        // Move the current step to its out-phase and the next step to its in-phase
        _animation.domDelay(function() {
          _animation.changePhase("out", self.currentStepId, self, false);
          _animation.changePhase("in", nextStepId, self, false);
        });
      },

      /**
       * Move a Sequence step in Reverse
       *
       * @param {Number} nextStepId - the ID of the next step
       * @param {String} direction - the direction of the next step
       * @param {Object} self - Variables and methods available to this instance
       * @api private
       */
      reverse: function(nextStepId, direction, self) {

        var _animation = this;

        // Get the next and current steps
        var nextStep = "step" + nextStepId;
        var currentStep = "step" + self.currentStepId;

        // Temporarily apply 0s transition-duration and transition-delay then
        // move the next step to its out-phase position
        _animation.overrideInheritedSpeed(nextStep, "out", true, self);
        var phaseToAdd = nextStep + "-out";
        updateClassList(self.element, phaseToAdd);

        // Reverse the current step's in-phase to start-phase
        // Move the next step to its in-phase, then start autoPlay
        _animation.domDelay(function() {
          _animation.overrideInheritedSpeed(currentStep, "in", false, self);

          var phaseToRemove = currentStep + "-in";
          updateClassList(self.element, "", phaseToRemove);

          _animation.changePhase("in", nextStepId, self, false);
        });
      },

      /**
       *
       */
      reverseDirectionString: function(direction) {

        var _animation = this;

        var reverseDirection = {
            "out": "in",
            "in": "out"
        }

        return reverseDirection[direction];
      },

      /**
       * Apply a short delay to a function that manipulates the DOM. Allows for
       * sequential DOM manipulations.
       *
       * Why is this needed?
       *
       * When sequentially manipulating a DOM element (ie, removing a class then
       * immediately applying another on the same element), the first manipulation
       * appears to not apply. This function puts a small gap between sequential
       * manipulations to give the browser a chance visually apply each manipulation.
       *
       * Some browsers can apply a succession of classes quicker than
       * this but 50ms is enough to capture even the slowest of browsers
       *
       * @param {Function} callback - a function to run after the delay
       */
      domDelay: function(callback) {

        setTimeout(function() {
          callback();
        }, domDelayDuration);
      },

      /**
       * Change a step's phase position. Example: go from step1-in to step1-out
       *
       * @param {Number} direction - The direction of the next phase
       * @param {Number} id - The ID of the step the phase belongs to
       * @param {Object} self - Variables and methods available to this instance
       * @param {Boolean} reset - Change the phase immediately with a transition
       * @api private
       */
      changePhase: function(direction, id, self, reset) {

        var _animation = this;

        // Get the step and old phase
        var step = "step" + id;
        var oldPhase = this.reverseDirectionString(direction);

        // Change the phase without applying a transition (so it snaps into place)
        if(reset === true) {
          _animation.overrideInheritedSpeed(step, direction, reset, self);
        }

        // Remove the step's current phase and apply the next
        var phaseToAdd = step + "-" + direction;
        var phaseToRemove = " step" + id + "-" + oldPhase;
        updateClassList(self.element, phaseToAdd, phaseToRemove);

        // Get the next phase's maximum duration then run the callback when it has
        // expired (the next step has finished animating into position).
        var phaseDuration = self.animationMap[step][direction].maxDuration;

        if(direction === "in") {

          // Callback
          self.animationStarted(self);

          // The next ID is now the current ID
          self.currentStepId = id;

          setTimeout(function() {
            self.autoPlay();

            // Callback
            self.animationFinished(self);
          }, phaseDuration);
        }
      },

      /**
       * Apply a transition-duration and transition-delay of 0 to each element
       * within a step so a phase can be changed without a transition occuring.
       * Then remove these temporary values once the phase is reset.
       *
       *
       * @param {Object} element - description
       * @param {Number} step - description
       * @param {String} direction - description
       * @param {Object} animationMap - description
       * @param {Number} numberOfSteps - description
       * @param {Number} reset - description
       * @api private
       */
      overrideInheritedSpeed: function(step, direction, reset, self) {

        var _animation = this;

        if(self.options.autoPlayDirection === -1 && direction === "out") {
          direction = "in";
        }

        // Get the step's elements and count them
        var stepElements = self.animationMap[step][direction].animatedElements;
        var numberOfStepElements = stepElements.length;

        var transitionDuration = "0s";
        var transitionDelay = "0s";

        // Temporarily apply a transition-duration and transition-delay of 0 to
        // make the step reset happen immediately
        for(var i = 0; i < numberOfStepElements; i++) {
          var stepProperties = stepElements[i];

          // If not immediately resetting the step, get the duration and delay
          if(reset !== true) {
            transitionDuration = stepProperties.duration + "ms";
            transitionDelay = stepProperties.delay + "ms";
          }

          // Apply the transition-duration and transition-delay
          stepProperties.element.style.transitionDuration = transitionDuration;
          stepProperties.element.style.transitionDelay = transitionDelay;
        }

        /**
         * Note: Synchronously, an element's phase class is added/removed here.
         * To save the need for a callback though (and extra code), we instead rely
         * on the necessity for the .domDelay() function which doesn't remove the
         * inheritedStyles until after a brief delay. What would be the callback
         * is instead just placed after the call to .overrideInheritedSpeed() and
         * from a synchronous poit of view, occurs at this point, before the
         * following .domDelay();
         */

        // Remove the temporary transition-duration and transition-delay from each
        // element now it has been manipulated; allowing for the inherited styles
        // to take effect again.
        _animation.domDelay(function() {
          for(var i = 0; i < numberOfStepElements; i++) {
            var stepProperties = stepElements[i];

            stepProperties.element.style.transitionDuration = "";
            stepProperties.element.style.transitionDelay = "";
          }
        });
      }
    }

    /**
     * Set up an instance of Sequence
     *
     * @param {Object} element - The element Sequence is attached to
     * @param {Object} options - Developer defined options
     * @return {Object} self - Variables and methods available to this instance
     * @api public
     */
    self._init = function() {

      // Make sure numberOfSteps exists and is a number
      if(numberOfSteps === undefined || typeof numberOfSteps !== "number") {
        console.error("Sequence.js: numberOfSteps must be specified and as a number")
        return false;
      }else{
        self.numberOfSteps = numberOfSteps;
      }

      // Merge developer options with defaults
      self.options = extend(defaults, options);

      // Get Sequence's animations (which elements will animate and their timings)
      self.animationMap = self._getAnimationMap.init(element, numberOfSteps);

      // zero-base currentStepId
      self.currentStepId = self.options.startingStepId - 1;
    }

    /**
     * Go to the next step
     *
     * @api public
     */
    self.next = function() {

      var nextStepId = self.currentStepId + 1;

      if(nextStepId > self.numberOfSteps) {
        nextStepId = 1;
      }

      self.goTo(nextStepId, self.options.autoPlayDirection);
    }

    /**
     * Go to the previous step
     *
     * @api public
     */
    self.prev = function() {

      var prevStepId = self.currentStepId - 1;

      if(prevStepId < 1) {
        prevStepId = self.numberOfSteps;
      }

      self.goTo(prevStepId, self.options.autoPlayDirection);
    }

    /**
     * Go to a specific step
     *
     * @param {Number} id - The ID of the step to go to
     * @param {Number} direction - Direction to get to the step (1 = forward, -1 = reverse)
     * @param {Boolean} ignoreTransitionThreshold - if true, ignore the transitionThreshold setting and immediately go to the specified step
     * @api public
     */
    self.goTo = function(id, direction, ignoreTransitionThreshold) {

      if(direction === 1) {
        self._animation.forward(id, direction, self);
      }else{
        self._animation.reverse(id, direction, self);
      }
    }

    /**
     * Cause Sequence to continously change steps after a certain period of time
     * has passed after a steps animations have ended. The period of time is
     * defined using the autoPlayThreshold option.
     *
     * autoPlay in the options must be set to true.
     *
     * @api public
     */
    self.autoPlay = function() {

      if(self.options.autoPlay === true) {

        setTimeout(function() {

          if(self.options.autoPlayDirection === 1) {
            self.next();
          }else{
            self.prev();
          }
        }, self.options.autoPlayThreshold);
      }
    }

    /**
     * Destroy an instance of Sequence :(
     *
     * @return {Boolean}
     * @api public
     */
    self.destroy = function() {

    }

    /* --- CALLBACKS --- */

    /**
     * Callback executed when a step animation starts
     *
     * @param {Object} sequence - all available public variables/methods
     * @api public
     */
    self.animationStarted = function(self) {

      // console.log("started");
    }

    /**
     * Callback executed when a step animation finishes
     *
     * @param {Object} sequence - all available public variables/methods
     * @api public
     */
    self.animationFinished = function(self) {

      // console.log("finished");
    }


    // Set up an instance of Sequence
    self._init(element, numberOfSteps, options);

    console.log(self.animationMap);

    // Get the element Sequence is attached to
    self.element = element;

    // Get the first step's ID
    self.currentStepId = self.options.startingStepId;

    // Going forward or in reverse?
    if(self.options.autoPlayDirection === 1) {

      // Start the first in-phase
      self._animation.changePhase("in", self.currentStepId, self, false);
    }else{

      // Reset the first phase to the out-phase position (without a transition),
      // start the first in-phase
      self._animation.changePhase("out", self.currentStepId, self, true);
      self._animation.domDelay(function() {
        self._animation.changePhase("in", self.currentStepId, self, false);
      });
    }

    // Expose this instances public variables and methods
    return self;
  }

  // Expose sequence
  return Sequence;

  // ---------------------------------------------------------------------------

  } if(typeof define === 'function' && define.amd) {
      // amd anonymous module registration
      define(['third-party/hammer.min'], defineSequence);
  }else{
    // browser global
    global.sequence = defineSequence();
  }
}(this));
