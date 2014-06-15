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
  animateCanvas: false,
  phaseThreshold: false,
  reverseWhenNavigatingBackwards: true
}

var mySequence;

// Launch Sequence on the element, and with the options we specified above
mySequence = sequence(sequenceElement, options);

var pauseButton = document.getElementById("pause");
var initButton = document.getElementById("init");
var destroyButton = document.getElementById("destroy");

mySequence.paused = function() {
  pauseButton.innerHTML = "Unpause";
}

mySequence.unpaused = function() {
  pauseButton.innerHTML = "Pause";
}

initButton.addEventListener("click", function() {
  mySequence = sequence(sequenceElement, options);
});

destroyButton.addEventListener("click", function() {
  
  if (mySequence !== undefined) {
    mySequence.destroy();
    mySequence = undefined;
  }
});
