function goProfile() {
  window.location.href = "profile.html";
}

function goUpload() {
  window.location.href = "upload.html";
}

function checkIfLoggedIn(){
  Authentication.self().then(function(e){
    if(e.reason==="unauthorized") window.location.href = "login.html";
  });
}

$(document).ready(function() {
  checkIfLoggedIn();

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

function logout(){
  Authentication.logout();
  window.location.href = "login.html";
}

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
  Videos.list().then(function(e) {
    let videosArray = e.data;
    for(let i=0;i < videosArray.length; i++) {
      generateVideo(videosArray[i].id, videosArray[i].thumbnail, videosArray[i].name);
    }
  });
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
  Videos.thumbnail(thumb).then(function(e){
    videoImage.setAttribute("src", e);
  });

  video.addEventListener('click', function(){
    localStorage.setItem('id', id);
    window.location.href = "video.html";
  });
}
