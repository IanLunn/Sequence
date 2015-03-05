/*!
 * Theme Name: Test Theme
 * Version: 0.1.0
 * Theme URL:
 *
 * Used for Testing Sequence
 *
 * Powered by Sequence.js - The open-source CSS animation framework.
 *
 * Author: Ian Lunn
 * Author URL: https://ianlunn.co.uk/
 *
 * Test Theme Sequence Theme Copyright (c) Ian Lunn 2014
 * License: MIT http://opensource.org/licenses/MIT
 *
 * Sequence.js and its dependencies are copyright (c) Ian Lunn 2014 unless otherwise stated.
 */

// Get the Sequence element
var sequenceElement = document.getElementById("sequence");

// Place your Sequence options here to override defaults
// See: https://github.com/IanLunn/Sequence/blob/v2/DOCUMENTATION.md
var options = {
  animateCanvas: true,
  autoPlay: true,
  autoPlayThreshold: 1000,
  phaseThreshold: false,
  // hashTags: true,
  // startingStepId: 2,
  keyNavigation: true,
  // fadeStepWhenSkipped: true
  startingStepAnimatesIn: false
}

var mySequence,
    pauseButton = document.getElementById("pause"),
    initButton = document.getElementById("init"),
    destroyButton = document.getElementById("destroy");

// Launch Sequence on the element, and with the options we specified above
function init() {
  if (mySequence === undefined) {
    mySequence = sequence(sequenceElement, options);

    mySequence.paused = function(self) {
      pauseButton.innerHTML = "Unpause";
    }

    mySequence.unpaused = function() {
      pauseButton.innerHTML = "Pause";
    }

    if (mySequence.options.autoPlay === true) {
      mySequence.unpaused();
    } else {
      mySequence.paused();
    }
  }
}

init();

mySequence._utils.addEvent(initButton, "click", function() {
  init();
});

mySequence._utils.addEvent(destroyButton, "click", function() {
  if (mySequence !== undefined) {
    mySequence.destroy();
    mySequence = undefined;
  }
});
