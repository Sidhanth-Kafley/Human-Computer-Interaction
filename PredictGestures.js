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
  Test();
});

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
