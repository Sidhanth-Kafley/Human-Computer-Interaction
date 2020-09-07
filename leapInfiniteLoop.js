var controllerOptions = {};

// var x = window.innerWidth/2;
// var y = window.innerHeight/2;

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
    if(finger[i].type === 1){
      console.log(finger[i]);
      console.log(finger[i].tipPosition);
      var x = finger[i].tipPosition[0];
      var y = window.innerHeight-finger[i].tipPosition[1];
      var z = finger[i].tipPosition[2];
      circle(x, y, 100);
    }
  }
}
