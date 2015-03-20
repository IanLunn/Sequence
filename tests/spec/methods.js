/**
 * Tests for small methods
 */
describe("next()", function() {

  var sequence;

  // Set up Sequence and wait for it to be ready
  beforeAll(function(done) {

    appendSequence();

    sequence = initSequence({
      autoPlay: false,
      cycle: true
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

  it("should go to the next step and return the ID of that step", function() {

    sequence.currentStepId = 1;
    expect(sequence.next()).toEqual(2);
  });

  it("should go to the first step if the current step is the last and the cycle option is enabled", function() {

    sequence.currentStepId = 3;
    expect(sequence.next()).toEqual(1);
  });

  it("should prevent next() if on the last step and the cycle option is disabled", function() {

    sequence.options.cycle = false;
    sequence.currentStepId = 3;
    expect(sequence.next()).toEqual(false);
  });
});

describe("prev()", function() {

  var sequence;

  // Set up Sequence and wait for it to be ready
  beforeAll(function(done) {

    appendSequence();

    sequence = initSequence({
      autoPlay: false,
      cycle: true,
      startingStepId: 3
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

  it("should go to the previous step and return the ID of that step", function() {

    sequence.currentStepId = 2;
    expect(sequence.prev()).toEqual(1);
  });

  it("should go to the last step if the current step is the first and the cycle option is enabled", function() {

    sequence.currentStepId = 1;
    expect(sequence.prev()).toEqual(3);
  });

  it("should prevent prev() if on the first step and the cycle option is disabled", function() {

    sequence.options.cycle = false;
    sequence.currentStepId = 1;
    expect(sequence.prev()).toEqual(false);
  });
});

describe("toggleAutoPlay()", function() {

  var sequence;

    // Set up Sequence and wait for it to be ready
    beforeAll(function(done) {

      appendSequence();

      sequence = initSequence({
        autoPlay: true
      });

      sequence.ready = function() {
        done();
      };
    });

  it("should stop auoPlay and return false if autoPlay was active", function() {

      sequence.isAutoPlaying = true;
      expect(sequence.toggleAutoPlay()).toEqual(false);
  });

  it("should start auoPlay and return true if autoPlay was inactive", function() {

      sequence.stop();
      expect(sequence.toggleAutoPlay()).toEqual(true);
  });

});
