$(document).ready(function(){
    var options = {
        nextButton: true,
        prevButton: true,
        preloader: true,
        navigationSkipThreshold: 1000,
        fadeFrameWhenSkipped: false
    };
    var sequence = $("#sequence").sequence(options).data("sequence");

    sequence.afterLoaded = function(){
        $(".sequence-prev, .sequence-next").fadeIn(500);
    }
});