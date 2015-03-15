/**
 * sequence.canvas
 */
describe("canvas getSteps()", function() {

  var sequence;

  // Set up Sequence and wait for it to be ready
  beforeAll(function(done) {

    appendSequence();

    sequence = initSequence();

    sequence.ready = function() {
      done();
    };

  });

  afterAll(function(done) {
    removeSequence();
    SetTimeout(function() {
      resetSequence(sequence);
      done();
    }, 500);
  });

  it("should return an array of HTML elements being used as steps", function() {

    var canvas = sequence.$canvas;

    expect(sequence.canvas.getSteps(canvas)).toEqual(jasmine.any(Array));
    expect(sequence.canvas.getSteps(canvas).length).not.toEqual(0);
  });

});

describe("canvas move()", function() {

  var sequence;

  // Set up Sequence and wait for it to be ready
  beforeAll(function(done) {

    appendSequence();

    sequence = initSequence({
      animateCanvas: true
    });

    sequence.ready = function() {
      done();
    };

  });

  afterAll(function(done) {
    removeSequence();
    SetTimeout(function() {
      resetSequence(sequence);
      done();
    }, 500);
  });

  it("should return false when the animateCanvas option is disabled and true when the canvas was successfully moved", function() {

    sequence.options.animateCanvas = false;
    expect(sequence.canvas.move(1, true)).toEqual(false);

    sequence.options.animateCanvas = true;
    expect(sequence.canvas.move(1, true)).toEqual(true);
  });

});

describe("canvas move()", function() {

  var sequence;

  // Set up Sequence and wait for it to be ready
  beforeAll(function(done) {

    appendSequence();

    sequence = initSequence();

    sequence.ready = function() {
      done();
    };

  });

  afterAll(function(done) {
    removeSequence();
    SetTimeout(function() {
      resetSequence(sequence);
      done();
    }, 500);
  });

  it("removeNoJsClass() should remove the No-JS class from any step that was given it", function() {

    var step2 = document.getElementById("step2");
    expect(step2.classList.length).toEqual(0);
  });

});
