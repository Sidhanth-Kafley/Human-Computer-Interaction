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
  console.log("I'm being trained.")
}

function Test(){
  console.log("I'm being tested.")
}
