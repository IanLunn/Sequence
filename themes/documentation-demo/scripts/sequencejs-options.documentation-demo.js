$(document).ready(function(){
    function changeText(id, text){
        $("#sequence ul li:nth-child("+id+")").children().children(".sequence-class").text(text);
    }

    var options = {
        //Sequence options go here. This theme doesn't use any but if you'd like to add your own, see here: http://www.sequencejs.com/documentation.html#developers
    }

    var sequence = $("#sequence").sequence(options).data("sequence"); //initiate Sequence
    var sequence2 = $("#sequence2").sequence(options).data("sequence"); //initiate a second Sequence

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