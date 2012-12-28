$(document).ready(function(){
    var options = {
        nextButton: true,
        prevButton: true,
        animateStartingFrameIn: true,
        autoPlayDelay: 3000,
        preloader: true,
        pauseOnHover: false,
        preloadTheseFrames: [1],
        preloadTheseImages: [
            "images/tn-model1.png",
            "images/tn-model2.png",
            "images/tn-model3.png"
        ]
    };
    
    var sequence = $("#sequence").sequence(options).data("sequence");

    sequence.afterLoaded = function() {
        $("#sequence-theme .nav").fadeIn(100);
        $("#sequence-theme .nav li:nth-child("+(sequence.settings.startingFrameID)+") img").addClass("active");
    }

    sequence.beforeNextFrameAnimatesIn = function() {
        $("#sequence-theme .nav li:not(:nth-child("+(sequence.nextFrameID)+")) img").removeClass("active");
        $("#sequence-theme .nav li:nth-child("+(sequence.nextFrameID)+") img").addClass("active");
    }
    
    $("#sequence-theme").on("click", ".nav li", function() {
        $(this).children("img").removeClass("active").children("img").addClass("active");
        sequence.nextFrameID = $(this).index()+1;
        sequence.goTo(sequence.nextFrameID);
    });
});