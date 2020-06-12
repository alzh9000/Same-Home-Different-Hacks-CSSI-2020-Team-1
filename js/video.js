var start, end, vid;

$(document).ready(function() {
    var timestamps = ['00:03', '00:07', '00:15', '01:22']
    vid = $('#vid')[0];
    for (var i = 0; i < timestamps.length; i++) {
        timestamps[i] = stamp2sec(timestamps[i]);
    }
    var starti = -1;
    var endi = 0;
    start = 0;
    if (timestamps.length > 0)  end = timestamps[0];
    else end = vid.duration;

    var video = videojs("vid",{
        plugins: {
          abLoopPlugin: {}
        }
    });

    $("#next").click(function() {
        if (endi < timestamps.length-1){
            starti += 1;
            endi += 1;
            start = end;
            end = timestamps[endi];
        }
        else if (endi === timestamps.length-1){
            starti += 1;
            endi += 1;
            start = end;
            end = vid.duration;
        }
        video.ready(function(){
            this.abLoopPlugin.setStart(start).setEnd(end).playLoop();
        });
    });

    video.ready(function(){
        this.abLoopPlugin.setStart(start).setEnd(end).playLoop();
    });

});

function stamp2sec(stamp) {
    return parseInt(stamp.slice(0,2))* 60 + parseInt(stamp.slice(3));
}