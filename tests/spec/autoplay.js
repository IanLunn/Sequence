/**
 * sequence.autoPlay
 */
describe("autoPlay()", function() {

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
    done();
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

  it("should return a delay with the same value as options.autoPlayDelay when delay is true or options.autoPlayStartDelay is null", function() {

    expect(sequence.autoPlay.getDelay(true, null, 5000)).toEqual(5000);
  });

  it("should return a delay with the same value as options.autoPlayStartDelay when delay is true or undefined", function() {

    expect(sequence.autoPlay.getDelay(true, 250, 5000)).toEqual(250);
  });

  it("should return a delay of 0 when delay is false or undefined", function() {

    expect(sequence.autoPlay.getDelay(false, null, 5000)).toEqual(0);
    expect(sequence.autoPlay.getDelay(undefined, 250, 5000)).toEqual(0);
    expect(sequence.autoPlay.getDelay(undefined, null, 5000)).toEqual(0);
  });

  it("should return a delay of 750 when a custom delay is defined, regardless of options.autoPlayDelay and options.autoPlayStartDelay", function() {

    expect(sequence.autoPlay.getDelay(750, null, 5000)).toEqual(750);
    expect(sequence.autoPlay.getDelay(750, 250, 5000)).toEqual(750);
  });
});
