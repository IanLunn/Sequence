/**
 * Theme Name: Intro
 * Version: 1.0.0
 * Theme URL: http://sequencejs.com/themes/intro/
 *
 * The Sequence.js introduction theme used to briefly describe how Sequence.js works
 *
 * This theme is powered by Sequence.js - The
 * responsive CSS animation framework for creating unique sliders,
 * presentations, banners, and other step-based applications.
 *
 * Author: Ian Lunn
 * Author URL: http://ianlunn.co.uk/
 *
 * Theme License: http://sequencejs.com/licenses/#free-theme
 * Sequence.js Licenses: http://sequencejs.com/licenses/
 *
 * Copyright © 2015 Ian Lunn Design Limited unless otherwise stated.
 */

// Get the Sequence element
var sequenceElement = document.getElementById("sequence"),
    sequenceViewCodeButtons = document.querySelectorAll(".seq-view-code");

// Place your Sequence options here to override defaults
// See: http://sequencejs.com/documentation/#options
var options = {
  phaseThreshold: 100,
  preloader: true,
  reverseWhenNavigatingBackwards: true,
  fallback: {
    speed: 300
  }
}

// Launch Sequence on the element, and with the options we specified above
var mySequence = sequence(sequenceElement, options);



var codePane = {
  $openElement: undefined,
  $openButton: undefined,

  getTarget: function(e) {
    var evt,
        targetElement;

    evt = e || window.event; // get window.event if argument is falsy (in IE)

    // get srcElement if target is falsy (IE)
    targetElement = evt.target || evt.srcElement;

    return targetElement;
  },

  getWindowSize: function($el) {

    if (typeof getComputedStyle !== 'undefined') {
      return window.getComputedStyle($el, ':after').getPropertyValue('content').replace(/\"/g, '');
    } else {
      return false;
    }
  },

  init: function(viewCodeButtons) {

    var $step,
        $codePane,
        $codePaneButton,
        $pagination = mySequence.$pagination.elements[0],
        $canvas = mySequence.$canvas,
        targetElement;

    // Toggle a code pane when its button is clicked
    mySequence.utils.addEvent(sequenceElement, "click", function(e) {

      // Don't use this functionality in large layout
      if (codePane.getWindowSize($canvas) === "large") {
        return;
      }

      targetElement = codePane.getTarget(e);

      if (targetElement.className === "seq-view-code") {
        /* Toggle the codepane when the view-code button is clicked */
        $codePane = targetElement.parentNode;
        $step = $codePane.parentNode;
        $codePaneButton = targetElement;

        codePane.toggle($step, $codePane, $codePaneButton);
      } else if (targetElement.nodeName === "LI") {
        /* Close the codepane when clicking on the step */
        codePane.hide($step, true, codePane.$openElement);
      }
    });

    // Close a code pane when its pagination link is clicked
    mySequence.utils.addEvent($pagination, "click", function(e) {

      var $parentLink,
          stepNo,
          $step;

      targetElement = codePane.getTarget(e);

      // Don't use this functionality in large layout
      if (codePane.getWindowSize($canvas) === "large") {
        return;
      }

      // Get the pagination link being clicked
      $parentLink = (targetElement.parentNode.nodeName === "LI") ? targetElement.parentNode : targetElement.parentNode.parentNode;

      // Get the step number of the clicked pagination link
      stepNo = [].indexOf.call ($parentLink.parentNode.children, $parentLink);

      // Get the related step
      $step = mySequence.$steps[stepNo];

      // Hide the code pane
      codePane.hide($step, true);
    });
  },

  // Show/hide a code pane based on current state
  toggle: function($step, $codePane, $button) {

    var isOpen = $codePane.getAttribute("data-is-open");

    if (isOpen !== "true") {
      codePane.show($step, $codePane, $button);
    } else {
      codePane.hide($step, true, $codePane, $button);
    }
  },

  // Show a code pane
  // Use a data-attribute to save state
  // Save the open element so it can be closed when a non-code-pane
  // element is clicked
  show: function($step, $codePane, $button) {

    mySequence.utils.addClass($step, "seq-code-pane-open");
    mySequence.utils.removeClass($step, "seq-code-pane-snap-shut");

    $button.innerHTML = '<i class="fa fa-angle-double-down"></i> Hide Code';

    $codePane.setAttribute("data-is-open", true);
    codePane.$openElement = $codePane;
    codePane.$openButton = $button;
  },

  /*
   * Hide a code pane
   *
   * $step - The step element the code pane belongs to
   * animate - Whether the code pane should be animated. No animation is used for when the code pane is automatically closed because the user navigated away without manually closing it
   * $codePane - The code pane element
   * $button - The button that opens/closes the code pane
   */
  hide: function($step, animate, $codePane, $button) {

    if ($codePane === undefined) {
      $codePane = codePane.$openElement;
    }

    // If there is no open element, don't continue
    if (codePane.$openElement === undefined) {
      return;
    }

    if ($button === undefined) {
      $button = codePane.$openButton;
    }

    $step = $codePane.parentNode;

    // Prevent the code pane from animating, snap shut instead
    if (animate === false) {
      mySequence.utils.addClass($step, "seq-code-pane-snap-shut");
    }

    mySequence.utils.removeClass($step, "seq-code-pane-open");

    $button.innerHTML = '<i class="fa fa-angle-double-up"></i> Show Code';

    $codePane.setAttribute("data-is-open", false);
    codePane.$openElement = undefined;
    codePane.$openButton = undefined;
  }
}

mySequence.ready = function() {

  // When Sequence.js is ready
  codePane.init(sequenceViewCodeButtons);
};

mySequence.animationStarted = function(id, sequence) {

  // When animation starts, close any open code panes
  var $currentStep = sequence.$steps[sequence.currentStepId - 1];

  codePane.hide($currentStep, false);
}
