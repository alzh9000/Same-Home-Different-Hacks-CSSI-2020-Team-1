$(document).ready(function() {
  initChart();
  initProfile();
});

let red = 'rgb(231, 111, 081)';
let orange = 'rgb(244, 162, 097)';
let yellow = 'rgb(233, 196, 106)';
let green = 'rgb(042, 157, 143)';
let black = 'rgb(038, 070, 083)';

function initProfile() {
  let myName = localStorage.getItem("name") || 'Name';
  let myID = localStorage.getItem("uid") || 'ID';

  $("#name").html(myName);
  $("#uid").html("user id: " + myID);
}

function initChart() {
  Chart.defaults.global.defaultFontSize = 16
  Chart.defaults.global.defaultFontColor = '#264653'
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["06/04/19", "06/05/19", "06/06/19", "06/07/19", "06/08/19", "06/09/19", "06/10/19", "06/11/19", "06/12/19"],
        datasets: [{
          label: 'Rick Astley - Never Gonna Give You Up',
          backgroundColor: red,
          data: [98, 37, 0, 0, 0, 0, 0, 0, 0],
        }, {
          label: 'Darude - Sandstorm',
          backgroundColor: orange,
          data: [30, 70, 75, 90, 0, 0, 0, 0, 0],
        }, {
          label: 'All Star - Smash Mouth',
          backgroundColor: yellow,
          data: [0, 0, 0, 0, 58, 80, 87, 0, 51],
        }, {
          label: 'Big Time Rush - Big Time Rush',
          backgroundColor: green,
          data: [0, 0, 0, 0, 0, 0, 0, 12, 74],
        }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          displayColors: true,
          callbacks: {
            mode: 'x',
          },
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display: false,
            }
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
            type: 'linear',
          }]
        }
    }
  });
}

function logData() {

}

function goHome() {
  window.location.href = "index.html";
}
