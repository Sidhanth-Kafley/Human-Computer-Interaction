var controllerOptions = {};

var rawXMin = 2000;
var rawXMax = 10;
var rawYMin = 2000;
var rawYMax = 10;

Leap.loop(controllerOptions, function(frame)
{
  clear();
  HandleFrame(frame);
}
);

function HandleFrame(frame){
  if(frame.hands.length === 1){
    var hand = frame.hands[0];
    HandleHand(hand);
  }
}

function HandleHand(hand){
  var finger = hand.fingers;
  HandleFinger(finger)
}

function HandleFinger(finger){
  for(var i=0; i<finger.length; i++){
    if(finger[i].type === 1){
      // console.log(finger[i]);
      // console.log(finger[i].tipPosition);
      var x = finger[i].tipPosition[0];
      var y = window.innerHeight-finger[i].tipPosition[1];
      var z = finger[i].tipPosition[2];
      if(x<rawXMin){
        rawXMin = x;
        console.log(rawXMin);
      }
      if(x>rawXMax){
        rawXMax = x;
        console.log(rawXMax);
      }
      if(y<rawYMin){
        rawYMin = y;
        console.log(rawYMin);
      }
      if(y>rawYMax){
        rawYMax = y;
        console.log(rawYMax);
      }
      circle(x, y, 100);
    }
  }
}
