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
var start, end, video, poses, fileread, sumscores, sumframes;
var record = false;
var timestamps = ['00:03', '00:07', '00:15', '01:22']
var endi = 0;

var color;
var videocanvas;
var ctx;
var webcamcanvas;
var webcamctx;
var videourl;
var name;

$(document).ready(function () {
    let id = localStorage.getItem('id');
    Videos.read(id).then(function (e) {
        name = e.data.name; //gets name
        videourl = e.data.url; //gets url
    });
    document.getElementById("name").innerHTML = name;

    // var video = document.getElementById('vid');
    // var source = document.createElement('source');
    // source.setAttribute("src", videourl);
    // console.log(source);

    // video.appendChild(source);
    // video.play();








    var songname = "The Testing Song";
    localStorage.setItem('songname', songname);

    color = 'aqua';
    // webcam & video canvas setup
    webcamcanvas = document.getElementById('webcam-canvas');
    webcamcanvas.style.zIndex = 3;
    webcamctx = webcamcanvas.getContext('2d');


    videocanvas = document.getElementById('video-canvas');
    videocanvas.style.zIndex = 3;
    ctx = videocanvas.getContext('2d');

    setInterval(clearPoints, 400);

    loadPosenet();

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

    record = false;
    $("#rec").click(function () {
        record = true;
        sumscores = 0;
        sumframes = 0;
        video.ready(function () {
            this.abLoopPlugin.setStart(0).setEnd(d).togglePauseAfterLooping().playLoop();
        });
    });

    video.ready(function () {
        this.abLoopPlugin.setStart(start).setEnd(end).playLoop();
    });


    // READ TEST FILE //
    fileread = false;
    if (fileread === false) {
        var stringData = $.ajax({
            url: "dance posenet.txt",
            async: false
        }).responseText;
        poses = JSON.parse(stringData);
        console.log(poses);
        fileread = true;
    }

    check();


});



var check = function () {
    if (fileread === true) {
        Webcam.set({
            width: 640,
            height: 480,
            image_format: 'jpeg',
            jpeg_quality: 90,
            flip_horiz: true
        });
        Webcam.attach('#webcam');
        Webcam.on('live', function () {
            take_snapshot();
        });
    } else {
        setTimeout(check, 1000);
    }
}

// convert timestamp to seconds
function stamp2sec(stamp) {
    return parseInt(stamp.slice(0, 2)) * 60 + parseInt(stamp.slice(3));
}

var frames = [];

// MOVED TO UPLOAD
// // extract frames from video
// function getVideoImage(path, secs, callback) {
//     var me = this,
//         video = document.createElement('video');
//     video.onloadedmetadata = function () {
//         if ('function' === typeof secs) {
//             secs = secs(this.duration);
//         }
//         this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
//     };
//     video.onseeked = function (e) {
//         var canvas = document.createElement('canvas');
//         canvas.height = video.videoHeight;
//         canvas.width = video.videoWidth;
//         var ctx = canvas.getContext('2d');
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//         var img = new Image();
//         img.src = canvas.toDataURL();
//         // frames.push(img); for some reason this doesn't work, the push is in the showImageAt function for now
//         callback.call(me, img, this.currentTime, e);
//     };
//     video.onerror = function (e) {
//         callback.call(me, undefined, undefined, e);
//     };
//     video.src = path;
// }

// MOVED TO UPLOAD.JS
// function showImageAt(secs) {
//     getVideoImage(
//         'testvid.mp4',
//         function (totalTime) {
//             duration = totalTime;
//             return secs;
//         },
//         function (img, secs, event) {
//             if (event.type == 'seeked') {
//                 //var li = document.createElement('li');
//                 //li.innerHTML += '<b>Frame at second ' + secs + ':</b><br />';
//                 frames.push(img);
//                 //li.appendChild(img);
//                 //document.getElementById('olFrames').appendChild(li);
//                 if (duration >= (secs += 0.2)) {
//                     showImageAt(secs);
//                 };
//                 // ok we need to store all of the frames together in one big frames[] array
//             }
//         }
//     );
// }
// showImageAt(0);

// setTimeout(() => {
//     console.log(frames);
// }, 100000);



// MOVED TO UPLOAD.JS
// var poses = [];

// function applyPosenet() {

//     var i = 0;

//     // single pose
//     var flipHorizontal = false;
//     while (i <= frames.length) {
//         posenet.load().then(function (net) {
//             var img = new Image();
//             img.onload = function () {

//             };

//             img.setAttribute('src', frames[i].src);
//             img.setAttribute('width', '640px');
//             img.setAttribute('height', '360px');

//             net.estimateSinglePose(img, {
//                     flipHorizontal: true
//                 }).then(function (pose) {
//                     poses.push(pose);
//                 })
//                 .then(function (pose) {
//                     console.log(poses);
//                 });

