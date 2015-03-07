/**
 * sequence._animation
 */
describe("Get direction - sequence._animation.getDirection()", function() {

  wait();

  it("should return the same direction as the one defined", function() {

    var self = {};

    expect(mySequence._animation.getDirection(1, 1, self)).toEqual(1);
    expect(mySequence._animation.getDirection(1, -1, self)).toEqual(-1);
  });


  it("should return a direction of 1 when the reverseWhenNavigatingBackwards option is false, and a direction isn't defined", function() {

    var self = {
      options: {
        reverseWhenNavigatingBackwards: false
      }
    };

    mySequence.options.reverseWhenNavigatingBackwards = false;

    expect(mySequence._animation.getDirection(1, undefined, self)).toEqual(1);
  });


  it("should return a direction of 1 when the reverseWhenNavigatingBackwards option is true, cycle is true, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward", function() {

    mySequence.options.reverseWhenNavigatingBackwards = true;
    mySequence.options.cycle = true;
    mySequence.currentStepId = 1;
    mySequence.noOfSteps = 5;

    expect(mySequence._animation.getDirection(2, undefined, self)).toEqual(1);
  });


  it("should return a direction of -1 when the reverseWhenNavigatingBackwards option is true, cycle is true, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is reverse", function() {

    mySequence.options.reverseWhenNavigatingBackwards = true;
    mySequence.options.cycle = true;
    mySequence.currentStepId = 3;
    mySequence.noOfSteps = 5;

    expect(mySequence._animation.getDirection(1, undefined, self)).toEqual(-1);
  });


  it("should return a direction of 1 when the reverseWhenNavigatingBackwards option is true, cycle is true, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward (the last slide is the currentId and the next slide ID is 1)", function() {

    mySequence.options.reverseWhenNavigatingBackwards = true;
    mySequence.options.cycle = true;
    mySequence.currentStepId = 5;
    mySequence.noOfSteps = 5;

    expect(mySequence._animation.getDirection(1, undefined, self)).toEqual(1);
  });


  it("should return a direction of -1 when the reverseWhenNavigatingBackwards option is true, cycle is false, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward (the last slide is the currentId and the next slide ID is 1)", function() {

    mySequence.options.reverseWhenNavigatingBackwards = true;
    mySequence.options.cycle = false;
    mySequence.currentStepId = 5;
    mySequence.noOfSteps = 5;

    expect(mySequence._animation.getDirection(1, undefined, self)).toEqual(-1);
  });


  it("should return a direction of 1 when the reverseWhenNavigatingBackwards option is true, cycle is false, a direction isn't defined, and the shortest direction to get from the currentId to the nextId is forward (the last slide is the currentId and the next slide ID is 1)", function() {

    mySequence.options.reverseWhenNavigatingBackwards = true;
    mySequence.options.cycle = false;
    mySequence.currentStepId = 1;
    mySequence.noOfSteps = 5;

    expect(mySequence._animation.getDirection(5, undefined, self)).toEqual(1);
  });
});
