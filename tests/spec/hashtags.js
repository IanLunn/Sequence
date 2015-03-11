/**
 * sequence.hashtags
 */
describe("hashtags.getStepHashTags()", function() {


  var sequence;

    // Set up Sequence and wait for it to be ready
    beforeAll(function(done) {

      appendSequence();

      setTimeout(function() {
        sequence = initSequence({
          autoPlay: false,
          hashTags: true,
          startingStepId: 2
        });

        sequence.ready = function() {
          done();
        };
      }, 1000);
    });

    afterAll(function(done) {
      removeSequence();
      SetTimeout(function() {
        resetSequence(sequence);
        done();
      }, 500);
    });

  it("should return an array containing a hashtag name for each step, taken from the step's ID attribute", function() {

    expect(sequence.hashTags.getStepHashTags()).toEqual(jasmine.any(Array));
    expect(sequence.hashTags.getStepHashTags()[0]).toEqual("step1");
  });

  it("should return an array containing a hashtag name for each step, taken from the step's data-seq-hashtag attribute", function() {

    sequence.options.hashDataAttribute = true;

    expect(sequence.hashTags.getStepHashTags()).toEqual(jasmine.any(Array));
    expect(sequence.hashTags.getStepHashTags()[0]).toEqual("step1attr");
  });
});


describe("hashtags.hasCorrespondingStep()", function() {


  var sequence;

  // Set up Sequence and wait for it to be ready
  beforeAll(function(done) {

    appendSequence();

    setTimeout(function() {
      sequence = initSequence({
        autoPlay: false,
        hashTags: true,
        startingStepId: 2
      });

      sequence.ready = function() {
        done();
      };
    }, 1000);
  });

  afterAll(function(done) {
    removeSequence();
    SetTimeout(function() {
      resetSequence(sequence);
      done();
    }, 500);
  });

  it("should return the zero-based ID of the step that the hashtag corresponds to", function() {

    // The hashtag "step1" should match an element with the ID of step1
    expect(sequence.hashTags.hasCorrespondingStep("step1")).toEqual(0);
  });

  it("should return -1 when the hashtag tested doesn't have a corresponding step", function() {

    expect(sequence.hashTags.hasCorrespondingStep("step4")).toEqual(-1);
  });
});
