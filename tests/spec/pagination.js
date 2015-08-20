/**
 * sequence.pagination
 */
describe("pagination", function() {

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

  it("getLinks() should return an array containing 3 pagination links", function() {

    var $pagination = document.querySelectorAll(".seq-pagination")[0],
        paginationLinks = sequence.pagination.getLinks($pagination, "sequence");

    expect(paginationLinks).toEqual(jasmine.any(Array));
    expect(paginationLinks.length).toEqual(3);
  });

  it("update() should return the current pagination link", function() {

    var currentPaginationLink = sequence.pagination.update();

    expect(currentPaginationLink).toEqual(jasmine.any(Array));
    expect(currentPaginationLink.length).toEqual(1);
  });

});
