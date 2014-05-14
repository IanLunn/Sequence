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

  // See Sequence._animation.domDelay() for an explanation of this
  var domDelayDuration = 50;

  // Default Sequence settings
  var defaults = {

    // General Settings
    startingStepId: 3,             //y
    startingStepAnimatesIn: false, //y
    cycle: true,                   //y
    phaseThreshold: false,         //y

    reverseAnimationsWhenNavigatingBackwards: true, //y
    reverseEaseWhenNavigatingBackwards: true,       //y
    preventDelayWhenReversingAnimations: false,     //y
    moveActiveFrameToTop: true,
    windowLoaded: false,

    // Canvas Animation Settings
    autoAnimateCanvas: false,

    // Autoplay Settings
    autoPlay: false,               //y
    autoPlayDirection: 1,          //y
    autoPlayThreshold: 3000,       //y

    // Navigation Skipping Settings
    navigationSkip: true,          //y
    navigationSkipThreshold: 250,  //y
    fadeStepWhenSkipped: true,
    fadeStepTime: 150,             //y
    preventReverseSkipping: false, //y

    // Next/Prev Button Settings
    nextButton: false,
    showNextButtonOnInit: true,
    prevButton: false,
    showPrevButtonOnInit: true,

    // Pause Settings
    pauseButton: false,
    unpauseDelay: null,
    pauseOnHover: true,
    pauceIcon: false,
    showPauseButtonOnInit: true,

    // Pagination Settings
    pagination: false,
    showPaginationOnInit: true,

    // Preloader Settings
    preloader: false,
    preloadTheseFrames: [1],
    preloadTheseImages: [
    	/**
       * Example usage
       * "images/catEatingSalad.jpg",
       * "images/meDressedAsBatman.png"
       */
    ],
    hideFramesUntilPreloaded: true,
    prependPreloadingComplete: true,
    hidePreloaderUsingCSS: true,
    hidePreloaderDelay: 0,

    // Keyboard Settings
    keyNavigation: true,                  //y
    numericKeysGoToFrames: true,          //y
  	keyEvents: {                          //y
      left: function(self) {self.prev()},
      right: function(self) {self.next()}
    },

    // Touch Swipe Settings
  	swipeNavigation: true,
    swipeThreshold: 20,
    swipePreventsDefault: false,
    swipeEvents: {
      left: function(self) {self.prev()},
      right: function(self) {self.next()},
      up: false,
      down: false
    },

  	//hashTags Settings
    //when using hashTags, please include a reference to Ben Alman's jQuery HashChange plugin above your reference to Sequence.js

    //info: http://benalman.com/projects/jquery-hashchange-plugin/
    //plugin: https://raw.github.com/cowboy/jquery-hashchange/v1.3/jquery.ba-hashchange.min.js
    //GitHub: https://github.com/cowboy/jquery-hashchange
    hashTags: false, //when a frame is navigated to, change the hashtag to the frames ID
    hashDataAttribute: false, //false = the hashTag is taken from a frames ID attribute | true = the hashTag is taken from the data attribute "data-sequence-hash"
    hashChangesOnFirstFrame: false, //false = the hashTag won't change for the first frame but will for those after

    //Fallback Theme Settings (For browsers that don't support CSS3 transitions)
    fallback: {
      theme: "slide",
      speed: 500
    }
  }

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

  /*
   * Cross Browser helper to addEventListener
   * Source: https://gist.github.com/eduardocereto/955642
   *
   * @param {HTMLElement} obj - The Element to attach event to.
   * @param {string} evt - The event that will trigger the binded function.
   * @param {function(event)} fnc - The function to bind to the element.
   * @return {boolean} - true if it was successfuly binded.
   */
  function addEventListener_cb(obj, evt, fnc) {

    // W3C model
    if(obj.addEventListener) {
      obj.addEventListener(evt, fnc, false);
      return true;
    }

    // Microsoft model
    else if(obj.attachEvent) {
      return obj.attachEvent("on" + evt, fnc);
    }

    // Browser don't support W3C or MSFT model, go on with traditional
    else {
      evt = "on" + evt;
      if(typeof obj[evt] === "function") {

        // Object already has a function on traditional
        // Let's wrap it with our own function inside another function
        fnc = (function(f1,f2) {
          return function() {
            f1.apply(this,arguments);
            f2.apply(this,arguments);
          }
        })(obj[evt], fnc);
      }
      obj[evt] = fnc;
      return true;
    }

    return false;
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

  function hasClass(el, name) {
    return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
  }

  function addClass(el, name) {
    if(!hasClass(el, name)) {
      el.className += (el.className ? ' ': '') + name;
    }
  }

  function removeClass(el, name) {
    if(hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
    }
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

    if(classToAdd !== "") {
      addClass(element, classToAdd);
    }

    if(classToRemove !== undefined) {
      removeClass(element, classToRemove)
    }
  }

  /**
   * Constructor
   *
   * @param {Object} element - the element Sequence is bound to
   * @param {Object} options - this instance's options
   * @return {Object} self - Variables and methods available to this instance
   * @api public
   */
  function Sequence(element, options) {

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
     * @api public
     */
    self._getAnimationMap = {

      /**
       * Start getting the animation map.
       *
       * @param {Object} element - the Sequence element
       * @return {Object}
       * @api public
       */
      init: function(element) {

        // Clone Sequence so it can be quickly forced through each step
        // and get the canvas and each step
        this.clonedSequence = this.createClone(element);
        this.clonedCanvas = this.clonedSequence.querySelectorAll(".canvas");
        this.clonedSteps = this.clonedSequence.querySelectorAll(".canvas > li");

        // Get any non-animation class names applied to Sequence
        this.originalClasses = this.clonedSequence.className;

        // Where we'll save the animations
        this.animationMap = {};

        // Initiate each Sequence step on the cloned Sequence
        this.steps();

        // Remove the Sequence clone now we've got the animation map
        this.destroyClone(this.clonedSequence);

        return this.animationMap;
      },

      /**
       * Initiate each Sequence step on the cloned Sequence
       *
       * @api public
       */
      steps: function() {

        for(var i = 0; i < self.noOfSteps; i++) {

          // Get the step, step number (one-based),
          // the step's children and count them
          var stepNo = "step" + (i + 1);
          var clonedStepElement = this.clonedSteps[i];
          var realStepElement = self.steps[i];
          var clonedStepChildren = clonedStepElement.getElementsByTagName("*");
          var realStepChildren = realStepElement.getElementsByTagName("*");
          var noOfStepChildren = clonedStepChildren.length;

          // Set up an object where we'll save the step's phase properties
          // Save the step element for later manipulation
          this.animationMap[stepNo] = {};
          this.animationMap[stepNo].element = realStepElement;

          // Add the step class to the sequence element
          updateClassList(this.clonedSequence, stepNo);

          // Get the animations for this step's "animate-in"
          // and "animate-out" phases
          this.phases("animate-in", stepNo, clonedStepElement, clonedStepChildren, realStepChildren, noOfStepChildren);
          this.phases("animate-out", stepNo, clonedStepElement, clonedStepChildren, realStepChildren, noOfStepChildren);

          // Remove the step class now we're done with it
          updateClassList(this.clonedSequence, "", stepNo);
        }
      },

      /**
       * Initiate the "animate-in" and "animate-out" phases for a Sequence step
       *
       * @param {String} phase - The phase "animate-in" or "animate-out"
       * @param {Number} stepNo - The step number
       * @param {Object} clonedStepElement - The cloned element associated with the step
       * @param {Array} clonedStepChildren - All of the cloned step's child elements
       * @param {Array} realStepChildren - All of the real step's child elements
       * @param {Number} noOfStepChildren - The number of step child elements
       * @api public
       */
      phases: function(phase, stepNo, clonedStepElement, clonedStepChildren, realStepChildren, noOfStepChildren) {

        // Where we'll save this phase's elements and computed duration
        var elements = [];
        var maxDuration = undefined;
        var maxDelay = undefined;
        var maxComputedDuration = undefined;

        // Add the phase class to the current step
        updateClassList(clonedStepElement, phase);

        // Where we'll save this phase's properties
        this.animationMap[stepNo][phase] = {};

        /**
         * Save the step's child element properties if it will animate in the
         * phase being tested
         */
        for(var elementNo = 0; elementNo < noOfStepChildren; elementNo++) {

          // Get the cloned element being tested and the real element to be saved
          var element = clonedStepChildren[elementNo];
          var realElement = realStepChildren[elementNo];

          // Get the element's styles
          var styles = getComputedStyle(element, null) || element.currentStyle;
          var elementProperties = {};

          // Get the element's transition-duration and transition-delay, then
          // calculate the computed duration
          var transitionDuration = convertTimeToMs(styles[ModernizrSeq.prefixed("transitionDuration")]);
          var transitionDelay = convertTimeToMs(styles[ModernizrSeq.prefixed("transitionDelay")]);
          var transitionTimingFunction = styles[ModernizrSeq.prefixed("transitionTimingFunction")];
          var computedDuration = transitionDuration + transitionDelay;

          /**
           * Will the element animate in this phase?
           *
           * If the element from the cloned Sequence will animate in this phase,
           * add the equivalent real element to the list of elements that will
           * animate, and its duration and delay.
           */
          if(computedDuration !== 0) {

            elementProperties.element = realElement;
            elementProperties.duration = transitionDuration;
            elementProperties.delay = transitionDelay;
            elementProperties.timingFunction = transitionTimingFunction;
            elements.push(elementProperties);

            if(maxDuration === undefined || transitionDuration > maxDuration) {
              maxDuration = transitionDuration;
            }

            if(maxDelay === undefined || transitionDelay > maxDelay) {
              maxDelay = transitionDelay;
            }

            // Save the computed duration if it's the longest one yet
            if(maxComputedDuration === undefined || computedDuration > maxComputedDuration) {
              maxComputedDuration = computedDuration;
            }
          }
        }

        // Remove the phase class from the current step
        updateClassList(clonedStepElement, "", phase);

        // Save this phase's animated elements and maxium computed duration
        this.animationMap[stepNo][phase]["elements"] = elements;
        this.animationMap[stepNo][phase]["noOfElements"] = elements.length;
        this.animationMap[stepNo][phase]["maxDuration"] = maxDuration;
        this.animationMap[stepNo][phase]["maxDelay"] = maxDelay;
        this.animationMap[stepNo][phase]["computedDuration"] = maxComputedDuration;
      },

      /**
       * Clone an instance of Sequence to get the animation map from
       *
       * @param {Object} element - The Sequence element to clone
       * @return {Object} The cloned element
       * @api public
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
       * @api public
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
       * Fade an element in using transitions if they're supported, else use JS
       */
      fadeIn: function(element, duration) {

        if(ModernizrSeq.csstransitions === true) {

          element.style.transition = duration + "ms opacity linear";
          element.style.opacity = 1;
        }else{

         // TODO - make the step fade out using JS
        }
      },

      /**
       * Fade an element out using transitions if they're supported, else use JS
       */
      fadeOut: function(element, duration) {

        if(ModernizrSeq.csstransitions === true) {

          element.style.transition = duration + "ms opacity linear";
          element.style.opacity = 0;
        }else{

         // TODO - make the step fade out using JS
        }
      },

      /**
       * If the navigationSkipThreshold option is being used, prevent the use
       * of goTo() during the threshold period
       *
       * @param {Number} id - The id of the step that was skipped
       * @param {Object} self -
       */
      manageNavigationSkip: function(id, nextId, self) {

        var _animation = this;

        if(self.options.navigationSkip === true) {

          if(self.isActive === true) {

            self.navigationSkipThresholdActive = true;

            // Zero-base the ID of the skipped step and get the associated element
            var skippedStepId = id - 1;
            var skippedStep = self.steps[skippedStepId];

            // Keep note that the element was skipped so we can fade it in again
            self.steps[skippedStepId]["skipped"] = true;

            // Fade a step out if the user navigates to another prior to its
            // animation finishing
            if(self.options.fadeStepWhenSkipped === true) {
              _animation.fadeOut(skippedStep, self.options.fadeStepTime);
            }

            //start the navigationSkipThreshold timer to prevent being able to navigate too quickly
            setTimeout(function() {
              self.navigationSkipThresholdActive = false;
            }, self.options.navigationSkipThreshold);
          }

          // If a step was previously hidden, fade it in again
          nextId = nextId - 1;

          if(self.steps[nextId]["skipped"] === true) {
            var skippedStep = self.steps[nextId];
            _animation.fadeIn(skippedStep, self.options.fadeStepTime);
          }
        }
      },

      /**
       * Change a step's class. Example: go from step1 to step2
       *
       * @param {Number} id - The ID of the step to change to
       * @param {Object} self - Variables and methods available to this instance
       * @api public
       */
      changeStep: function(id, self) {

        // Get the step to add
        var stepToAdd = "step" + id;

        // Add the new step and remove the previous
        if(self.currentStepId !== undefined) {

          var stepToRemove = "step" + self.currentStepId;
          updateClassList(self.element, stepToAdd, stepToRemove);
        }else{
          updateClassList(self.element, stepToAdd);
        }
      },

      /**
       * Apply the reversed properties to all animatable elements within a step
       *
       * @param {String} step - The step that the elements we'll override belong to
       * @param {Number} delay - The delay to be applied
       * @return {Number} computedDuration - The time the steps will take to finish their reversed transition
       */
      reverseProperties: function(step, phase, stepDurations) {

        var _animation = this;

        var stepProperties = self.animationMap[step][phase];

        // Apply the transition properties to each element
        for(var i = 0; i < stepProperties.noOfElements; i++) {
          var stepElements = stepProperties.elements[i];

          stepElements.element.style.transition =
            stepDurations["animation"] + "ms "
            + stepDurations["delay"] + "ms "
            + _animation.reverseTimingFunction(stepElements.timingFunction);
        }

        // Remove transition properties from each element once it has finished
        // animating; allowing for the inherited styles to take effect again.
        setTimeout(function() {
          for(var i = 0; i < stepProperties.noOfElements; i++) {
            var stepElements = stepProperties.elements[i];

            stepElements.element.style.transition = "";
          }
        }, stepDurations["total"]);
      },

      /**
       * Go forward to the next step
       */
      forward: function(id, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, self) {

        var _animation = this;

        // Snap the step to the "animate-start" phase
        updateClassList(nextStepElement, "", "animate-out");

        _animation.domDelay(function() {
          // Make the current step transition to "animate-out"
          updateClassList(currentStepElement, "animate-out", "animate-in");

          // Make the next step transition to "animate-in"
          _animation.startAnimateIn(id, 1, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, self);
        });
      },

      /**
       * Go in reverse to the next step
       */
      reverse: function(id, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, self) {

        var _animation = this;

        // Snap the step to the "animate-out" phase
        updateClassList(nextStepElement, "animate-out");

        _animation.domDelay(function() {

          // Reverse properties for both the current and next steps
          _animation.reverseProperties(currentStep, "animate-out", stepDurations["current-phase"]);
          _animation.reverseProperties(nextStep, "animate-in", stepDurations["next-phase"]);

          // Make the current step transition to "animate-start"
          updateClassList(currentStepElement, "", "animate-in");

          // Make the next step transition to "animate-in"
          _animation.startAnimateIn(id, -1, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, self);
        });
      },

      /**
       *
       */
      startAnimateIn: function(id, direction, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, self) {

        // The next ID is now the current ID
        self.currentStepId = id;

        // Callback
        self.animationStarted(id);

        var stepDurationTotal = 0;
        var currentPhaseDuration = stepDurations["current-phase"];
        var nextPhaseDuration = stepDurations["next-phase"];

        // When should the "animate-in" phase start?
        // How long until the step completely finishes animating?
        if(self._firstRun === false) {
          var nextPhaseThreshold = stepDurations["next-phase-threshold"];
          var stepDurationTotal = stepDurations["step-total"];
        }

        // Set the first step's speed to 0 to have it immediately snap into place
        else if(self._firstRun === true && self.options.startingStepAnimatesIn === false) {
          self._animation.resetInheritedSpeed(nextStep, "animate-in", self);
          stepDurationTotal = 0;
        }

        // The first step is animating in - the step duration total is the same
        // as the next phase's total animation
        else{
          stepDurationTotal = stepDurations["next-phase"]["total"];
        }

        // Start the "animate-in" phase
        if(self._firstRun === false) {

          setTimeout(function() {
            updateClassList(nextStepElement, "animate-in", "animate-out");
          }, nextPhaseThreshold);
        }else{

          nextPhaseThreshold = 0;
          self._firstRun = false;
          updateClassList(nextStepElement, "animate-in", "animate-out");
        }

        // Wait for the step to finish animating
        self._animation.ended(id, stepDurationTotal);

      },

      /**
       * When a step's animations have completely finished
       */
      ended: function(id, stepDurationTotal) {

        setTimeout(function() {
          self.autoPlay();

          self.isActive = false;

          // Callback
          self.animationFinished(id);
        }, stepDurationTotal);
      },

      /**
       * Determine how long a step's phases will animate for
       *
       * Note: the first time sequence.goTo() is run, the step duration
       * will always be the longest computed duration from the "animate-in"
       * phase, as the "animate-out" phase is immediately snapped into place.
       *
       * @param {String} nextStep - The step that will be animated-in
       * @param {String} currentStep - The step that will be animated-out
       * @return {Number} stepDuration - The time the step will take to animate
       */
      getStepDurations: function(nextStepId, nextStep, currentStep, direction) {

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
        if(direction === 1) {
          currentPhaseDuration = self.animationMap[currentStep]["animate-out"].computedDuration;
          nextPhaseDuration = self.animationMap[nextStep]["animate-in"].computedDuration;
        }

        // Navigating in reverse
        else{

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
           * Note: This delay may be bad for user experience because the
           * users action wonâ€™t immediately create an on-screen event. If the
           * developer wants, they can remove the delay with the
           * preventDelayWhenReversingAnimations option.
           */
          if(self.options.preventDelayWhenReversingAnimations === false && phaseThreshold !== true) {

            // Add the delay to whichever element animates for the shortest period

            var reverseThreshold = self.animationMap[currentStep]["animate-in"].maxDuration - self.animationMap[nextStep]["animate-out"].maxDuration;
            if(reverseThreshold > 0) {
              nextDelay = reverseThreshold;
            }else{
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
            if(currentPhaseDurationTotal > nextPhaseDurationTotal) {
              durations["step-total"] = currentPhaseDurationTotal;
            }else{
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

            if(currentPhaseDurationTotal > nextPhaseDurationIncThreshold) {
              durations["step-total"] = currentPhaseDurationTotal;
            }else{
              durations["step-total"] = nextPhaseDurationIncThreshold;
            }
        }

        return durations;
      },

      /**
       * Change "animate-out" to "animate-in" and vice-versa.
       *
       * @param {String} - The phase to reverse
       * @return {String} - The reversed phase
       * @api public
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
       * @api public
       */
      domDelay: function(callback) {

        setTimeout(function() {
          callback();
        }, domDelayDuration);
      },

      /**
       *
       */
      reverseTimingFunction: function(timingFunction) {

        // Don't reverse the timing function if the options specify it shouldn't be
        if(self.options.reverseEaseWhenNavigatingBackwards === false) {
          return timingFunction;
        }

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
        if(timingFunction.indexOf("cubic-bezier") < 0) {
          timingFunction = timingFunctionToCubicBezier[timingFunction];
        }

        // Remove the CSS function and just get the array of points
        var cubicBezier = timingFunction.replace('cubic-bezier(', '').replace(')', '').split(',');
        var cubicBezierLength = cubicBezier.length;

        // Convert each point into a number (rather than a string)
        for(var i = 0; i < cubicBezierLength; i++) {
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
       * @param {Object} self - Variables and methods available to this instance
       * @api public
       */
      resetInheritedSpeed: function(step, phase, self) {

        var _animation = this;

        // Get the step's elements and count them
        var stepElements = self.animationMap[step][phase].elements;
        var numberOfStepElements = self.animationMap[step][phase].noOfElements;

        // Temporarily apply a transition-duration and transition-delay to each
        // element.
        for(var i = 0; i < numberOfStepElements; i++) {
          var stepProperties = stepElements[i];

          // Apply the transition-duration and transition-delay
          stepProperties.element.style.transition = "0ms 0ms";
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
          for(var i = 0; i < numberOfStepElements; i++) {
            var stepProperties = stepElements[i];

            stepProperties.element.style.transition = "";
          }
        }, domDelayDuration);
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

        if(nextId > currentId) {
          forwardDirection = nextId - currentId;
          reverseDirection = currentId + (noOfSteps - nextId);
        }else{
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
       * @param {Object} self - Variables and methods available to this instance
       * @return {Number} direction - The direction 1 or -1
       */
      getDirection: function(id, direction, self) {

        var _animation = this;

        // If the developer has defined a direction, then use that
        if(direction !== undefined) {
          return direction;
        }

        // If a direction wasn't defined, work out the best one to use
        if(self.options.reverseAnimationsWhenNavigatingBackwards === true) {

          if(direction === undefined && self.options.cycle === true) {
            direction = _animation.getShortestDirection(id, self.currentStepId, self.noOfSteps);
          }else if(direction === undefined) {
            direction = (id < self.currentStepId) ? -1: 1;
          }
        }else{

          direction = 1;
        }

        return direction;
      },
    }

    /**
     * Add and remove Sequence events
     */
    self.manageEvent = {

      add: {

        keyNavigation: function() {

          addEventListener_cb(window, "keydown", function(e) {

            // Get the key pressed
            var keyCodeChar = parseInt(String.fromCharCode(e.keyCode));

            // Go to the numeric key pressed
            if((keyCodeChar > 0 && keyCodeChar <= self.noOfSteps) && (self.options.numericKeysGoToFrames)) {
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
        }

      },

      remove: {

      }
    }

    /**
     * Set up an instance of Sequence
     *
     * @param {Object} element - The element Sequence is attached to
     * @api public
     */
    self._init = function(element) {

      /**
       * Remove the no-JS "animate-in" class from a step
       */
      var removeNoJsClass = function(self) {

        // Look for the step with the "animate-in" class and remove the class
        for(var i = 0; i < self.steps.length; i++) {
          var element = self.steps[i];

          if((" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(" animate-in ") > -1) {
            var step = "step" + (i + 1);

            self._animation.resetInheritedSpeed(step, "animate-in", self);
            updateClassList(element, "", "animate-in");
          }
        }
      };

      // Get the element Sequence is attached to, the canvas and it's steps
      self.element = element;
      self.canvas = element.querySelectorAll(".canvas");
      self.steps = element.querySelectorAll(".canvas > li");

      // Merge developer options with defaults
      self.options = extend(defaults, options);

      // Get number of steps
      self.noOfSteps = self.steps.length;

      // Get Sequence's animation map (which elements will animate and their timings)
      self.animationMap = self._getAnimationMap.init(element);

      console.log(self.animationMap);

      // Remove the no-JS "animate-in" class from a step
      removeNoJsClass(self);

      self._firstRun = true;

      // Get the first step's ID
      var id = self.options.startingStepId;

      // Get the previous step id
      if(self.options.autoPlayDirection === 1) {
        var prevStepId = id - 1;
        self.currentStepId = (prevStepId < 1) ? self.noOfSteps: prevStepId;
      }else{
        var prevStepId = id + 1;
        self.currentStepId = (prevStepId > self.noOfSteps) ? 1: prevStepId;
      }

      // Get the previous step
      var prevStep = "step" + self.currentStepId;

      // Go to the first step
      self.goTo(id, self.options.autoPlayDirection, true);

      // Snap the previous step into position
      self._animation.domDelay(function() {
        self._animation.resetInheritedSpeed(prevStep, "animate-out", self);
      });
    }

    /**
     * Go to the next step
     *
     * @api public
     */
    self.next = function() {

      var nextStepId = self.currentStepId + 1;

      if(nextStepId > self.noOfSteps && self.options.cycle === true) {
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

      if(prevStepId < 1 && self.options.cycle === true) {
        prevStepId = self.noOfSteps;
      }

      self.goTo(prevStepId);
    }

    /**
     * Go to a specific step
     *
     * @param {Number} id - The ID of the step to go to
     * @param {Number} direction - Direction to get to the step (1 = forward, -1 = reverse)
     * @param {Boolean} ignorePhaseThreshold - if true, ignore the transitionThreshold setting and immediately go to the specified step
     * @api public
     */
    self.goTo = function(id, direction, ignorePhaseThreshold) {

      // Get the direction to navigate if one wasn't specified
      direction = self._animation.getDirection(id, direction, self);

      /**
       * Don't go to a step if:
       *
       * - It doesn't exist
       * - It is already active
       * - navigationSkip isn't allowed and an animation is active
       * - navigationSkip is allowed but the threshold is yet to expire
       * - preventReverseSkipping is enabled and the user is trying to navigate
           in a different direction to the one already active
       */
      if(
        id < 1 || id > self.noOfSteps
        || id === self.currentStepId
        || (self.options.navigationSkip === false && self.isActive === true)
        || (self.options.navigationSkip === true && self.navigationSkipThresholdActive === true)
        || (self.options.preventReverseSkipping === true && self.direction !== direction && self.isActive === true)
      ) {
        return false;
      }

      // Determine how often goTo() can be used based on navigationSkipThreshold
      // and manage step fading accordingly
      self._animation.manageNavigationSkip(self.currentStepId, id, self);

      // Sequence is now animating
      self.isActive = true;

      // Save the latest direction
      self.direction = direction;

      // Ignore the phaseThreshold (on first run for example)
      if(ignorePhaseThreshold === undefined) {
        var phaseThreshold = self.options.phaseThreshold;
      }else{
        var phaseThreshold = 0;
      }

      // Get the next and current steps, and their elements
      var nextStep = "step" + id;
      var currentStep = "step" + self.currentStepId;
      var nextStepElement = self.animationMap[nextStep].element;
      var currentStepElement = self.animationMap[currentStep].element;

      // Change the step number on the Sequence element
      self._animation.changeStep(id, self);

      // Reset the next step's elements durations to 0ms so it can be snapped into place
      self._animation.resetInheritedSpeed(nextStep, "animate-out", self);

      // Determine how long the phases will last for, as well as the total length of the step
      var stepDurations = self._animation.getStepDurations(id, nextStep, currentStep, direction);

      console.log(stepDurations)

      // Are we moving the phases forward or in reverse?
      if(direction === 1) {
        self._animation.forward(id, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, self);
      }else{
        self._animation.reverse(id, nextStep, nextStepElement, currentStep, currentStepElement, stepDurations, self);
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

        self.autoPlayTimer = setTimeout(function() {

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
     * @param {Object} self - all available public variables/methods
     * @api public
     */
    self.animationStarted = function(id) {

      // console.log("started", id);
    }

    /**
     * Callback executed when a step animation finishes
     *
     * @param {Object} self - all available public variables/methods
     * @api public
     */
    self.animationFinished = function(id) {

      console.log("finished", id);
    }


    // Set up an instance of Sequence
    self._init(element, options);




    /* --- EVENTS --- */

    if(self.options.keyNavigation === true) {

      self.manageEvent.add.keyNavigation();
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
