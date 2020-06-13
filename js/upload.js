$(document).ready(function() {
  $('#file').change(function(e){
    $('#file-label').html(getfileName(e.currentTarget.value));
  });
});

function getfileName(fullPath){
  let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
  let fileName = fullPath.substring(startIndex);
  if (fileName.indexOf('\\') === 0 || fileName.indexOf('/') === 0) fileName = fileName.substring(1);
  if (fileName === '') fileName = "No file selected.";
  return fileName;
}

function goHome() {
  window.location.href = "index.html";
}
