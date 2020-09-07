var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;

Leap.loop(controllerOptions, function(frame)
{

  // clear();
  // var randomIntegerX = Math.floor(Math.random()*2) - 1;
  // var randomIntegerY = Math.floor(Math.random()*2) - 1;
  // circle(x+randomIntegerX, y+randomIntegerY, 100);
  if(frame.hands.length === 1){
    var hand = frame.hands[0];
    var fingers = hand.fingers;
    // console.log(hand);
    // console.log(fingers);
    for(var i=0; i<fingers.length; i++){
      console.log(fingers[i]);
    }

  }

}
);
