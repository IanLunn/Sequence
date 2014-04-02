$(document).ready(function(){
    var options = {
        nextButton: $(".sequence-next"),
        prevButton: true,
        pagination: true,
        animateStartingFrameIn: true,
        autoPlay: false,
        autoPlayDelay: 3000,
        preloader: true,
        preloadTheseFrames: [1],
        preloadTheseImages: [
            "images/tn-model1.png",
            "images/tn-model2.png",
            "images/tn-model3.png"
        ]
    };

    var mySequence = $("#sequence").sequence(options).data("sequence");

    var el = document.getElementById("sequence");

    Hammer(el, {
      drag_lock_to_axis: true,
    }).on("dragleft dragright release", function(event) {

      switch(event.type) {

        case "dragleft":
        case "dragright":
          event.gesture.preventDefault();
        break;

        case "release":

          if(event.gesture.direction === "right") {
            mySequence.prev();
          }else if(event.gesture.direction === "left") {
            mySequence.next();
          }
        break;
      }
    });
});
