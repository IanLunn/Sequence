/**
 * Append a Sequence element to the DOM for testing and set up other functions
 * required for testing
 */

var done = function() {};

var appendSequence,
    initSequence;

appendSequence = function() {

  var sequenceHtml = '<button class="seq-prev">Prev</button><button id="pause" class="seq-pause">Pause</button><button id="next" class="seq-next custom-next">Next</button><div class="seq-pagination"><button>1</button><button>2</button><button>3</button></div><div id="sequence"><div class="seq-screen"><ul class="seq-canvas"><li><div class="box box1">Box 1</div></li><li><div class="box box2">Box 2</div></li><li><div class="box box3">Box 3</div></li></ul></div></div>';

  document.body.innerHTML = sequenceHtml;
};

initSequence = function(options) {

  if (options === undefined) {
    options = {};
  }

  var sequenceElement = document.getElementById("sequence"),
      mySequence = sequence(sequenceElement, options);

  return mySequence;
}
