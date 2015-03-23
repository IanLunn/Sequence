/*!
 * Theme Name: Basic
 * Version: 0.1.0
 * Theme URL: http://sequencejs.com/themes/basic/
 *
 * A simple theme that slides side-to-side
 *
 * Powered by Sequence.js - The open-source CSS animation framework for creating
 * responsive sliders, presentations, banners, and other step-based applications.
 *
 * Author: Ian Lunn
 * Author URL: http://ianlunn.co.uk/
 *
 * Basic Sequence Theme Copyright (c) Ian Lunn 2014
 * License: MIT http://opensource.org/licenses/MIT
 *
 * Sequence.js and its dependencies are copyright (c) Ian Lunn 2014 unless otherwise stated.
 */

// Get the Sequence element
var sequenceElement = document.getElementById("sequence");

// Place your Sequence options here to override defaults
// See: http://www.sequencejs.com/developers/documentation/
var options = {
  startingStepAnimatesIn: true,
  autoPlay: true,
  phaseThreshold: 500,
  preloader: true,
  reverseWhenNavigatingBackwards: false,
  fadeStepWhenSkipped: false,
  keyNavigation: true
}

// Launch Sequence on the element, and with the options we specified above
var mySequence = sequence(sequenceElement, options);
