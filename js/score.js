$(document).ready(function() {
  initChart();
});

let red = 'rgb(231, 111, 081)';
let orange = 'rgb(244, 162, 097)';
let yellow = 'rgb(233, 196, 106)';
let green = 'rgb(042, 157, 143)';
let black = 'rgb(038, 070, 083)';

let data = {
  datasets: [{
    data: [90, 10],
    backgroundColor: [yellow, black],
    borderWidth: 2,
    borderColor: black
  }]
}

let options = {
  tooltips: {enabled: false},
  hover:{mode:null},
  responsive: true,
  cutoutPercentage: 80,
  animationEasing: 'easeOutQuart',
  title: {
    display: true,
    position: "top",
    text: "How did you do?",
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontColor: black
  },
  legend: {
    display: true,
    position: "bottom",
    labels: {
      fontColor: "#333",
      fontSize: 16
    }
  }
};

function initChart() {
  let ctx = document.getElementById('myChart').getContext('2d');

  gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)');

  let scoreChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options
  });
}

function goHome() {
  window.location.href = "index.html";
}
