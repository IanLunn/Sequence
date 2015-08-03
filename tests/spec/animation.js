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

  it("should return the same direction as the one defined", function() {

    sequence.options.reverseWhenNavigatingBackwards = true;
    sequence.options.cycle = true;

    expect(sequence.animation.getDirection(1, 1)).toEqual(1);
    expect(sequence.animation.getDirection(1, -1)).toEqual(-1);
  });


  it("should return a direction of 1 when the reverseWhenNavigatingBackwards option is disbaled, fallbackMode is disabled, and a direction isn't defined", function() {

    sequence.options.reverseWhenNavigatingBackwards = false;
    sequence.options.cycle = true;

    sequence.isFallbackMode = true;

    expect(sequence.animation.getDirection(1, undefined)).toEqual(1);
  });


  it("should return a direction of 1 when reverseWhenNavigatingBackwards and cycle options are enabled, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward", function() {

    sequence.options.reverseWhenNavigatingBackwards = true;
    sequence.options.cycle = true;

    sequence.currentStepId = 1;
    sequence.noOfSteps = 5;

    expect(sequence.animation.getDirection(2, undefined)).toEqual(1);
  });


  it("should return a direction of -1 when the reverseWhenNavigatingBackwards and cycle options are enabled, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is backwards", function() {

    sequence.options.reverseWhenNavigatingBackwards = true;
    sequence.options.cycle = true;

    sequence.currentStepId = 3;
    sequence.noOfSteps = 5;

    expect(sequence.animation.getDirection(1, undefined)).toEqual(-1);
  });


  it("should return a direction of 1 when reverseWhenNavigatingBackwards and cycle options are enabled, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward (the last slide is the currentId and the next slide ID is 1)", function() {

    sequence.options.reverseWhenNavigatingBackwards = true;
    sequence.options.cycle = true;

    sequence.currentStepId = 5;
    sequence.noOfSteps = 5;

    expect(sequence.animation.getDirection(1, undefined)).toEqual(1);
  });


  it("should return a direction of -1 when reverseWhenNavigatingBackwards is enabled, cycle is disabled, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward (the last slide is the currentId and the next slide ID is 1)", function() {

    sequence.options.reverseWhenNavigatingBackwards = true;
    sequence.options.cycle = false;

    sequence.currentStepId = 5;
    sequence.noOfSteps = 5;

    expect(sequence.animation.getDirection(1, undefined)).toEqual(-1);
  });


  it("should return a direction of 1 when reverseWhenNavigatingBackwards is enabled, cycle is disabled, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward (the last slide is the currentId and the next slide ID is 1)", function() {

    sequence.options.reverseWhenNavigatingBackwards = true;
    sequence.options.cycle = false;

    sequence.currentStepId = 1;
    sequence.noOfSteps = 5;

    expect(sequence.animation.getDirection(5, undefined)).toEqual(1);
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
