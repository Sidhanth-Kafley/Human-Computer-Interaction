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
var programState=0;

Leap.loop(controllerOptions, function(frame) {
  clear();
  DetermineState(frame);
  if(programState==0){
    HandleState0(frame);
  }
  else if(programState==1){
    HandleState1(frame);
  }
  else{
    HandleState2(frame);
  }
});

function DetermineState(frame){
  if(frame.hands.length === 0){
    programState = 0;
  }
  else if(HandIsUncentered()){
    programState = 1;
  }
  else{
    programState = 2;
  }
}

function HandleState0(frame){
  TrainKNNIfNotDoneYet()
  DrawImageToHelpUserPutTheirHandOverTheDevice()
}

function TrainKNNIfNotDoneYet(){
  // if (trainingCompleted === false) {
  //   Train();
  //   trainingCompleted = true;
  // }
}

function DrawImageToHelpUserPutTheirHandOverTheDevice(){
  image(img, 0, 0, window.innerWidth/2, window.innerHeight/2);
}

// image(arrowLeft, 0, 0, window.innerWidth/2, window.innerHeight/2);
//
// image(arrowDown, 0, 0, window.innerWidth/2, window.innerHeight/2);
// image(arrowUp, 0, 0, window.innerWidth/2, window.innerHeight/2);
// image(arrowToward, 0, 0, window.innerWidth/2, window.innerHeight/2);
// image(arrowAway, 0, 0, window.innerWidth/2, window.innerHeight/2);



function HandleState1(frame){
  HandleFrame(frame);
  //Test();
  if(HandIsTooFarToTheLeft()){
    DrawArrowRight();
  }
  if(HandIsTooFarToTheRight()){
    DrawArrowLeft();
  }
  if(HandIsTooFarDown()){
    DrawArrowUp();
  }
  if(HandIsTooFarHigh()){
    DrawArrowDown();
  }
  if(HandIsTooFarForward()){
    DrawArrowBackwards();
  }
  if(HandIsTooFarBackward()){
    DrawArrowForwards();
  }
}

function HandleState2(frame){
  HandleFrame(frame);
  //Test();
}

