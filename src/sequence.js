/*
 * Sequence
 * Description of the module
 * @link https://github.com/IanLunn/sequence
 * @author IanLunn
 * @version 2.0.0
 * @license https://github.com/IanLunn/sequence/blob/master/LICENSE
 * @copyright IanLunn
 */

;(function (global) { function defineSequence(Hammer) {

  // ---------------------------------------------------------------------------

  'use strict';


  /**
   * Description
   *
   * @param {}
   * @return {}
   * @api private
   */
  function privateDo() {
    console.log("private do");
  }

  /**
   * @param {Object} element - the element Sequence is bound to
   * @param {Object} options - this instances options
   * @returns {Object}
   * @api public
   */
  function sequence(element, options) {

    var self = {};
    self.element = element;
    self.options = "hi";

    Hammer(element).on("dragleft", function() {
      alert('dragged!');
    });

    privateDo();

    self.publicDo = function() {
      console.log("public do," + element);
    }

    return self;
  }

  /**
   * Expose sequence
   */
  return sequence;

  // ---------------------------------------------------------------------------

  } if(typeof define === 'function' && define.amd) {
      // amd anonymous module registration
      define(['third-party/hammer.min'], defineSequence);
  }else{
    // browser global
    global.sequence = defineSequence(Hammer);
  }
}(this));
