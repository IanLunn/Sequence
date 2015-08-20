/**
 * sequence.animation
 */

describe("animation.getPropertySupport()", function() {

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

  it("should return a list of properties and whether the browser supports them", function() {
    expect(sequence.animation.getPropertySupport()).toEqual(jasmine.any(Object));
  });
});

describe("animation.requiresFallbackMode()", function() {

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

  it("should put Sequence in fallbackMode if transitions aren't supported", function() {

    var propertySupport = {
      transitions: false
    };
    expect(sequence.animation.requiresFallbackMode(propertySupport)).toEqual(true);
  });
});

describe("animation.getReversePhaseDelay()", function() {

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


  it("should return a next reversePhaseDelay of 1000 when the currentPhaseTotal is 2000, nextPhaseTotal is 1000, phaseThreshold is false, ignorePhaseThresholdWhenSkipped is false, and Sequence.js isn't animating", function() {

    var currentPhaseTotal = 2000,
        nextPhaseTotal = 1000,
        phaseThresholdOption = false,
        ignorePhaseThresholdWhenSkipped = false,
        isAnimating = false;

    expect(sequence.animation.getReversePhaseDelay(currentPhaseTotal, nextPhaseTotal, phaseThresholdOption, ignorePhaseThresholdWhenSkipped, isAnimating)).toEqual(jasmine.objectContaining({
      next: 1000,
      current: 0
    }));
  });


  it("should return a current reversePhaseDelay of 1000 when the currentPhaseTotal is 1000, nextPhaseTotal is 2000, phaseThreshold is false, ignorePhaseThresholdWhenSkipped is false, and Sequence.js isn't animating", function() {

    var currentPhaseTotal = 1000,
        nextPhaseTotal = 2000,
        phaseThresholdOption = false,
        ignorePhaseThresholdWhenSkipped = false,
        isAnimating = false;

    expect(sequence.animation.getReversePhaseDelay(currentPhaseTotal, nextPhaseTotal, phaseThresholdOption, ignorePhaseThresholdWhenSkipped, isAnimating)).toEqual(jasmine.objectContaining({
      next: 0,
      current: 1000
    }));
  });


  it("should return no reversePhaseDelay when the currentPhaseTotal and nextPhaseTotal are the same, phaseThreshold is false, ignorePhaseThresholdWhenSkipped is false, and Sequence.js isn't animating", function() {

    var currentPhaseTotal = 1000,
        nextPhaseTotal = 1000,
        phaseThresholdOption = false,
        ignorePhaseThresholdWhenSkipped = false,
        isAnimating = false;

    expect(sequence.animation.getReversePhaseDelay(currentPhaseTotal, nextPhaseTotal, phaseThresholdOption, ignorePhaseThresholdWhenSkipped, isAnimating)).toEqual(jasmine.objectContaining({
      next: 0,
      current: 0
    }));
  });


  it("should not return a phaseThreshold when phaseThreshold is true", function() {

    var currentPhaseTotal = 2000,
        nextPhaseTotal = 1000,
        phaseThresholdOption = true,
        ignorePhaseThresholdWhenSkipped = false,
        isAnimating = false;

    expect(sequence.animation.getReversePhaseDelay(currentPhaseTotal, nextPhaseTotal, phaseThresholdOption, ignorePhaseThresholdWhenSkipped, isAnimating)).toEqual(jasmine.objectContaining({
      next: 0,
      current: 0
    }));
  });


  it("should return a phaseThreshold when ignorePhaseThresholdWhenSkipped is false, regardless of whether Sequence is animating", function() {

    var currentPhaseTotal = 2000,
        nextPhaseTotal = 1000,
        phaseThresholdOption = false,
        ignorePhaseThresholdWhenSkipped = false,
        isAnimating = true;

    // When animating
    expect(sequence.animation.getReversePhaseDelay(currentPhaseTotal, nextPhaseTotal, phaseThresholdOption, ignorePhaseThresholdWhenSkipped, isAnimating)).toEqual(jasmine.objectContaining({
      next: 1000,
      current: 0
    }));

    // When not animating
    isAnimating = false;

    expect(sequence.animation.getReversePhaseDelay(currentPhaseTotal, nextPhaseTotal, phaseThresholdOption, ignorePhaseThresholdWhenSkipped, isAnimating)).toEqual(jasmine.objectContaining({
      next: 1000,
      current: 0
    }));
  });


  it("should not return a phaseThreshold when ignorePhaseThresholdWhenSkipped is true, and Sequence is animating", function() {

    var currentPhaseTotal = 2000,
        nextPhaseTotal = 1000,
        phaseThresholdOption = false,
        ignorePhaseThresholdWhenSkipped = true,
        isAnimating = true;

    expect(sequence.animation.getReversePhaseDelay(currentPhaseTotal, nextPhaseTotal, phaseThresholdOption, ignorePhaseThresholdWhenSkipped, isAnimating)).toEqual(jasmine.objectContaining({
      next: 0,
      current: 0
    }));
  });
});

