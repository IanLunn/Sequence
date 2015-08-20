/**
 * sequence.preloader
 */
describe("preloader", function() {

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

  it("init() should return true when the default preloader is used", function() {

    sequence.options.preloader = true;
    expect(sequence.preload.init()).toEqual(true);
  });

  it("init() should return true when a custom preloader element is used", function() {

    sequence.options.preloader = ".seq-custom-preload-element";
    expect(sequence.preload.init()).toEqual(true);
  });

  it("init() should return false when the preloader isn't used", function() {

    sequence.options.preloader = false;
    expect(sequence.preload.init()).toEqual(false);
  });

  it("should add the default preloader element to the document", function() {

    sequence.options.preloader = true;
    var defaultPreloader = document.querySelectorAll(".seq-preloader");

    expect(defaultPreloader.length).toBeGreaterThan(0);
  });

  it("should return false when the default preloader is not being used", function() {

    sequence.options.preloader = false;
    expect(sequence.preload.append()).toEqual(false);

    sequence.options.preloader = '#custom-preloader';
    expect(sequence.preload.append()).toEqual(false);
  });

  it("should return true when the default preloader is being used", function() {

    sequence.options.preloader = true;
    expect(sequence.preload.append()).toEqual(true);
  });

  it("hideStepsUntilPreloaded() should return true when enabled", function() {

    sequence.options.hideStepsUntilPreloaded = true;
    expect(sequence.preload.toggleStepsVisibility()).toEqual(true);
  });

  it("hideStepsUntilPreloaded() should return false when disabled", function() {

    sequence.options.hideStepsUntilPreloaded = false;
    expect(sequence.preload.toggleStepsVisibility()).toEqual(false);
  });

  it("getImagesToPreload() should return an empty array if the images or src attributes aren't specificed in an array", function() {

    var imagesToPreload = "images/hi.jpg";
    expect(sequence.preload.getImagesToPreload(imagesToPreload)).toEqual(jasmine.any(Array));
  });
});
