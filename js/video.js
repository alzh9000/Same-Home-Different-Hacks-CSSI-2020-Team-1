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
let imgs = [];

function extractFramesFromVideo(video) {
    let duration = end - start;

    var video = document.querySelector('video');
    var array = [];
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var pro = document.querySelector('#progress');

    function initCanvas(e) {
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
    }

    function drawFrame(e) {
        this.pause();
        ctx.drawImage(this, 0, 0);
        /* 
        this will save as a Blob, less memory consumptive than toDataURL
        a polyfill can be found at
        https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill
        */
        canvas.toBlob(saveFrame, 'image/jpeg');
        pro.innerHTML = ((this.currentTime / duration) * 100).toFixed(2) + ' %';
        if (this.currentTime < duration) {
            this.play();
        }
    }

    function saveFrame(blob) {
        array.push(blob);
    }

    function revokeURL(e) {
        URL.revokeObjectURL(this.src);
    }

    function onend(e) {
        var img;
        // do whatever with the frames
        for (var i = 0; i < array.length; i++) {
            img = new Image();
            img.onload = revokeURL;
            img.src = URL.createObjectURL(array[i]);
            document.body.appendChild(img);
            imgs.push(img);
        }
        // we don't need the video's objectURL anymore
        URL.revokeObjectURL(this.src);
    }

    video.addEventListener('loadedmetadata', initCanvas, false);
    video.addEventListener('timeupdate', drawFrame, false);
    video.addEventListener('ended', onend, false);

    video.src = URL.createObjectURL(this.files[0]);
    video.play();
}


const getFrames = async () => {

const frames = await extractFramesFromVideo('testvid.mp4');
var currentFrame = 0;
var poses = [];

// PoseNet model on all frames of the video
var flipHorizontal = false;
console.log('test');

while (currentFrame <= frames.length) {
    async function estimatePoseOnImage(currentFrame) {
        // load the posenet model from a checkpoint
        const net = await posenet.load();

        const pose = await net.estimateSinglePose(currentFrame, {
            flipHorizontal: false
        });
        poses.push(pose);
        // return pose;
    }

    const pose = estimatePoseOnImage(currentFrame);

    console.log(pose);
}
console.log(poses);

});
}

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