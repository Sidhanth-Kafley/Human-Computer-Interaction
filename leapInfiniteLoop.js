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
      }
      if(x>rawXMax){
        rawXMax = x;
      }
      if(y<rawYMin){
        rawYMin = y;
      }
      if(y>rawYMax){
        rawYMax = y;
      }
      console.log(rawXMax, rawXMin, rawYMax, rawYMin);

      var newX = ((x-rawXMin)/(rawXMax-rawXMin)) * (window.innerWidth - 0) + 0;

      //I derived this formula from a base formula provided in stackexchange. The base formula is as shown below:
      // Result := ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
      // Using this base formula I was able to derive the formula to scale the x and y values to the canvas

      var newY = ((y-rawYMin)/(rawYMax-rawYMin)) * (window.innerHeight - 0) + 0;

      circle(newX, newY, 100);
    }
  }
}
