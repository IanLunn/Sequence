/**
 * Test initiation of Sequence
 */
 describe("Initiating Sequence", function() {

  setup();

  it("should return an object", function() {

    var mySequence = initSequence();

    expect(mySequence).toEqual(jasmine.any(Object));
  });

  it("should prevent initiating Sequence twice on the same element", function() {

    var mySequence = initSequence();
        mySequence = initSequence();

    expect(mySequence).toEqual(null);
  });

  it("should add data-seq-enabled to the element", function() {

    var mySequence = initSequence();

    expect(mySequence.container.dataset["seqEnabled"]).toEqual("true");
  });

  it("should merge and override default options with developer options (change autoPlay from the default of false to true)", function() {

    var mySequence =  initSequence({
      autoPlay: true
    });

    expect(mySequence.options.autoPlay).toEqual(true);
  });
});
