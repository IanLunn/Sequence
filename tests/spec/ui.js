/**
 * sequence._ui
 */
describe("Get UI elements - sequence._ui.getElements()", function() {

  setup();

  it("should get a default element (.seq-next)", function() {

    var mySequence = initSequence();

    var nextButton = mySequence._ui.getElements("nextButton", true);
    var expectedNextButton = document.querySelectorAll(".seq-next");

    expect(nextButton).toEqual([expectedNextButton[0]]);
  });

  it("should get a custom element via a CSS Selector (.custom-next)", function() {

    var mySequence = initSequence();

    var nextButton = mySequence._ui.getElements("nextButton", ".custom-next");
    var expectedNextButton = document.querySelectorAll(".custom-next");

    expect(nextButton).toEqual([expectedNextButton[0]]);
  });

  it("should get a custom element via an ID Selector (#next)", function() {

    var mySequence = initSequence();

    var nextButton = mySequence._ui.getElements("nextButton", "#next");
    var expectedNextButton = document.querySelectorAll("#next");

    expect(nextButton).toEqual([expectedNextButton[0]]);
  });
});
