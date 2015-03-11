/**
 * Test destruction of Sequence
 */
describe("destroy()", function() {

  var sequence;

  // Set up Sequence and wait for it to be ready
  beforeAll(function(done) {

    appendSequence();

    sequence = initSequence();

    sequence.ready = function() {

      setTimeout(function() {
        sequence.destroy();
        done();
      }, 500);

    };
  });

  afterAll(function(done) {
    removeSequence();
    done();
  });

  it("should remove the data-seq-enabled attribute from the container", function(done) {

    expect(sequence.$container.getAttribute("data-seq-enabled")).toEqual(null);
    done();
  });
});
