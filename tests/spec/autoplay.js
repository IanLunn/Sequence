/**
 * sequence._autoPlay
 */
describe("autoPlay - sequence._autoPlay()", function() {

  setup();

  it("should allow autoPlay to be started once, then prevent autoPlay from being started again when already active", function() {

    var mySequence = initSequence();

    expect(mySequence._autoPlay.start()).toEqual(null);
    expect(mySequence._autoPlay.start()).toEqual(false);
  });
});

describe("autoPlay Start Delay - sequence._autoPlay.getDelay()", function() {

  setup();

  it("should return a delay with the same value as options.autoPlayDelay when delay is true or options.autoPlayStartDelay is null", function() {

    var mySequence = initSequence();

    expect(mySequence._autoPlay.getDelay(true, null, 5000)).toEqual(5000);
  });

  it("should return a delay with the same value as options.autoPlayStartDelay when delay is true or undefined", function() {

    var mySequence = initSequence();

    expect(mySequence._autoPlay.getDelay(true, 250, 5000)).toEqual(250);

  });

  it("should return a delay of 0 when delay is false or undefined", function() {

    var mySequence = initSequence();

    expect(mySequence._autoPlay.getDelay(false, null, 5000)).toEqual(0);
    expect(mySequence._autoPlay.getDelay(undefined, 250, 5000)).toEqual(0);
    expect(mySequence._autoPlay.getDelay(undefined, null, 5000)).toEqual(0);
  });

  it("should return a delay of 750 when a custom delay is defined, regardless of options.autoPlayDelay and options.autoPlayStartDelay", function() {

    var mySequence = initSequence();

    expect(mySequence._autoPlay.getDelay(750, null, 5000)).toEqual(750);
    expect(mySequence._autoPlay.getDelay(750, 250, 5000)).toEqual(750);
  });
});
