nj.config.printThreshold = 1000;

var numSamples = 100;
var currrentSample = 0;
var framesOfData = nj.zeros([5,4,6,numSamples]);
var controllerOptions = {};
var rawXMin = 2000;
var rawXMax = 10;
var rawYMin = 2000;
var rawYMax = 10;
var previousNumHands = 0;
var currentNumHands = 0;

Leap.loop(controllerOptions, function(frame)
  {
    currentNumHands = frame.hands.length;
    clear();
    HandleFrame(frame);
    RecordData();
    previousNumHands = currentNumHands;
  }
);

function HandleFrame(frame){
  if(frame.hands.length === 1 || frame.hands.length === 2){
    var hand = frame.hands[0];
    var InteractionBox = frame.interactionBox;
    HandleHand(hand, frame, InteractionBox);
  }
}

function HandleHand(hand, frame, InteractionBox){
  var finger = hand.fingers;
  for(var j=3; j>=0; j--){
    for(var i=0; i<finger.length; i++){
    var bone = finger[i].bones;
    var weight=1;
    var fingerIndex = finger[i].type;
    HandleBone(j, bone, weight, frame, fingerIndex, InteractionBox);
    }
  }
}

function HandleBone(j, bone, weight, frame, fingerIndex, InteractionBox){

    var normalizePrevJoint = InteractionBox.normalizePoint(bone[j].prevJoint, true);
    var normalizedNextJoint = InteractionBox.normalizePoint(bone[j].nextJoint, true);

    var newTipX = normalizedNextJoint[0];
    var newTipY = normalizedNextJoint[1];
    var z = normalizedNextJoint[2];

    var newBaseX = normalizePrevJoint[0];
    var newBaseY = normalizePrevJoint[1];
    var z1 = normalizePrevJoint[2];

    var boneIndex = bone[j].type;

    framesOfData.set(fingerIndex,boneIndex,0,currrentSample,newBaseX);
    framesOfData.set(fingerIndex,boneIndex,1,currrentSample,newBaseY);
    framesOfData.set(fingerIndex,boneIndex,2,currrentSample,z1);
    framesOfData.set(fingerIndex,boneIndex,3,currrentSample,newTipX);
    framesOfData.set(fingerIndex,boneIndex,4,currrentSample,newTipY);
    framesOfData.set(fingerIndex,boneIndex,5,currrentSample,z);

    var canvasX = window.innerWidth * normalizedNextJoint[0];
    var canvasY = window.innerHeight * (1 - normalizedNextJoint[1]);

    var canvasX1 = window.innerWidth * normalizePrevJoint[0];
    var canvasY1 = window.innerHeight * (1 - normalizePrevJoint[1]);


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
    line(canvasX, canvasY, canvasX1, canvasY1);
}


function RecordData(){
  if(previousNumHands === 2 && currentNumHands === 1){
    background(0,0,0);
  }
  if(currentNumHands === 2){
    currrentSample++;
    if(currrentSample === numSamples){
      currrentSample = 0;
    }
    console.log(framesOfData.toString());
    console.log(currrentSample);
  }
}
