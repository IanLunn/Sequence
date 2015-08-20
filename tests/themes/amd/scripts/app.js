require.config({
  baseUrl: '../../../scripts',
  paths: {
    imagesLoaded: 'imagesloaded.pkgd.min',
    Hammer: 'hammer.min'
  }
});

require(["sequence"], function(sequence) {

  var element = document.getElementById("sequence");

  var options = {
    autoPlay: true
  };

  var mySequence = sequence(element, options);
});
