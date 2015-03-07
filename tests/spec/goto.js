/**
 * sequence.goTo()
 */
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
