var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;

Leap.loop(controllerOptions, function(frame)
{
  HandleFrame(frame);
  // clear();
  // var randomIntegerX = Math.floor(Math.random()*2) - 1;
  // var randomIntegerY = Math.floor(Math.random()*2) - 1;
  // circle(x+randomIntegerX, y+randomIntegerY, 100);
}
);

function HandleFrame(frame){
  if(frame.hands.length === 1){
    var hand = frame.hands[0];
    HandleHand(hand);
  }
}

function HandleHand(hand){
  var fingers = hand.fingers;
  for(var i=0; i<fingers.length; i++){
    if(fingers[i].type === 1){
      console.log(fingers[i]);
    }
  }
}
