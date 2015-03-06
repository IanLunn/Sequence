var done = function() {};

var wait = function() {
  beforeEach(function(done) {
    setTimeout(function() {
      done();
    }, 50);
  });
};

describe("Get UI elements - sequence._ui.getElements()", function() {

  it("should get a default element (.seq-next)", function() {

    var nextButton = mySequence._ui.getElements("nextButton", true);
    var expectedNextButton = document.querySelectorAll(".seq-next");

    expect(nextButton).toEqual([expectedNextButton[0]]);
  });

  it("should get a custom element via a CSS Selector (.custom-next)", function() {

    var nextButton = mySequence._ui.getElements("nextButton", ".custom-next");
    var expectedNextButton = document.querySelectorAll(".custom-next");

    expect(nextButton).toEqual([expectedNextButton[0]]);
  });

  it("should get a custom element via an ID Selector (#next)", function() {

    var nextButton = mySequence._ui.getElements("nextButton", "#next");
    var expectedNextButton = document.querySelectorAll("#next");

    expect(nextButton).toEqual([expectedNextButton[0]]);
  });
});

describe("Get direction - sequence._animation.getDirection()", function() {

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

describe("Prevent going to a step - sequence.goTo()", function() {

  wait();

  it("should prevent going to the same step already being viewed", function(done) {

    expect(mySequence.goTo(1)).toEqual(false);
    done();
  });


  it("should prevent going to a non-existent step", function() {

    expect(mySequence.goTo(5)).toEqual(false);
    expect(mySequence.goTo(-1)).toEqual(false);
  });


  it("should prevent going to a step whilst another is animating and navigationSkip is false", function() {

    mySequence.options.navigationSkip = false;
    mySequence.isAnimating = true;
    expect(mySequence.goTo(2)).toEqual(false);
  });


  it("should prevent going to a step if the navigationSkipThreshold is active", function() {

    mySequence.options.navigationSkip = true;
    mySequence.navigationSkipThresholdActive = true;
    expect(mySequence.goTo(2)).toEqual(false);
  });
});

describe("autoPlay - sequence._autoPlay()", function() {

  wait();

  it("should allow autoPlay to be started once, then prevent autoPlay from being started again when already active", function() {

    expect(mySequence._autoPlay.start()).toEqual(null);
    expect(mySequence._autoPlay.start()).toEqual(false);
  });
});

describe("autoPlay Start Delay - sequence._autoPlay.getDelay()", function() {

  wait();

  it("should return a delay with the same value as options.autoPlayDelay when delay is true or options.autoPlayStartDelay is null", function() {

    expect(mySequence._autoPlay.getDelay(true, null, 5000)).toEqual(5000);
  });

  it("should return a delay with the same value as options.autoPlayStartDelay when delay is true or undefined", function() {

    expect(mySequence._autoPlay.getDelay(true, 250, 5000)).toEqual(250);

  });

  it("should return a delay of 0 when delay is false or undefined", function() {

    expect(mySequence._autoPlay.getDelay(false, null, 5000)).toEqual(0);
    expect(mySequence._autoPlay.getDelay(undefined, 250, 5000)).toEqual(0);
    expect(mySequence._autoPlay.getDelay(undefined, null, 5000)).toEqual(0);
  });

  it("should return a delay of 750 when a custom delay is defined, regardless of options.autoPlayDelay and options.autoPlayStartDelay", function() {

    expect(mySequence._autoPlay.getDelay(750, null, 5000)).toEqual(750);
    expect(mySequence._autoPlay.getDelay(750, 250, 5000)).toEqual(750);
  });
});
