var predictedClassLabels = nj.zeros([150]);

const knnClassifier = ml5.KNNClassifier();
var testingSampleIndex = 1;
var trainingCompleted = false;


function draw(){
  clear();
  if(trainingCompleted === false){
    Train();
    trainingCompleted = true;
  }
  Test();
}

function Train(){
  console.log(train0.toString());
  console.log(test.toString());
}

function Test(){

}
