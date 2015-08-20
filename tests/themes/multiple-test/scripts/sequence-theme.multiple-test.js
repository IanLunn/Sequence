/*!
 * Theme Name: Multiple Test
 * Version: 0.1.0
 * Theme URL: http://sequencejs.com/themes/multiple-test/
 *
 * A theme to test multiple instances
 *
 * Powered by Sequence.js - The open-source CSS animation framework.
 *
 * Author: Ian Lunn
 * Author URL: https://ianlunn.co.uk/
 *
 * Multiple Test Sequence Theme Copyright (c) Ian Lunn 2014
 * License: MIT http://opensource.org/licenses/MIT
 *
 * Sequence.js and its dependencies are copyright (c) Ian Lunn 2014 unless otherwise stated.
 */

// Get the Sequence elements
var sequenceElement1 = document.getElementById("sequence1");
var sequenceElement2 = document.getElementById("sequence2");

// Place your Sequence options here to override defaults
// See: https://github.com/IanLunn/Sequence/blob/v2/DOCUMENTATION.md
var options = {
  keyNavigation: true,
  autoPlay: false
}

// Launch Sequence on the elements, and with the options we specified above
var mySequence1 = sequence(sequenceElement1, options);
var mySequence2 = sequence(sequenceElement2, options);

function updateButtons(buttons, text) {

  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.innerHTML = text;
  }
}

mySequence1.stopped = function() {
  updateButtons(mySequence1.$autoPlay, "Start");
}

mySequence1.started = function() {
  updateButtons(mySequence1.$autoPlay, "Stop");
}

mySequence2.stopped = function() {
  updateButtons(mySequence2.$autoPlay, "Start");
}

mySequence2.started = function() {
  updateButtons(mySequence2.$autoPlay, "Stop");
}
