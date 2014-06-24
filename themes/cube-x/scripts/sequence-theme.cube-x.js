/*!
 * Theme Name: Cube X
 * Version: 0.1.0
 * Theme URL: http://sequencejs.com/themes/cube-x/
 *
 * A basic 3D cube that spins on the X axis
 *
 * Powered by Sequence.js - The open-source CSS animation framework.
 *
 * Author: Ian Lunn
 * Author URL: https://ianlunn.co.uk
 *
 * Cube X Sequence Theme Copyright (c) Ian Lunn 2014
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
  // phaseThreshold: 500
}

// Launch Sequence on the element, and with the options we specified above
var mySequence = sequence(sequenceElement, options);
