function goProfile() {
  window.location.href = "profile.html";
}

function goUpload() {
  window.location.href = "upload.html";
}

$(document).ready(function() {
  initName();
  getList();

  //header buttons//
  $("#search-input").on('keyup', function() {
    searchAndFilter($(this).val());
  });

  $("button.video").mouseover(function(e){
    $("#tag").show();
    $("#tag").html(e.currentTarget.id);
  });

  $("button.video").mouseleave(function(){
    $("#tag").hide();
  });

});

function initName(){
  let myName = localStorage.getItem("name") || 'Name';
  $("#name").html(myName);
}

$(document).bind('mousemove', function(e) {
  $("#tag").css({
    left: e.pageX + 5,
    top: e.pageY - 20
  });
});

function searchAndFilter(searchTerm) {
  searchTerm=searchTerm.toLowerCase();
  if (searchTerm == '') {
    $("button.video").each(function() {
      $(this).show();
    });
  } else {
    $("button.video").each(function() {
      if($(this).attr('id').toLowerCase().includes(searchTerm)) {
        $(this).show();
        if(!$(".videos").is(":visible")) $(".videos").show();
      }
      else $(this).hide();
    });
  }
}

//ADD STUFF LATER//
function generateVideo(parent, name, thumb){
  let vid = document.createElement('button');
  parent.appendChild(vid);
  vid.setAttribute("class", "thumbnail");
  let img = document.createElement('img');
  img.setAttribute('src', thumb);
}

function getList(){
  Videos.list().then(console.log);
}
