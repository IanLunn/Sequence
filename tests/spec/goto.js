/**
 * sequence.goTo()
 */
describe("goTo()", function() {

  var sequence;

  // Set up Sequence and wait for it to be ready
  beforeAll(function(done) {

    appendSequence();

    sequence = initSequence({
      autoPlay: false
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

  it("should prevent going to the same step already being viewed", function() {

    setTimeout(function() {
      sequence.goTo(1);
      expect(sequence.goTo(1)).toEqual(false);
    }, 100);

  });

  it("should prevent going to a non-existent step", function() {

    expect(sequence.goTo(5)).toEqual(false);
    expect(sequence.goTo(-1)).toEqual(false);
  });

  it("should prevent going to a step whilst another is animating and navigationSkip is disabled", function() {

    sequence.options.navigationSkip = false;
    sequence.isAnimating = true;

    expect(sequence.goTo(2)).toEqual(false);
  });

  it("should prevent going to a step if the navigationSkipThreshold is active", function() {

    sequence.options.navigationSkip = true;
    sequence.navigationSkipThresholdActive = true;

    expect(sequence.goTo(2)).toEqual(false);
  });
});
