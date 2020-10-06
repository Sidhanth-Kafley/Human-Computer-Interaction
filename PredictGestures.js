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
  for(var i=0; i<train0.shape[3]; i++){
    var features = train0.pick(null,null,null,i).toString();
  }
}

function Test(){

}
