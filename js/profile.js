$(document).ready(function() {
  initChart();
});

function initChart() {
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {labels: ['Risk Level'],
  datasets: [
    { /* dataset one */ },
    { /* dataset two */ },
    { /* dataset three */ }
  ]},
    options: {}
  });
}

function logData(){

}

function goHome() {
  window.location.href = "index.html";
}
