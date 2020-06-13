function goProfile() {
  window.location.href = "profile.html";
}

function goUpload() {
  window.location.href = "upload.html";
}

$(document).ready(function() {
  if (localStorage.getItem("photo") !== null) $("#icon").attr("src", localStorage.getItem("photo"));
  getVideos();

  //header buttons//
  $("#search-input").on('keyup', function() {
    searchAndFilter($(this).val());
  });

  $("button.video").mouseover(function(e){
    $("#tag").show();
    $("#tag").html(e.currentTarget.value);
  });

  $("button.video").mouseleave(function(){
    $("#tag").hide();
  });

});

$(document).bind('mousemove', function(e) {
  $("#tag").css({
    left: e.pageX + 5,
    top: e.pageY - 20
  });
});
var shownImages = [];
function searchAndFilter(searchTerm) {
  searchTerm=searchTerm.toLowerCase();
  if (searchTerm == '') {
    $("button.video").each(function() {
      $(this).show();
      $("#no-results").hide();
    });
  } else {
    $("button.video").each(function() {
      if($(this).attr('value').toLowerCase().includes(searchTerm)) {
        $(this).show();
        if(!$(".videos").is(":visible")){
          $(".videos").show();
        }
      }
      else {
        $(this).hide();
      }
    });
  }

}


//ADD STUFF LATER//
function getVideos(){
  generateVideo('daince', 'assets/daince-art.png', 'daince logo');
  generateVideo('wave', 'assets/wave.png', 'waving');
  /*
  Videos.list().then(function(e) {
    videosArray = e.data;
    for(let i=0;i < videosArray.length; i++) {
      generateVideo(videosArray[i].id, videosArray[i].thumb, videosArray[i].name);
    }
  });*/
}

function generateVideo(id, thumb, name){
  let parent = document.getElementById('video-parent');
  let video = document.createElement('button');
  parent.appendChild(video);
  video.setAttribute("id", id);
  video.setAttribute("value", name);
  video.setAttribute("class", "wrapper block video");

  let videoImage = document.createElement('img');
  video.appendChild(videoImage);
  videoImage.setAttribute("src", thumb); //CHECK THIS LATER

  video.addEventListener('click', function(){
    alert("you clicked on " + name);
  });
}
