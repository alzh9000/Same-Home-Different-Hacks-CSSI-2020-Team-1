$(document).ready(function () {
  let score = localStorage.getItem('score') || '00';
  initChart(score);
});

let red = 'rgb(231, 111, 081)';
let orange = 'rgb(244, 162, 097)';
let yellow = 'rgb(233, 196, 106)';
let green = 'rgb(042, 157, 143)';
let black = 'rgb(038, 070, 083)';

let options = {
  tooltips: {
    enabled: false
  },
  hover: {
    mode: null
  },
  responsive: true,
  cutoutPercentage: 90,
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

function initChart(score) {
  let id = localStorage.getItem('id');
  Scores.submit(id, score);
  let ctx = document.getElementById('myChart').getContext('2d');
  $("#score-text").html(score + "%");

  gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)');

  //kinda wonky but it works
  let data = [20, 20, 20, 40, 0];
  if (score > 99) data = [20, 20, 20, 40, 0];
  else if (score > 80) data = [20, 20, 20, score - 60, 100 - score];
  else if (score > 60) data = [20, 20, score - 40, 0, 100 - score];
  else if (score > 40) data = [20, score - 20, 0, 0, 100 - score];
  else data = [score, 0, 0, 0, 100 - score];

  let songName = localStorage.getItem('songname') || 'No song selected.';
  let description = songName + "<br><br>";
  if(score > 90) description += "Wow, you've practically mastered it! Practice more to perfect this dance or take on a new challenge.";
  else if (score > 75) description += "Great job! You're almost there. Practice more to bump up your score."
  else description += "Nice try! Practice more to improve your score."
  $("#score-description").html(description);

  let scoreChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: data,
        backgroundColor: [red, orange, yellow, green, black],
        borderWidth: 2,
        borderColor: black
      }]
    },
    options: options
  });
}

function goHome() {
  window.location.href = "index.html";
}
