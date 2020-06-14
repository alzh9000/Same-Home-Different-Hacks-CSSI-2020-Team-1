var fileUrl;
$(document).ready(function () {
  //$("#vidiv").hide();
  $('#file').change(function (e) {
    var fileInput = document.getElementById('file');
    fileUrl = window.URL.createObjectURL(fileInput.files[0]);
    $('#file-label').html(getfileName(e.currentTarget.value));
    $("#vidiv").attr("src", fileUrl);
    console.log(fileUrl);
  });
  loadPosenet();



  $('#ok-button').click(function () {
    showImageAt(0);
  });
});

/* POSENET STUFF BEGINS HERE */

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

var frames = [];

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

var extract_complete = false;

function showImageAt(secs) {
  getVideoImage(
    fileUrl,
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
        if ((duration - 0.2) >= (secs += 0.2)) {
          showImageAt(secs);
          console.log("working");
        } else {
          extract_complete = true;
          console.log('done working');
          applyPosenet();
        };
        // ok we need to store all of the frames together in one big frames[] array
      }
    }
  );
}


var poses = [];

function applyPosenet() {
  // execute after showImageAt(0) is completely done executing
  // const result = await showImageAt(0);
  // console.log(frames);

  // single pose
  for (var i = 0; i < frames.length; i++) {
    // console.log(i);

    var img = new Image();
    img.onload = function () {

    };
    //console.log(i);
    img.setAttribute('src', frames[i].src);
    img.setAttribute('width', '640px');
    img.setAttribute('height', '360px');

    net.estimateSinglePose(img, {
        flipHorizontal: true
      }).then(function (pose) {
        poses.push(pose);
        //console.log(poses);
      })
      .then(function (pose) {
        console.log("pose..");
      });

  }
  console.log(poses);
}


/* POSENET STUFF ENDS HERE */



function getfileName(fullPath) {
  let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
  let fileName = fullPath.substring(startIndex);
  if (fileName.indexOf('\\') === 0 || fileName.indexOf('/') === 0) fileName = fileName.substring(1);
  if (fileName === '') fileName = "No file selected.";
  return fileName;
}

function goHome() {
  window.location.href = "index.html";
}