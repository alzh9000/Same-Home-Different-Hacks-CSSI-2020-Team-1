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
    var timestamps = ['00:03', '00:07', '00:15', '01:22']
    vid = $('#vid')[0];
    for (var i = 0; i < timestamps.length; i++) {
        timestamps[i] = stamp2sec(timestamps[i]);
    }
    var starti = -1;
    var endi = 0;
    start = 0;
    if (timestamps.length > 0) end = timestamps[0];
    else end = vid.duration;

    var video = videojs("vid", {
        plugins: {
            abLoopPlugin: {}
        }
    });

    $("#next").click(function () {
        if (endi < timestamps.length - 1) {
            starti += 1;
            endi += 1;
            start = end;
            end = timestamps[endi];
        } else if (endi === timestamps.length - 1) {
            starti += 1;
            endi += 1;
            start = end;
            end = vid.duration;
        }
        video.ready(function () {
            this.abLoopPlugin.setStart(start).setEnd(end).playLoop();
        });
    });

    video.ready(function () {
        this.abLoopPlugin.setStart(start).setEnd(end).playLoop();
    });

});

function stamp2sec(stamp) {
    return parseInt(stamp.slice(0, 2)) * 60 + parseInt(stamp.slice(3));
}


// https://stackoverflow.com/questions/32699721/javascript-extract-video-frames-reliably
// extract frames from video
async function extractFramesFromVideo(videoUrl, fps = 25) {

    return new Promise(async (resolve) => {

        let videoBlob = await fetch(videoUrl).then(r => r.blob());
        let videoObjectUrl = URL.createObjectURL(videoBlob);
        let vid = document.createElement("vid");


        let seekResolve;
        vid.addEventListener('seeked', async function () {
            if (seekResolve) seekResolve();
        });

        vid.src = videoObjectUrl;


        video.addEventListener('loadeddata', async function () {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let [w, h] = [vid.videoWidth, vid.videoHeight]
            canvas.width = w;
            canvas.height = h;

            let frames = [];
            let interval = 1 / fps;
            let currentTime = start;
            let duration = end - start;

            while (currentTime < duration) {
                video.currentTime = currentTime;
                await new Promise(r => seekResolve = r);

                context.drawImage(video, 0, 0, w, h);
                let base64ImageData = canvas.toDataURL();
                frames.push(base64ImageData);

                currentTime += interval;
            }
            resolve(frames);
        });

        // set video src *after* listening to events in case it loads so fast
        // that the events occur before we were listening.
        vid.src = videoObjectUrl;
        console.log(frames);
    });
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

}

// extractFramesFromVideo.then(getFrames()).catch((error) => {
//     return error;
// });

var currentFrame = 0;
var poses = [];



// TEST: PoseNet model on a single frame
// var flipHorizontal = false;

// var imageElement = document.getElementById('dance');


// posenet.load().then(function (net) {
//     const pose = net.estimateSinglePose(imageElement, {
//         flipHorizontal: true
//     });
//     return pose;
// }).then(function (pose) {
//     console.log(pose);
// })