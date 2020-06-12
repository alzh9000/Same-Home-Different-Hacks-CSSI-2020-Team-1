// loading pre-trained PoseNet Model
const net = await posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {
        width: 640,
        height: 480
    },
    multiplier: 0.75
});

// single pose
var flipHorizontal = false;

var imageElement = document.getElementById('cat');

posenet.load().then(function (net) {
    const pose = net.estimateSinglePose(imageElement, {
        flipHorizontal: true
    });
    return pose;
}).then(function (pose) {
    console.log(pose);
})