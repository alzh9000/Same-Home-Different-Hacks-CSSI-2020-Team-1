var start, end, vid;

$(document).ready(function() {
    var timestamps = ['00:33', '01:22']
    vid = $('#vid')[0];
    for (var i = 0; i < timestamps.length; i++) {
        timestamps[i] = stamp2sec(timestamps[i]);
    }
    start = 0;
    if (timestamps.length > 0)  end = timestamps[0];
    else end = vid.duration;
    vid.addEventListener('timeupdate', timeupdate, false);

});

function stamp2sec(stamp) {
    return parseInt(stamp.slice(0,2))* 60 + parseInt(stamp.slice(3));
}

function timeupdate() {
    if (vid.currentTime < start || vid.currentTime >= end ) {
        vid.currentTime = start;
    }
}