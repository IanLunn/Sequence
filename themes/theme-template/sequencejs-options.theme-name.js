$(document).ready(function() {
    var options = {
        autoPlay: false,
        nextButton: true,
        prevButton: true
    };

    var sequence = $("#sequence").sequence(options).data("sequence");
});