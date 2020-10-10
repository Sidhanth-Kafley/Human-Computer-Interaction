var predictedClassLabels = nj.zeros([150]);

const knnClassifier = ml5.KNNClassifier();
var testingSampleIndex = 0;
var trainingCompleted = false;
var controllerOptions = {};

Leap.loop(controllerOptions, function(frame) {
  clear();
  if (trainingCompleted === false) {
    Train();
    trainingCompleted = true;
  }
  HandleFrame(frame);
  Test();
});

function HandleFrame(frame) {
  if (frame.hands.length === 1 || frame.hands.length === 2) {
    var hand = frame.hands[0];
    var InteractionBox = frame.interactionBox;
    HandleHand(hand, frame, InteractionBox);
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
  for (var i = 0; i < trainX.shape[3]; i++) {
    var features = trainX.pick(null, null, null, i).reshape(1, 120).tolist();
    var features1 = trainY.pick(null, null, null, i).reshape(1, 120).tolist();
    knnClassifier.addExample(features, 3);
    knnClassifier.addExample(features1, 4);
  }
}

function Test() {
  var currentTestingSample = test.pick(null, null, null, testingSampleIndex).reshape(1, 120);
  var predictedLabel = knnClassifier.classify(currentTestingSample.tolist(), GotResults);
  console.log(testingSampleIndex + "-----" + predictedClassLabels.get(testingSampleIndex));

}

function GotResults(err, result) {
  testingSampleIndex += 1;
  if (testingSampleIndex > test.shape[3] - 1) {
    testingSampleIndex = 0;
  }
  predictedClassLabels.set(testingSampleIndex, parseInt(result.label));
}
