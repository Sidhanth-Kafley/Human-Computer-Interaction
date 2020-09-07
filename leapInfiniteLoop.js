var controllerOptions = {};

var i = 0;

var x = window.innerWidth/2;
var y = window.innerHeight/2;

Leap.loop(controllerOptions, function(frame)
{
  circle(x, y, 100);
  console.log(i);
  i++;
}
);
