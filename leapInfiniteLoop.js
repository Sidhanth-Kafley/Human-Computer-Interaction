var controllerOptions = {};

var i = 0;

var x = window.innerWidth/2;
var y = window.innerHeight/2;

Leap.loop(controllerOptions, function(frame)
{
  var randomInteger = Math.floor(Math.random()*2) - 1;
  circle(x+randomInteger, y, 100);
  console.log(i);
  i++;
}
);
