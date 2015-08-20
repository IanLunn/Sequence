/**
 * sequence.autoPlay
 */
describe("autoPlay", function() {

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

  it("should allow autoPlay to be started once, then prevent autoPlay from being started again when already active", function() {

    // Start once then try starting again
    expect(sequence.autoPlay.start()).toEqual(true);
    expect(sequence.autoPlay.start()).toEqual(false);
  });
});

describe("autoPlay.getDelay()", function() {

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

  it("should return a delay with the same value as options.autoPlayInterval when delay is true or options.autoPlayDelay is null", function() {

    expect(sequence.autoPlay.getDelay(true, null, 5000)).toEqual(5000);
  });

  it("should return a delay with the same value as options.autoPlayDelay when delay is true or undefined", function() {

    expect(sequence.autoPlay.getDelay(true, 250, 5000)).toEqual(250);
  });

  it("should return a delay of 0 when delay is false or undefined", function() {

    expect(sequence.autoPlay.getDelay(false, null, 5000)).toEqual(0);
    expect(sequence.autoPlay.getDelay(undefined, 250, 5000)).toEqual(0);
    expect(sequence.autoPlay.getDelay(undefined, null, 5000)).toEqual(0);
  });

  it("should return a delay of 750 when a custom delay is defined, regardless of options.autoPlayInterval and options.autoPlayDelay", function() {

    expect(sequence.autoPlay.getDelay(750, null, 5000)).toEqual(750);
    expect(sequence.autoPlay.getDelay(750, 250, 5000)).toEqual(750);
  });
});

describe("autoPlay.stop()", function() {
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

  it("should stop autoPlay if the autoPlay option is enabled and active", function() {

    sequence.options.autoPlay = true;
    sequence.isAutoPlaying = true;

    expect(sequence.autoPlay.stop()).toEqual(true);
  });

  it("should not stop autoPlay if it doesn't need to (because the autoPlay option is disabled)", function() {

    sequence.options.autoPlay = false;

    expect(sequence.autoPlay.stop()).toEqual(false);
  });

  it("should not stop autoPlay if it doesn't need to (because autoPlay isn't active anyway)", function() {

    sequence.isAutoPlaying = false;

    expect(sequence.autoPlay.stop()).toEqual(false);
  });
});


describe("autoPlay.unpause() / autoPlay.pause()", function() {
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

  it("should unpause autoPlay if autoPlay was previously paused", function() {

    expect(sequence.autoPlay.unpause()).toEqual(false);

    sequence.isAutoPlayPaused = true;
    expect(sequence.autoPlay.unpause()).toEqual(true);
  });

  it("should pause autoPlay if autoPlay was previously unpaused", function() {

    expect(sequence.autoPlay.pause()).toEqual(true);

    sequence.isAutoPlayPaused = true;
    expect(sequence.autoPlay.pause()).toEqual(false);
  });
});
