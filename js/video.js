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
var start, end, video;
var timestamps = ['00:03', '00:07', '00:15', '01:22']
var endi = 0;


$(document).ready(function () {
    var d = 10000;

    for (var i = 0; i < timestamps.length; i++) {
        timestamps[i] = stamp2sec(timestamps[i]);
    }

    video = videojs("vid", {
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

    Webcam.set({
        width: 640,
        height: 480,
        image_format: 'jpeg',
        jpeg_quality: 90,
        flip_horiz: true
       });
    Webcam.attach( '#webcam' );
    Webcam.on( 'live', function() {
        take_snapshot();
    } );

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
                //var li = document.createElement('li');
                //li.innerHTML += '<b>Frame at second ' + secs + ':</b><br />';
                frames.push(img);
                //li.appendChild(img);
                //document.getElementById('olFrames').appendChild(li);
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

var poses = [];

function applyPosenet() {

    var currentFrame = 0;

    // single pose
    var flipHorizontal = false;
    while (currentFrame <= frames.length) {
        posenet.load().then(function (net) {
            var img = new Image();
            img.onload = function () {

            };

            img.setAttribute('src', frames[currentFrame].src);
            img.setAttribute('width', '640px');
            img.setAttribute('height', '360px');

            net.estimateSinglePose(img, {
                flipHorizontal: true
            }).then(function(pose) {
                poses.push(pose);
            });

        });
        currentFrame++;
    }
    
}

function take_snapshot() {
    Webcam.snap( function(photo) {
        var phot = new Image();
        phot.onload = function () {

        };

        phot.setAttribute('src', photo);
        phot.setAttribute('width', '640px');
        phot.setAttribute('height', '360px');
        posenetImg(phot);
    });
    setTimeout(take_snapshot, 1000);
}

function posenetImg(inputimg) {
    posenet.load().then(function (net) {
        net.estimateSinglePose(inputimg, {
            flipHorizontal: true
        }).then(function(pose) {
            console.log(pose);
            console.log(poses.length);
            console.log(poses[Math.round(video.currentTime()/0.2)]);
        });
    })
}
