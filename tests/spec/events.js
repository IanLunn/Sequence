/**
 * sequence.manageEvents
 */
describe("manageEvents()", function() {

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

  it("should add a hashChange event and return the element and handler function", function(done) {

    var myEvent = sequence.manageEvents.add.hashChange()[0];
    expect(myEvent.element).not.toEqual(undefined);
    expect(typeof myEvent.handler === "function").toEqual(true);
    done();
  });

  it("should add a button event and return the element and handler function", function(done) {

    // Use a nextButton, and add it with an empty function
    var button = sequence.ui.getElements("nextButton", true);
    var myEvent = sequence.manageEvents.add.button(button, "nav", function(){})[0];

    expect(myEvent.element).not.toEqual(undefined);
    expect(typeof myEvent.handler === "function").toEqual(true);
    done();
  });
});
