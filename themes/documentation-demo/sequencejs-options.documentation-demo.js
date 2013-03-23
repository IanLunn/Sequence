$(document).ready(function(){

    var frames = $("#sequence ul li");

    function changeText(id, text){
        frames.eq(id-1).find(".sequence-class").text(text);
    }

    var options = {
        autoPlay: true //use Sequence's autoPlay feature
        //Sequence options go here. See here: http://www.sequencejs.com/documentation.html#developers
    }

    var sequence = $(".sequence").sequence(options).data("sequence"); //initiate Sequence

    sequence.beforeCurrentFrameAnimatesIn = function(){
        if(sequence.direction === 1){
            changeText(sequence.nextFrameID, "");
        }else{
            changeText(sequence.nextFrameID, ".animate-out");
        }
    },

    sequence.beforeCurrentFrameAnimatesOut = function(){
        if(sequence.direction === 1){
            changeText(sequence.currentFrameID, ".animate-out");
            changeText(sequence.nextFrameID, "");
        }else{
            changeText(sequence.currentFrameID, "");
            changeText(sequence.nextFrameID, ".animate-out");
        }
    },

    sequence.beforeNextFrameAnimatesIn = function(){
        changeText(sequence.nextFrameID, ".animate-in");
    }
});