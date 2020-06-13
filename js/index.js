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
  Videos.list().then(console.log());
}

// plus backend //

const url = "https://us-central1-daince-b612d.cloudfunctions.net/api";

// Helper function
async function sendRequest(method, path, body= null) {
    // Build request
    let options = { method: method, headers: {}, credentials: "include" }

    // Add options for POST/PUT requests
    if ((method === "POST" || method === "PUT") && body !== null) options.headers["Content-Type"] = "application/json";
    if (body !== null) options.body = JSON.stringify(body);

    // Send & parse requests
    let response = await fetch(`${url}${path}`, options);
    let json = await response.json();

    // Generate return data
    let base = { code: response.status, success: json.success }
    if (response.ok) base.data = json.data;
    else base.reason = json.reason;

    return base;
}

class Videos {
    // List all a user's files and the public files
    static async list() {
        return await sendRequest("GET", "/videos");
    }

    // Upload a file
    static async upload(file, name, pub, timestamps, status_callback=(snap) => console.log(snap.bytesTransferred / snap.totalBytes) * 100, error_callback=console.error) {
        let uid = localStorage.getItem("uid");
        let path = `${uid}/${uuid()}.mp4`;
        let ref = firebase.storage().ref().child(path);

        // Upload the file
        let upload = ref.put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED, status_callback, error_callback);
        await upload;

        // Get URL
        let download_url = await upload.snapshot.ref.getDownloadURL();

        // Send request to add to database
        return await sendRequest("POST", "/videos", {
            name: name,
            path: path,
            url: download_url,
            public: pub,
            timestamps: timestamps
        });
    }

    // Get the data for a video
    static async read(id) {
        return await sendRequest("GET", `/videos/${id}`);
    }

    // Delete a video
    static async delete(id) {
        return await sendRequest("DELETE", `/videos/${id}`);
    }
}
