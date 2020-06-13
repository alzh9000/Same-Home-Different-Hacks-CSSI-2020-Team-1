// loading pre-trained PoseNet Model
let net;
async function loadPosenet() {
    net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: {
            width: 640,
            height: 480
        },
        multiplier: 0.75
    });
}


//video player
var start, end, vid;
var timestamps = ['00:03', '00:07', '00:15', '01:22']
var endi = 0;


$(document).ready(function () {
    var d = 10000;

    for (var i = 0; i < timestamps.length; i++) {
        timestamps[i] = stamp2sec(timestamps[i]);
    }

    var video = videojs("vid", {
        plugins: {
            abLoopPlugin: {}
        }
    });

    var starti = -1;
    start = 0;
    if (timestamps.length > 0) end = timestamps[0];
    else end = d;
    console.log(d);

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
            end = d;
        }
        video.ready(function () {
            this.abLoopPlugin.setStart(start).setEnd(end).playLoop();
        });
    });

    $("#prev").click(function () {
        if (starti > 0) {
            starti -= 1;
            endi -= 1;
            end = start;
            start = timestamps[starti];
        } else if (starti === 0) {
            starti -= 1;
            endi -= 1;
            end = start;
            start = 0;
        }
        video.ready(function () {
            this.abLoopPlugin.setStart(start).setEnd(end).playLoop();
        });
    });

    var record = false;
    $("#rec").click(function () {
        record = true;
        video.ready(function () {
            this.abLoopPlugin.setStart(0).setEnd(d).togglePauseAfterLooping().playLoop();
        });
    });

    video.ready(function () {
        this.abLoopPlugin.setStart(start).setEnd(end).playLoop();
    });

    //WEBCAM
    var wc = document.querySelector("#videoElement");

    //running into error here: Uncaught TypeError: Cannot read property 'getUserMedia' of undefined
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
                video: true
            })
            .then(function (stream) {
                wc.srcObject = stream;
            })
            .catch(function (err0r) { //0 lol
                console.log("Something went wrong!");
            });
    }

});

// convert timestamp to seconds
function stamp2sec(stamp) {
    return parseInt(stamp.slice(0, 2)) * 60 + parseInt(stamp.slice(3));
}

var frames = [];

// https://cwestblog.com/2017/05/03/javascript-snippet-get-video-frame-as-an-image/
// extract frames from video
function getVideoImage(path, secs, callback) {
    var me = this,
        video = document.createElement('video');
    video.onloadedmetadata = function () {
        if ('function' === typeof secs) {
            secs = secs(this.duration);
        }
        this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
    };
    video.onseeked = function (e) {
        var canvas = document.createElement('canvas');
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var img = new Image();
        img.src = canvas.toDataURL();
        // frames.push(img); for some reason this doesn't work, the push is in the showImageAt function for now
        callback.call(me, img, this.currentTime, e);
    };
    video.onerror = function (e) {
        callback.call(me, undefined, undefined, e);
    };
    video.src = path;
}


function showImageAt(secs) {
    getVideoImage(
        'testvid.mp4',
        function (totalTime) {
            duration = totalTime;
            return secs;
        },
        function (img, secs, event) {
            if (event.type == 'seeked') {
                var li = document.createElement('li');
                li.innerHTML += '<b>Frame at second ' + secs + ':</b><br />';
                frames.push(img);
                li.appendChild(img);
                document.getElementById('olFrames').appendChild(li);
                if (duration >= (secs += 0.2)) {
                    showImageAt(secs);
                };
                // ok we need to store all of the frames together in one big frames[] array
            }
        }
    );
}
showImageAt(0);


console.log(frames);

function applyPosenet() {

    var currentFrame = 0;
    var poses = [];

    // single pose
    var flipHorizontal = false;
    while (currentFrame <= frames.length) {
        posenet.load().then(function (net) {
            // something wrong with this reference? should it be poses[currentFrame].value ?
            const pose = net.estimateSinglePose(poses[currentFrame], {
                flipHorizontal: true
            });
        }).then(function (pose) {
            poses.push(pose);
            console.log(pose);
        })
        currentFrame++;
    }

}
console.log(poses);