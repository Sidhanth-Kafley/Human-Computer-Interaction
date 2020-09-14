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
    var bone = finger[i].bones;
    var weight=1;
    HandleBone(bone, weight);
    // var x = finger[i].tipPosition[0];
    // var y = window.innerHeight-finger[i].tipPosition[1];
    // var z = finger[i].tipPosition[2];
  }
}

function HandleBone(bone, weight){
  for(var j=0; j<bone.length; j++){
    //console.log(bone[j]);
    var x = bone[j].nextJoint[0];
    var y = window.innerHeight-bone[j].nextJoint[1];
    var z = bone[j].nextJoint[2];

    var newTip = TransformCoordinates(x, y);
    var newTipX = newTip[0];
    var newTipY = newTip[1];

    var x1 = bone[j].prevJoint[0];
    var y1 = window.innerHeight-bone[j].prevJoint[1];
    var z1 = bone[j].prevJoint[2];

    var newBase = TransformCoordinates(x1, y1);
    var newBaseX = newBase[0];
    var newBaseY = newBase[1];

    if(bone[j].type === 0){
      weight = 10;
    }
    else if(bone[j].type === 1){
      weight = 7;
    }
    else if(bone[j].type === 2){
      weight = 5;
    }
    else if(bone[j].type === 3){
      weight = 2;
    }

    strokeWeight(weight);
    line(newTipX, newTipY, newBaseX, newBaseY);

  }
}

function TransformCoordinates(x, y){
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

  var newX = ((x-rawXMin)/(rawXMax-rawXMin)) * (window.innerWidth - 0) + 0;

  // I derived this formula from a base formula provided in stackexchange. The base formula is as shown below:
  // Result := ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
  // Using this base formula I was able to derive the formula to scale the x and y values to the canvas

  var newY = ((y-rawYMin)/(rawYMax-rawYMin)) * (window.innerHeight - 0) + 0;

  return [newX, newY];
}
