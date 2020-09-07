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
    console.log(frame.hands[0]);
  }

}
);
