$(document).ready(function() {
  initChart();
});

function initChart() {
  Chart.defaults.global.defaultFontSize = 16
  Chart.defaults.global.defaultFontColor = '#264653'
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        datasets: [{
          label: 'Rick Astley - Never Gonna Give You Up (Video)',
          backgroundColor: "#caf270",
          data: [12, 59, 5, 56, 58, 12, 59, 87, 45],
        }, {
          label: 'Darude - Sandstorm',
          backgroundColor: "#45c490",
          data: [12, 59, 5, 56, 58, 12, 59, 85, 23],
        }, {
          label: 'All Star - Smash Mouth',
          backgroundColor: "#008d93",
          data: [12, 59, 5, 56, 58, 12, 59, 65, 51],
        }, {
          label: 'Big Time Rush - Big Time Rush',
          backgroundColor: "#2e5468",
          data: [12, 59, 5, 56, 58, 12, 59, 12, 74],
        }]
      },
      options: {
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
