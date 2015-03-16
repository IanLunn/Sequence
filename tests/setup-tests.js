/**
 * Append a Sequence element to the DOM for testing and set up other functions
 * required for testing
 */

var done = function() {};

var appendSequence,
    resetSequence,
    initSequence;

appendSequence = function() {

  var sequenceHtml = '<div id="test-container"><button class="seq-prev">Prev</button><button id="pause" class="seq-pause">Pause</button><button id="next" class="seq-next custom-next">Next</button><div class="seq-pagination"><button>1</button><button>2</button><button>3</button></div><div id="sequence"><div class="seq-screen"><ul class="seq-canvas"><li id="step1" data-seq-hashtag="step1attr"><div class="box box1">Box 1 </div></li><li id="step2" data-seq-hashtag="step2attr" class="seq-in"><div class="box box2">Box 2 </div></li><li id="step3" data-seq-hashtag="step3attr"><div class="box box3">Box 3</div></li></ul></div></div></div>';

  document.body.innerHTML = sequenceHtml;
};

resetSequence = function(sequence) {
  sequence.destroy();
};

removeSequence = function() {
  var testContainer = document.getElementById("test-container");
  testContainer.parentNode.removeChild(testContainer);
};

initSequence = function(options) {

  if (options === undefined) {
    options = {};
  }

  var sequenceElement = document.getElementById("sequence"),
      mySequence = sequence(sequenceElement, options);

  return mySequence;
};