//         });
//         i++;
//     }

// }

function take_snapshot() {
    Webcam.snap(function (photo) {
        var phot = new Image();
        phot.onload = function () {

        };

        phot.setAttribute('src', photo);
        phot.setAttribute('width', '640px');
        phot.setAttribute('height', '360px');
        posenetImg(phot);
    });
    setTimeout(take_snapshot, 200);
}

/**
 * DRAWING FUNCTIONS
 */

function clearPoints() {
    ctx.clearRect(0, 0, videocanvas.width, videocanvas.height);
    webcamctx.clearRect(0, 0, webcamcanvas.width, webcamcanvas.height);
}

function drawPoint(y, x, r, color, canvasctx) {
    //ctx.clearRect(0, 0, videocanvas.width, videocanvas.height);
    //webcamctx.clearRect(0, 0, webcamcanvas.width, webcamcanvas.height);
    canvasctx.beginPath();
    canvasctx.arc(x, y, r, 0, 2 * Math.PI);
    canvasctx.fillStyle = color;

    canvasctx.fill();
}

function drawKeypoints(keypoints, canvasctx, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
        // setTimeout(ctx.clearRect(0, 0, videocanvas.width, videocanvas.height), 200);
        // setTimeout(webcamctx.clearRect(0, 0, webcamcanvas.width, webcamcanvas.height), 200);

        const keypoint = keypoints[i];
        // 0.7 is the min part confidence
        if (keypoint.score < 0.7) {
            continue;
        }
        const {
            y,
            x
        } = keypoint.position;
        drawPoint(y * scale, (webcamcanvas.width - x) * scale, 3, color, canvasctx);

    }
}

var result;

function posenetImg(inputimg) {
    posenet.load().then(function (net) {
        net.estimateSinglePose(inputimg, {
            flipHorizontal: true
        }).then(function (pose) {
            // console.log(pose);
            // console.log(poses[Math.round(video.currentTime() / 0.2)]);

            var slide = Math.round(video.currentTime() / 0.2);
            if (slide === poses.length) slide--;
            drawKeypoints(pose["keypoints"], webcamctx);
            drawKeypoints(poses[Math.round(video.currentTime() / 0.2)]["keypoints"], ctx);

            var result = compPoseNet(pose, poses[slide]);
            //console.log(result);
            document.getElementById("score").innerHTML = result;
            if (record === true && slide >= poses.length - 20) {
                record = false;
                sumscores /= sumframes;
                localStorage.setItem('score', Math.round(sumscores * 100));
                window.location = "score.html";
                //console.log(sumscores);<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<SUMSCORES AT THIS POINT SHOULD BE THE RECORDED VALUE! PLEASE SEND THIS TO SCORE PAGE!!!!
            } else if (record === false) {
                //console.log(record);
            } else {
                //console.log(slide);
                sumscores += result;
                sumframes++;
            }
        });
    })
}




// ALBERT's COMPARISON CODE BEGIN //
function compPoseNet(poseNet1, poseNet2) {
    let score = 2000
    vec1 = vectorizePoseNet(poseNet1);
    // console.log(vec1)
    vec2 = vectorizePoseNet(poseNet2)
    // console.log(vec2)
    score = weightedDistanceMatching(vec1, vec2);
    // console.log(score)
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

    // vec1 = array1;
    // console.log(vec1)

    // At this moment, the vec1 is not scaled or normalized. This code will do that before combining it with the scores. :)
    // To scale the vectors, we subtract the minimum coordinate value of that axis from all the coordinates for that axis
    minX = Number.MAX_VALUE
    minY = Number.MAX_VALUE
    for (i = 0; i < 33; i += 2) {
        // console.log(minX)
        currentX = vec1[i];
        // console.log(currentX)
        if (currentX < minX) {
            minX = currentX;
        }
        // console.log(i);
    }
    for (i = 1; i < 34; i += 2) {
        // console.log(minY)
        currentY = vec1[i];
        // console.log(currentY)
        if (currentY < minY) {
            minY = currentY;
        }
        // console.log(i);
    }
    for (i = 0; i < 33; i += 2) {
        vec1[i] -= minX;
    }
    for (i = 1; i < 34; i += 2) {
        vec1[i] -= minY;
    }

    // console.log(vec1)

    // Conduct L2 Vector Normalization

    let squaredSum = 0
    for (i = 0; i < 34; i++) {
        squaredSum += Math.pow(vec1[i], 2)
    }
    // console.log(squaredSum)

    let normalizedCoefficient = Math.sqrt(squaredSum)
    // console.log(normalizedCoefficient)

    for (i = 0; i < 34; i++) {
        vec1[i] /= normalizedCoefficient
    }

    // console.log(vec1)


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
    // console.log(summation1)
    // console.log(summation2)
    return 1 - summation1 * summation2;
}
