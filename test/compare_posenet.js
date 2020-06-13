// ok, so I'm gonna work on creating a function in JavaScript that compares 2 posenet objects (1 from the user, 1 from the template, at the same frame), and returns a decimal from 1 to 0 indicating how closely the user matches the template, with 1 being a perfect match and 0 being a terrible match
// The function will take the posenet objects and wrap a box around each, then use the positions of the body parts to convert the positions into relative positions based on the dimensions of the box

var flipHorizontal = false;

var imageElement = document.getElementById('dancer');

posenet.load().then(function (net) {
  const pose = net.estimateSinglePose(imageElement, {
    flipHorizontal: true
  });
  return pose;
}).then(function (pose) {
  let pose2 = pose;
  score =  compPoseNet(pose, pose2);
  console.log(score)
})


function compPoseNet(poseNet1, poseNet2) {
  let score = 2000
  vec1 = vectorizePoseNet(poseNet1);
  console.log(vec1)
  vec2 = vectorizePoseNet(poseNet2)
  console.log(vec2)
  score = weightedDistanceMatching(vec1, vec2);
  console.log(score)
  return score
}

function vectorizePoseNet(poseNet1) {
  // Initialize the PoseNet vector as an empty arrays that we'll add to
  let vec1 = new Array();

  for (keypoint in poseNet1["keypoints"]) {
    let coordinates = poseNet1["keypoints"][keypoint]["position"];
    // console.log(coordinates);
    let xCoor = coordinates['x'];
    let yCoor = coordinates['y'];
    vec1.push(xCoor);
    vec1.push(yCoor);
    // console.log(vec1);
  }

  // console.log(vec1)

  // At this moment, the vec1 is not scaled or normalized. This code will do that before combining it with the scores. :) 
  // To scale the vectors, we subtract the minimum coordinate value of that axis from all the coordinates for that axis
  minX = Number.MAX_VALUE
  minY = Number.MAX_VALUE
  for (i = 0; i < 33; i+=2) {
    // console.log(minX)
    currentX = vec1[i];
    // console.log(currentX)
    if (currentX < minX) {
      minX = currentX;
    }
    // console.log(i);
  }
  for (i = 1; i < 34; i+=2) {
    // console.log(minY)
    currentY = vec1[i];
    // console.log(currentY)
    if (currentY < minY) {
      minY = currentY;
    }
    // console.log(i);
  }
  for (i = 0; i < 33; i+=2) {
    vec1[i] -= minX;
  }
  for (i = 1; i < 34; i+=2) {
    vec1[i] -= minY;
  }

  // console.log(vec1)

  // Conduct L2 Vector Normalization

  let squaredSum = 0
  for (i = 0; i < 34; i++) {
    squaredSum += Math.pow(vec1[i], 2)
  }
  console.log(squaredSum)

  let normalizedCoefficient = Math.sqrt(squaredSum)
  console.log(normalizedCoefficient)

  for (i = 0; i < 34; i++) {
    vec1[i] /= normalizedCoefficient
  }

  console.log(vec1)


  // Finish by adding the other values needed in the vector
  let total_confidence1 = 0;
  for (keypoint in poseNet1["keypoints"]) {
    let confidence = poseNet1["keypoints"][keypoint]["score"];
    // console.log(total_confidence1);
    vec1.push(confidence);
    total_confidence1 += confidence;
  }
  vec1.push(total_confidence1);
  return vec1;
}

// poseVector1 and poseVector2 are 52-float vectors composed of:
// Values 0-33: are x,y coordinates for 17 body parts in alphabetical order
// Values 34-51: are confidence values for each of the 17 body parts in alphabetical order
// Value 51: A sum of all the confidence values
// Again the lower the number, the closer the distance
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
  console.log(summation1)
  console.log(summation2)
  return summation1 * summation2;
}
