/**
 * sequence.goTo()
 */
describe("Prevent going to a step - sequence.goTo()", function() {

  setup();

  it("should prevent going to the same step already being viewed", function(done) {

    var mySequence = initSequence();

    expect(mySequence.goTo(1)).toEqual(false);
    done();
  });


  it("should prevent going to a non-existent step", function() {

    var mySequence = initSequence();

    expect(mySequence.goTo(5)).toEqual(false);
    expect(mySequence.goTo(-1)).toEqual(false);
  });


  it("should prevent going to a step whilst another is animating and navigationSkip is false", function() {

    var mySequence = initSequence({
      navigationSkip: false
    });

    mySequence.isAnimating = true;
    expect(mySequence.goTo(2)).toEqual(false);
  });


  it("should prevent going to a step if the navigationSkipThreshold is active", function() {

    var mySequence = initSequence({
      navigationSkip: true
    });

    mySequence.navigationSkipThresholdActive = true;
    expect(mySequence.goTo(2)).toEqual(false);
  });
});
