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
  $("div#tag").hide();

  if (localStorage.getItem("photo") !== null) $("#icon").attr("src", localStorage.getItem("photo"));
  getVideos();

  //header buttons//
  $("#search-input").on('keyup', function() {
    searchAndFilter($(this).val());
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
    let results = 0;
    $("button.video").each(function() {
      if($(this).attr('value').toLowerCase().includes(searchTerm)) {
        $(this).show();
        results++;
        if(!$(".videos").is(":visible")){
          $(".videos").show();
        }
      }
      else {
        $(this).hide();
      }
    });
    if(results==0) $("#no-results").show();
    else $("#no-results").hide();
  }
}

function getVideos(){
  Videos.list().then(function(e) {
    let videosArray = e.data;
    for(let i=0;i < videosArray.length; i++) {
      generateVideo(videosArray[i].id, videosArray[i].thumbnail, videosArray[i].name);
    }
    $("#loading").hide();
  });
}

function setTag(e){
  $("div#tag").show();
  $("div#tag").html(e.value);
}

function hideTag(){
  $("div#tag").hide();
}

function generateVideo(id, thumb, name){
  let parent = document.getElementById('video-parent');
  let video = document.createElement('button');
  parent.appendChild(video);

  video.setAttribute("value", name);
  video.setAttribute("onmouseover", "setTag(this)");
  video.setAttribute("onmouseleave", "hideTag()");
  video.setAttribute("class", "wrapper block video");
  video.setAttribute("id", id);

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
