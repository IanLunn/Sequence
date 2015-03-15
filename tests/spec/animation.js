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
