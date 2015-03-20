/**
 * sequence.ui
 */
describe("ui.getElements()", function() {

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

  it("should get a default element (.seq-next)", function() {

    var nextButton = sequence.ui.getElements("nextButton", true);
    var expectedNextButton = document.querySelectorAll(".seq-next");

    expect(nextButton).toEqual([expectedNextButton[0]]);

    done();
  });

  it("should get a custom element via a CSS Selector (.custom-next)", function() {

    var nextButton = sequence.ui.getElements("nextButton", ".custom-next");
    var expectedNextButton = document.querySelectorAll(".custom-next");

    expect(nextButton).toEqual([expectedNextButton[0]]);

    done();
  });

  it("should get a custom element via an ID Selector (#next)", function() {

    var nextButton = sequence.ui.getElements("nextButton", "#next");
    var expectedNextButton = document.querySelectorAll("#next");

    expect(nextButton).toEqual([expectedNextButton[0]]);
  });
});
