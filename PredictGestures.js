var predictedClassLabels = nj.zeros([150]);
var oneFrameOfData = nj.zeros([5,4,6]);
const knnClassifier = ml5.KNNClassifier();
var testingSampleIndex = 0;
var trainingCompleted = false;
var controllerOptions = {};
nj.config.printThreshold = 6;
var counter = 0;
var n = 0;
var m=1;

Leap.loop(controllerOptions, function(frame) {
  clear();
  if (trainingCompleted === false) {
    Train();
    trainingCompleted = true;
  }
  HandleFrame(frame);
});

function HandleFrame(frame) {
  if (frame.hands.length === 1 || frame.hands.length === 2) {
    var hand = frame.hands[0];
    var InteractionBox = frame.interactionBox;
    HandleHand(hand, frame, InteractionBox);
    //console.log(oneFrameOfData.toString());
    Test();
  }
}

function HandleHand(hand, frame, InteractionBox) {
  var finger = hand.fingers;
  for (var j = 3; j >= 0; j--) {
    for (var i = 0; i < finger.length; i++) {
      var bone = finger[i].bones;
      var weight = 1;
      var fingerIndex = finger[i].type;
      HandleBone(j, bone, weight, frame, fingerIndex, InteractionBox);
    }
  }
}

function HandleBone(j, bone, weight, frame, fingerIndex, InteractionBox) {

  var normalizePrevJoint = InteractionBox.normalizePoint(bone[j].prevJoint, true);
  var normalizedNextJoint = InteractionBox.normalizePoint(bone[j].nextJoint, true);

  var newTipX = normalizedNextJoint[0];
  var newTipY = normalizedNextJoint[1];
  var z = normalizedNextJoint[2];

  var newBaseX = normalizePrevJoint[0];
  var newBaseY = normalizePrevJoint[1];
  var z1 = normalizePrevJoint[2];

  var boneIndex = bone[j].type;

  oneFrameOfData.set(fingerIndex,boneIndex,0,newBaseX);
  oneFrameOfData.set(fingerIndex,boneIndex,1,newBaseY);
  oneFrameOfData.set(fingerIndex,boneIndex,2,z1);
  oneFrameOfData.set(fingerIndex,boneIndex,3,newTipX);
  oneFrameOfData.set(fingerIndex,boneIndex,4,newTipY);
  oneFrameOfData.set(fingerIndex,boneIndex,5,z);

  var canvasX = window.innerWidth * normalizedNextJoint[0];
  var canvasY = window.innerHeight * (1 - normalizedNextJoint[1]);

  var canvasX1 = window.innerWidth * normalizePrevJoint[0];
  var canvasY1 = window.innerHeight * (1 - normalizePrevJoint[1]);


  var r, g, b = 0;

  if (bone[j].type === 0) {
    weight = 10;
    r = 210;
    g = 210;
    b = 210;

  } else if (bone[j].type === 1) {
    weight = 7;
    r = 169;
    g = 169;
    b = 169;

  } else if (bone[j].type === 2) {
    weight = 5;
    r = 105;
    g = 105;
    b = 105;

  } else if (bone[j].type === 3) {
    weight = 2;
    r = 0;
    g = 0;
    b = 0;
  }
  strokeWeight(weight);
  stroke(r, g, b);
  line(canvasX, canvasY, canvasX1, canvasY1);
}

function Train() {
  for (var i = 0; i < train3.shape[3]; i++) {
    var features = train3.pick(null, null, null, i).reshape(1, 120);
    var features1 = train4.pick(null, null, null, i).reshape(1, 120);
    knnClassifier.addExample(features.tolist(), 3);
    knnClassifier.addExample(features1.tolist(), 4);
    console.log(i + " " + features.toString());
    console.log(i + " " +  features1.toString());
  }
}

function Test() {
  CenterXData();
  CenterYData();
  var currentTestingSample = oneFrameOfData.pick(null, null, null, testingSampleIndex).reshape(1, 120);
  var predictedLabel = knnClassifier.classify(currentTestingSample.tolist(), GotResults);
  //console.log(testingSampleIndex + "    " + predictedClassLabels.get(testingSampleIndex));
  var c = predictedClassLabels.get(testingSampleIndex);
  var d = 4;
  n++;
  m = ((n-1)*m + (c == d))/n;
  //console.log(n + " " + m + " " + c);
}

function GotResults(err, result) {
  testingSampleIndex += 1;
  if (testingSampleIndex >= train3.shape[3]) {
    testingSampleIndex = 0;
  }
  predictedClassLabels.set(testingSampleIndex, parseInt(result.label));
}

function CenterXData(){
  xValues = oneFrameOfData.slice([],[],[0,6,3]);
  //console.log(xValues.shape);
  var currentXMean = xValues.mean();
  //console.log(currentMean);
  var horizontalShift = 0.5 - currentXMean;
  //console.log(horizontalShift);
  for (var currentRow=0; currentRow<xValues.shape[0]; currentRow++){
    for(var currentColumn=0; currentColumn<xValues.shape[1]; currentColumn++){
      currentX = oneFrameOfData.get(currentRow,currentColumn,0);
      shiftedX = currentX + horizontalShift;
      oneFrameOfData.set(currentRow,currentColumn,0, shiftedX);
      currentX = oneFrameOfData.get(currentRow,currentColumn,3);
      shiftedX = currentX + horizontalShift;
      oneFrameOfData.set(currentRow,currentColumn,3, shiftedX);
    }
  }
  var currentXMean = xValues.mean();
  //console.log(currentXMean);
}

function CenterYData(){
  yValues = oneFrameOfData.slice([],[],[1,6,3]);
  //console.log(xValues.shape);
  var currentYMean = yValues.mean();
  //console.log(currentMean);
  var verticalShift = 0.5 - currentYMean;
  //console.log(horizontalShift);
  for (var currentRow=0; currentRow<xValues.shape[0]; currentRow++){
    for(var currentColumn=0; currentColumn<xValues.shape[1]; currentColumn++){
      currentY = oneFrameOfData.get(currentRow,currentColumn,1);
      shiftedY = currentY + verticalShift;
      oneFrameOfData.set(currentRow,currentColumn,1, shiftedY);
      currentY = oneFrameOfData.get(currentRow,currentColumn,4);
      shiftedY = currentY + verticalShift;
      oneFrameOfData.set(currentRow,currentColumn,4, shiftedY);
    }
  }
  var currentYMean = yValues.mean();
  console.log(currentYMean);
}
