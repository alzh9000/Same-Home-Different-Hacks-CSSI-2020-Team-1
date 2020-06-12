// loading pre-trained PoseNet Model

// const net = await posenet.load({
//     architecture: 'MobileNetV1',
//     outputStride: 16,
//     inputResolution: {
//         width: 640,
//         height: 480
//     },
//     multiplier: 0.75
// });


//video player
var start, end, vid;

$(document).ready(function () {
    vid = $("#vid")[0];
    var timestamps = ['00:33', '01:22']
    for (var i = 0; i < timestamps.length; i++) {
        timestamps[i] = stamp2sec(timestamps[i]);
    }
    start = 0;
    if (timestamps.length > 0) end = timestamps[0];
    else end = vid.duration;

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


        vid.addEventListener('loadeddata', async function () {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let [w, h] = [vid.videoWidth, vid.videoHeight]
            canvas.width = w;
            canvas.height = h;

            let frames = [];
            // let interval = 1 / fps;
            let interval = 1;
            let currentTime = start;
            let duration = end - start;

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

        // set video src *after* listening to events in case it loads so fast
        // that the events occur before we were listening.
        vid.src = videoObjectUrl;

    });
}

const getFrames = async () => {
    const frames = await extractFramesFromVideo(vid);
    var currentFrame = 0;
    var poses = [];

    // PoseNet model on all frames of the video
    var flipHorizontal = false;
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

}

// extractFramesFromVideo.then(getFrames()).catch((error) => {
//     return error;
// });




// PoseNet model on a single frame (test)
var flipHorizontal = false;

var imageElement = document.getElementById('dance');


posenet.load().then(function (net) {
    const pose = net.estimateSinglePose(imageElement, {
        flipHorizontal: true
    });
    return pose;
}).then(function (pose) {
    console.log(pose);
})