describe("animation.getDirection()", function() {

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

  it("should return 1 when no direction is defined", function() {

    var id = 2,
        definedDirection = undefined,
        currentStepId = 1,
        noOfSteps = 3,
        isFallbackMode = false,
        reverseWhenNavigatingBackwardsOption = true,
        cycleOption = true;

    expect(sequence.animation.getDirection(id, definedDirection, currentStepId, noOfSteps, isFallbackMode, reverseWhenNavigatingBackwardsOption, cycleOption)).toEqual(1);
  });


  it("should return 1 when going from the last step to the first", function() {

    var id = 1,
        definedDirection = 1,
        currentStepId = 5,
        noOfSteps = 5,
        isFallbackMode = false,
        reverseWhenNavigatingBackwardsOption = true,
        cycleOption = true;

    expect(sequence.animation.getDirection(id, definedDirection, currentStepId, noOfSteps, isFallbackMode, reverseWhenNavigatingBackwardsOption, cycleOption)).toEqual(1);
  });


  it("should return 1 when the reverseWhenNavigatingBackwards option is disabled", function() {

    var id = 1,
        definedDirection = 1,
        currentStepId = 5,
        noOfSteps = 5,
        isFallbackMode = false,
        reverseWhenNavigatingBackwardsOption = false,
        cycleOption = true;

    expect(sequence.animation.getDirection(id, definedDirection, currentStepId, noOfSteps, isFallbackMode, reverseWhenNavigatingBackwardsOption, cycleOption)).toEqual(1);
  });


  it("should return 1 when in fallback mode", function() {

    var id = 1,
        definedDirection = 1,
        currentStepId = 5,
        noOfSteps = 5,
        isFallbackMode = true,
        reverseWhenNavigatingBackwardsOption = true,
        cycleOption = true;

    expect(sequence.animation.getDirection(id, definedDirection, currentStepId, noOfSteps, isFallbackMode, reverseWhenNavigatingBackwardsOption, cycleOption)).toEqual(1);
  });

  it("should return 1 when the step being navigated to is ahead of the current step", function() {

    var id = 2,
        definedDirection = undefined,
        currentStepId = 1,
        noOfSteps = 5,
        isFallbackMode = false,
        reverseWhenNavigatingBackwardsOption = true,
        cycleOption = true;

    expect(sequence.animation.getDirection(id, definedDirection, currentStepId, noOfSteps, isFallbackMode, reverseWhenNavigatingBackwardsOption, cycleOption)).toEqual(1);
  });


  it("should return -1 when the step being navigated to is before the current step", function() {

    var id = 2,
        definedDirection = undefined,
        currentStepId = 3,
        noOfSteps = 5,
        isFallbackMode = false,
        reverseWhenNavigatingBackwardsOption = true,
        cycleOption = true;

    expect(sequence.animation.getDirection(id, definedDirection, currentStepId, noOfSteps, isFallbackMode, reverseWhenNavigatingBackwardsOption, cycleOption)).toEqual(-1);
  });
});
