$(document).ready(function() {
    var options = {
        nextButton: true,
        prevButton: true,
        pagination: true,
        animateStartingFrameIn: true,
        autoPlayDelay: 3000,
        preloader: true,
        preloadTheseFrames: [1],
        preloadTheseImages: [
            "images/tn-model1.png",
            "images/tn-model2.png",
            "images/tn-model3.png"
        ]
    };
    
    var mySequence = undefined; //setup a public variable to contain your Sequence instances

    function initSequence() {
        mySequence = $("#sequence").sequence(options).data("sequence"); /* initiate Sequence */

        mySequence.destroyed = function() { //when Sequence is destroyed
            alert('goodbye cruel world!');
        }
    }

    $("#destroy").on('click', function() {  //when <div id="destroy"> is clicked...
        if(mySequence !== undefined) {      //if Sequence is defined...
            mySequence.destroy();           //destroy Sequence
            mySequence = undefined;         //clear the mySequence variable
        }
    });

    $('#create').on('click', function() {   //when <div id="create"> is clicked...
        initSequence();                     //initiate a new instance of Sequence
    });
    
});