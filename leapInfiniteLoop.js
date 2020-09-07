var controllerOptions = {};

var x = window.innerWidth/2;
var y = window.innerHeight/2;

Leap.loop(controllerOptions, function(frame)
{
  clear();
  var randomInteger = Math.floor(Math.random()*2) - 1;
  circle(x+randomInteger, y, 100);
}
);
