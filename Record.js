var oneFrameOfData = nj.zeros([5,4,6]);

var controllerOptions = {};

var rawXMin = 2000;
var rawXMax = 10;
var rawYMin = 2000;
var rawYMax = 10;
var previousNumHands = 0;
var currentNumHands = 0;

Leap.loop(controllerOptions, function(frame)
  {
    var currentNumHands = frame.hands.length;
    clear();
    HandleFrame(frame);
    if(previousNumHands === 2 && currentNumHands === 1){
      RecordData();
    }
    previousNumHands = currentNumHands;
  }
);

function HandleFrame(frame){
  if(frame.hands.length === 1 || frame.hands.length === 2){
    var hand = frame.hands[0];
    HandleHand(hand, frame);
  }
}

function HandleHand(hand, frame){
  var finger = hand.fingers;
  for(var j=3; j>=0; j--){
    for(var i=0; i<finger.length; i++){
    var bone = finger[i].bones;
    var weight=1;
    var fingerIndex = finger[i].type;
    HandleBone(j, bone, weight, frame, fingerIndex);
    }
  }
}

function HandleBone(j, bone, weight, frame, fingerIndex){
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
    var sum = x+y+z+x1+y1+z1;

    var boneIndex = bone[j].type;

    var newBase = TransformCoordinates(x1, y1);
    var newBaseX = newBase[0];
    var newBaseY = newBase[1];


    oneFrameOfData.set(fingerIndex,boneIndex,0,newBaseX);
    oneFrameOfData.set(fingerIndex,boneIndex,1,newBaseY);
    oneFrameOfData.set(fingerIndex,boneIndex,2,z1);
    oneFrameOfData.set(fingerIndex,boneIndex,3,newTipX);
    oneFrameOfData.set(fingerIndex,boneIndex,4,newTipY);
    oneFrameOfData.set(fingerIndex,boneIndex,5,z);


    var r,g,b = 0;

    if(frame.hands.length === 1){
      if(bone[j].type === 0){
        weight = 10;
        r = 124;
        g = 252;
        b = 0;

      }
      else if(bone[j].type === 1){
        weight = 7;
        r = 50;
        g = 205;
        b = 50;

      }
      else if(bone[j].type === 2){
        weight = 5;
        r = 34;
        g = 139;
        b = 34;

      }
      else if(bone[j].type === 3){
        weight = 2;
        r = 0;
        g = 100;
        b = 0;
      }
    }

    else if(frame.hands.length === 2){
      if(bone[j].type === 0){
        weight = 10;
        r = 255;
        g = 8;
        b = 0;

      }
      else if(bone[j].type === 1){
        weight = 7;
        r = 184;
        g = 15;
        b = 10;

      }
      else if(bone[j].type === 2){
        weight = 5;
        r = 128;
        g = 0;
        b = 0;

      }
      else if(bone[j].type === 3){
        weight = 2;
        r = 66;
        g = 13;
        b = 9;
      }
    }

    strokeWeight(weight);
    stroke(r,g,b);
    line(newTipX, newTipY, newBaseX, newBaseY);
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

function RecordData(){
  background(0,0,0);
  console.log(oneFrameOfData.toString());
}
