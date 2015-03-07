/**
 * sequence._animation
 */

describe("Get property support - sequence._animation.getPropertySupport()", function() {

  setup();

  it("should return a list of properties and whether the browser supports them", function() {

    var mySequence = initSequence();
    expect(mySequence._animation.getPropertySupport()).toEqual(jasmine.any(Object));
  });
});

describe("Determine if fallback mode is required - sequence._animation.requiresFallbackMode()", function() {

  setup();

  it("should be required if transitions aren't supported", function() {

    var propertySupport = {
      transitions: false,
      transformStyle: true,
      requires3d: false
    };

    var mySequence = initSequence();
    expect(mySequence._animation.requiresFallbackMode(propertySupport)).toEqual(true);
  });

  it("should be required if transitions are supported but transformStyle isn't yet the theme requires3d support", function() {

    var propertySupport = {
      transitions: true,
      transformStyle: false,
      requires3d: true
    };

    var mySequence = initSequence();
    expect(mySequence._animation.requiresFallbackMode(propertySupport)).toEqual(true);
  });

  it("should not be required if transitions are supported but transformStyle isn't yet the theme doesn't requires3d support", function() {

    var propertySupport = {
      transitions: true,
      transformStyle: false,
      requires3d: false
    };

    var mySequence = initSequence();
    expect(mySequence._animation.requiresFallbackMode(propertySupport)).toEqual(false);
  });
});

describe("Get direction - sequence._animation.getDirection()", function() {

  setup();

  it("should return the same direction as the one defined", function() {

    var mySequence = initSequence();

    expect(mySequence._animation.getDirection(1, 1, self)).toEqual(1);
    expect(mySequence._animation.getDirection(1, -1, self)).toEqual(-1);
  });


  it("should return a direction of 1 when the reverseWhenNavigatingBackwards option is false, and a direction isn't defined", function() {

    var mySequence = initSequence({
      reverseWhenNavigatingBackwards: false
    });

    expect(mySequence._animation.getDirection(1, undefined, self)).toEqual(1);
  });


  it("should return a direction of 1 when the reverseWhenNavigatingBackwards option is true, cycle is true, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward", function() {

    var mySequence = initSequence({
      reverseWhenNavigatingBackwards: true,
      cycle: true
    });

    mySequence.currentStepId = 1;
    mySequence.noOfSteps = 5;

    expect(mySequence._animation.getDirection(2, undefined, self)).toEqual(1);
  });


  it("should return a direction of -1 when the reverseWhenNavigatingBackwards option is true, cycle is true, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is reverse", function() {

    var mySequence = initSequence({
      reverseWhenNavigatingBackwards: true,
      cycle: true
    });

    mySequence.currentStepId = 3;
    mySequence.noOfSteps = 5;

    expect(mySequence._animation.getDirection(1, undefined, self)).toEqual(-1);
  });


  it("should return a direction of 1 when the reverseWhenNavigatingBackwards option is true, cycle is true, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward (the last slide is the currentId and the next slide ID is 1)", function() {

    var mySequence =   initSequence({
      reverseWhenNavigatingBackwards: true,
      cycle: true
    });

    mySequence.currentStepId = 5;
    mySequence.noOfSteps = 5;

    expect(mySequence._animation.getDirection(1, undefined, self)).toEqual(1);
  });


  it("should return a direction of -1 when the reverseWhenNavigatingBackwards option is true, cycle is false, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward (the last slide is the currentId and the next slide ID is 1)", function() {

    var mySequence = initSequence({
      reverseWhenNavigatingBackwards: true,
      cycle: false
    });

    mySequence.currentStepId = 5;
    mySequence.noOfSteps = 5;

    expect(mySequence._animation.getDirection(1, undefined, self)).toEqual(-1);
  });


  it("should return a direction of 1 when the reverseWhenNavigatingBackwards option is true, cycle is false, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward (the last slide is the currentId and the next slide ID is 1)", function() {

    var mySequence = initSequence({
      reverseWhenNavigatingBackwards: true,
      cycle: false
    });

    mySequence.currentStepId = 1;
    mySequence.noOfSteps = 5;

    expect(mySequence._animation.getDirection(5, undefined, self)).toEqual(1);
  });
});