function HandleFrame(frame) {
  if (frame.hands.length === 1 || frame.hands.length === 2) {
    var hand = frame.hands[0];
    var InteractionBox = frame.interactionBox;
    HandleHand(hand, frame, InteractionBox);
    //console.log(oneFrameOfData.toString());
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

  var canvasX = window.innerWidth/2 * normalizedNextJoint[0];
  var canvasY = window.innerHeight/2 * (1 - normalizedNextJoint[1]);

  var canvasX1 = window.innerWidth/2 * normalizePrevJoint[0];
  var canvasY1 = window.innerHeight/2 * (1 - normalizePrevJoint[1]);


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

// function Train() {
//   for (var i = 0; i < train3.shape[3]; i++) {
//     var features0 = train0.pick(null, null, null, i).reshape(1, 120);
//     var features0ReckordGroten = train0ReckordGroten.pick(null, null, null, i).reshape(1, 120);
//     var features1 = train1.pick(null, null, null, i).reshape(1, 120);
//     var features2 = train2.pick(null, null, null, i).reshape(1, 120);
//     var features2Sheboy = train2Sheboy.pick(null, null, null, i).reshape(1, 120);
//     var features2Liu = train2Liu.pick(null, null, null, i).reshape(1, 120);
//     var features3 = train3.pick(null, null, null, i).reshape(1, 120);
//     var features4 = train4.pick(null, null, null, i).reshape(1, 120);
//     var features4Beattie = train4Beattie.pick(null, null, null, i).reshape(1, 120);
//     var features4Socia = train4Socia.pick(null, null, null, i).reshape(1, 120);
//     var features4OBrien = train4OBrien.pick(null, null, null, i).reshape(1, 120);
//     var features5 = train5.pick(null, null, null, i).reshape(1, 120);
//     var features6 = train6.pick(null, null, null, i).reshape(1, 120);
//     var features7 = train7.pick(null, null, null, i).reshape(1, 120);
//     var features7Vega = train7Vega.pick(null, null, null, i).reshape(1, 120);
//     var features7Menian = train7Menian.pick(null, null, null, i).reshape(1, 120);
//     //var features7Fisher = train7Fisher.pick(null, null, null, i).reshape(1, 120);
//     var features8 = train8.pick(null, null, null, i).reshape(1, 120);
//     var features9 = train9.pick(null, null, null, i).reshape(1, 120);
//
//     knnClassifier.addExample(features0.tolist(), 0);
//     knnClassifier.addExample(features0ReckordGroten.tolist(), 0);
//     knnClassifier.addExample(features1.tolist(), 1);
//     knnClassifier.addExample(features2.tolist(), 2);
//     knnClassifier.addExample(features2Sheboy.tolist(), 2);
//     knnClassifier.addExample(features2Liu.tolist(), 2);
//     knnClassifier.addExample(features3.tolist(), 3);
//     knnClassifier.addExample(features4.tolist(), 4);
//     knnClassifier.addExample(features4Beattie.tolist(), 4);
//     knnClassifier.addExample(features4Socia.tolist(), 4);
//     knnClassifier.addExample(features4OBrien.tolist(), 4);
//     knnClassifier.addExample(features5.tolist(), 5);
//     knnClassifier.addExample(features6.tolist(), 6);
//     knnClassifier.addExample(features7.tolist(), 7);
//     knnClassifier.addExample(features7Vega.tolist(), 7);
//     //knnClassifier.addExample(features7Fisher.tolist(), 7);
//     knnClassifier.addExample(features7Menian.tolist(), 7);
//     knnClassifier.addExample(features8.tolist(), 8);
//     knnClassifier.addExample(features9.tolist(), 9);
//
//     console.log(i + " " + features0.toString());
//     console.log(i + " " + features1.toString());
//     console.log(i + " " + features2.toString());
//     console.log(i + " " + features3.toString());
//     console.log(i + " " + features4.toString());
//     console.log(i + " " + features5.toString());
//     console.log(i + " " + features6.toString());
//     console.log(i + " " + features7.toString());
//     console.log(i + " " + features8.toString());
//     console.log(i + " " + features9.toString());
//
//   }
// }
//
// function Test() {
//   CenterXData();
//   CenterYData();
//   CenterZData();
//   var currentTestingSample = oneFrameOfData.pick(null, null, null, testingSampleIndex).reshape(1, 120);
//   var predictedLabel = knnClassifier.classify(currentTestingSample.tolist(), GotResults);
//   //console.log(testingSampleIndex + "    " + predictedClassLabels.get(testingSampleIndex));
//   var c = predictedClassLabels.get(testingSampleIndex);
//   var d = 2;
//   n++;
//   m = ((n-1)*m + (c == d))/n;
//   //console.log(n + " " + m + " " + c);
// }
//
// function GotResults(err, result) {
//   testingSampleIndex += 1;
//   if (testingSampleIndex >= train3.shape[3]) {
//     testingSampleIndex = 0;
//   }
//   predictedClassLabels.set(testingSampleIndex, parseInt(result.label));
//   //console.log(predictedClassLabels.get(testingSampleIndex));
// }

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
  //console.log(currentYMean);
}

function CenterZData(){
  zValues = oneFrameOfData.slice([],[],[2,6,3]);
  //console.log(xValues.shape);
  var currentZMean = zValues.mean();
  //console.log(currentMean);
  var zShift = 0.5 - currentZMean;
  //console.log(horizontalShift);
  for (var currentRow=0; currentRow<xValues.shape[0]; currentRow++){
    for(var currentColumn=0; currentColumn<xValues.shape[1]; currentColumn++){
      currentZ = oneFrameOfData.get(currentRow,currentColumn,2);
      shiftedZ = currentZ + zShift;
      oneFrameOfData.set(currentRow,currentColumn,2, shiftedZ);
      currentZ = oneFrameOfData.get(currentRow,currentColumn,5);
      shiftedZ = currentZ +zShift;
      oneFrameOfData.set(currentRow,currentColumn,5, shiftedZ);
    }
  }
  var currentZMean = zValues.mean();
  //console.log(currentZMean);
}

function HandIsUncentered(){
  if(HandIsTooFarToTheLeft()){
    return true;
  }
  else if(HandIsTooFarToTheRight()){
    return true;
  }
  else if(HandIsTooFarDown()){
    return true;
  }
  else if(HandIsTooFarHigh()){
    return true;
  }
  else if(HandIsTooFarForward()){
    return true;
  }
  else if(HandIsTooFarBackward()){
    return true;
  }
  else{
    return false;
  }
}


function HandIsTooFarToTheLeft(){
  xValues = oneFrameOfData.slice([],[],[0,6,3]);
  var currentXMean = xValues.mean();

  if(currentXMean < 0.25){
    return true;
  }
  else{
    return false;
  }
}

function DrawArrowRight(){
  image(arrowRight, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function HandIsTooFarToTheRight(){
  xValues = oneFrameOfData.slice([],[],[0,6,3]);
  var currentXMean = xValues.mean();

  if(currentXMean > 0.75){
    return true;
  }
  else{
    return false;
  }
}

function DrawArrowLeft(){
  image(arrowLeft, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function HandIsTooFarDown(){
  yValues = oneFrameOfData.slice([],[],[1,6,3]);
  var currentYMean = yValues.mean();

  if(currentYMean < 0.25){
    return true;
  }
  else{
    return false;
  }
}

function DrawArrowUp(){
  image(arrowUp, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function HandIsTooFarHigh(){
  yValues = oneFrameOfData.slice([],[],[1,6,3]);
  var currentYMean = yValues.mean();

  if(currentYMean > 0.75){
    return true;
  }
  else{
    return false;
  }
}

function DrawArrowDown(){
  image(arrowDown, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function HandIsTooFarForward(){
  zValues = oneFrameOfData.slice([],[],[2,6,3]);
  var currentZMean = zValues.mean();

  if(currentZMean < 0.25){
    return true;
  }
  else{
    return false;
  }
}

function DrawArrowBackwards(){
  image(arrowToward, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function HandIsTooFarBackward(){
  zValues = oneFrameOfData.slice([],[],[2,6,3]);
  var currentZMean = zValues.mean();

  if(currentZMean > 0.75){
    return true;
  }
  else{
    return false;
  }
}

function DrawArrowForwards(){
  image(arrowAway, window.innerWidth/2, 0, window.innerWidth/2, window.innerHeight/2);
}

function SignIn(){
  username = document.getElementById('username').value;
  console.log(username);
}
