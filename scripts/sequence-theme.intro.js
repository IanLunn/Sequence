/*!
 * Theme Name: Intro
 * Version: 0.1.0
 * Theme URL: http://sequencejs.com/themes/intro/
 *
 * Theme used to demonstrate Sequence
 *
 * Powered by Sequence.js - The open-source CSS animation framework for creating responsive sliders, presentations, banners, and other step-based applications.
 *
 * Author: Ian Lunn
 * Author URL: http://ianlunn.co.uk/
 *
 * Intro Sequence Theme Copyright (c) Ian Lunn 2014
 * License: MIT http://opensource.org/licenses/MIT
 *
 * Sequence.js and its dependencies are copyright (c) Ian Lunn 2014 unless otherwise stated.
 */

// Get the Sequence element
var sequenceElement = document.getElementById("sequence");

// Place your Sequence options here to override defaults
// See: https://github.com/IanLunn/Sequence/blob/v2/DOCUMENTATION.md
var options = {
  autoPlay: false,
  keyNavigation: true,
  pauseOnHover: false,
  autoPlayThreshold: 3000,
  preloader: true
}

// Launch Sequence on the element, and with the options we specified above
var mySequence = sequence(sequenceElement, options);

mySequence.ready = function(sequence) {

  // var preloader = sequence.$preloader[0];
  // preloader.parentNode.removeChild(preloader);
}
