// ok, so I'm gonna work on creating a function in JavaScript that compares 2 posenet objects (1 from the user, 1 from the template, at the same frame), and returns a decimal from 1 to 0 indicating how closely the user matches the template, with 1 being a perfect match and 0 being a terrible match
// The function will take the posenet objects and wrap a box around each, then use the positions of the body parts to convert the positions into relative positions based on the dimensions of the box

var flipHorizontal = false;
 
var imageElement = document.getElementById('dancer');

posenet.load().then(function(net) {
  const pose = net.estimateSinglePose(imageElement, {
    flipHorizontal: true
  });
  return pose;
}).then(function(pose){
  console.log(pose["keypoints"]);
  console.log(typeof pose["keypoints"]);
  console.log(pose["keypoints"][0]);
  console.log(pose["keypoints"][0]["position"]);
  console.log(pose["keypoints"][0]["position"]["x"]);

  for (keypoint in pose["keypoints"]){
    console.log(pose["keypoints"][keypoint]);
  }
})


function compPoseNet(poseNet1, poseNet2) {
  for (keypoint in pose["keypoints"]){
    console.log(pose["keypoints"][keypoint]);
  }
}

function weightedDistanceMatching(poseVector1, poseVector2) {
  let vector1PoseXY = poseVector1.slice(0, 34);
  let vector1Confidences = poseVector1.slice(34, 51);
  let vector1ConfidenceSum = poseVector1.slice(51, 52);

  let vector2PoseXY = poseVector2.slice(0, 34);

  // First summation
  let summation1 = 1 / vector1ConfidenceSum;

  // Second summation
  let summation2 = 0;
  for (let i = 0; i < vector1PoseXY.length; i++) {
    let tempConf = Math.floor(i / 2);
    let tempSum = vector1Confidences[tempConf] * Math.abs(vector1PoseXY[i] - vector2PoseXY[i]);
    summation2 = summation2 + tempSum;
  }

  return summation1 * summation2;
}
