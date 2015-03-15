/**
 * Test initiation of Sequence
 */
describe("Sequence initiation", function() {

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

  afterAll(function(done) {
    removeSequence();
    SetTimeout(function() {
      resetSequence(sequence);
      done();
    }, 500);
  });

  it("should return the sequence object", function() {

    expect(sequence).toEqual(jasmine.any(Object));
  });

  it("should add data-seq-enabled to the element", function() {
    expect(parseInt(sequence.$container.dataset.seqEnabled)).toEqual(jasmine.any(Number));
  });

  it("should merge and override default options with developer options (change autoPlay from the default of false to true)", function() {

    expect(sequence.options.autoPlay).toEqual(true);
  });

  it("should expose properties", function() {

    expect(sequence.options).toEqual(jasmine.any(Object));
    expect(sequence.$container.id).toEqual("sequence");
    expect(sequence.$screen.classList.contains("seq-screen")).toEqual(true);
    expect(sequence.$canvas.classList.contains("seq-canvas")).toEqual(true);
    expect(sequence.$steps).toEqual(jasmine.any(Array));

    expect(sequence.isAnimating).not.toEqual(undefined);
    expect(sequence.isReady).not.toEqual(undefined);
    expect(sequence.noOfSteps).not.toEqual(undefined);
    expect(sequence.stepProperties).not.toEqual(undefined);
    expect(sequence.propertySupport).not.toEqual(undefined);
    expect(sequence.isFallbackMode).not.toEqual(undefined);
    expect(sequence.firstRun).not.toEqual(undefined);
    expect(sequence.currentStepId).not.toEqual(undefined);
    expect(sequence.isReady).not.toEqual(undefined);
  });
});

describe("Sequence multiple instantiations", function() {

  var sequence;

  // Set up Sequence and wait for it to be ready
  beforeAll(function(done) {

    appendSequence();

    // Init Sequence on <div id="sequence"></div>
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

  it("should prevent a second instantiation on the same element and instead return the object already attached to the element", function() {

    // Get the instanceId added the first time on the element
    var originalInstanceId = parseInt(sequence.$container.dataset.seqEnabled);
    expect(originalInstanceId).toEqual(jasmine.any(Number));

    // Init Sequence AGAIN on <div id="sequence"></div>
    sequence = initSequence({}, "sequence");

    // Make sure the same instanceId is returned
    expect(parseInt(sequence.$container.dataset.seqEnabled)).toEqual(originalInstanceId);
  });
});
