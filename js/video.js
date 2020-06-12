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


//video player
var start, end, vid;

$(document).ready(function () {
    var timestamps = ['00:33', '01:22']
    vid = videojs("vid", {
        plugins: {
            abLoopPlugin: {}
        }
    });
    for (var i = 0; i < timestamps.length; i++) {
        timestamps[i] = stamp2sec(timestamps[i]);
    }
    start = 0;
    if (timestamps.length > 0) end = timestamps[0];
    else end = vid.duration;
    vid.ready(function () {
        this.abLoopPlugin.setStart(start).setEnd(end).playLoop();
    });

});

function stamp2sec(stamp) {
    return parseInt(stamp.slice(0, 2)) * 60 + parseInt(stamp.slice(3));
}


// https://stackoverflow.com/questions/32699721/javascript-extract-video-frames-reliably
// extract frames from video
async function extractFramesFromVideo(vid, fps = 25) {
return new Promise(async (resolve) => {

    let seekResolve;
    vid.addEventListener('seeked', async function () {
        if (seekResolve) seekResolve();
    });

    vid.src = videoObjectUrl;

    let duration = end - start;

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let [w, h] = [vid.videoWidth, vid.videoHeight]
    canvas.width = w;
    canvas.height = h;

    let frames = [];
    let interval = 1 / fps;
    let currentTime = 0;

    while (currentTime < duration) {
        vid.currentTime = currentTime;
        await new Promise(r => seekResolve = r);

        context.drawImage(vid, 0, 0, w, h);
        let base64ImageData = canvas.toDataURL();
        frames.push(base64ImageData);

        currentTime += interval;
    }
    resolve(frames);
});
});

let frames = await extractFramesFromVideo(vid);

var currentFrame = 0;
var poses = [];

// single pose
var flipHorizontal = false;
while (currentFrame <= frames.length) {
    posenet.load().then(function (net) {
        const pose = net.estimateSinglePose(imageElement, {
            flipHorizontal: true
        });
        poses.push(pose);
    }).then(function (pose) {
        console.log(pose);
    })
}