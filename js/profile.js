let red = 'rgb(231, 111, 081)';
let orange = 'rgb(244, 162, 097)';
let yellow = 'rgb(233, 196, 106)';
let green = 'rgb(042, 157, 143)';
let black = 'rgb(038, 070, 083)';
let myChart, today;

$(document).ready(function() {
  initChart();
  initProfile();
  addData();
});

function addData() {
  data = {
    label: 'Rssssssss',
    backgroundColor: black,
    data: [22, 34, 0, 24, 0, 0, 0, 0, 42, 0, 0]
  };
  myChart.data.datasets.push(data);
  myChart.update();
}

function goHome() {
  window.location.href = "index.html";
}

function getScores(){ //HAVENT TESTED YET
  Scores.all().then(function(e){

    //sorts all scores in a dictionary with each unique id
    let scoresArray = e.data;
    let scores = {};
    for(let i=0;i < scoresArray.length; i++){
      let s = scoresArray[i];
      if(s.name in scores) scores[s.name].push(s.score);
      else scores[s.name] = [s.score];
    }

    for (var key in scores) {
      if (scores.hasOwnProperty(key)) {
        Videos.read(key).then(function(e){

        });
        console.log(key, scores[key]);
      }
    }
  });
}



function initProfile() {
  if (localStorage.getItem("photo") !== null) $("#icon").attr("src", localStorage.getItem("photo"));
  let myName = localStorage.getItem("name") || 'Name';
  $("#name").html(getFirstWord(myName));
}

function getFirstWord(string){
  let firstWord = string.replace(/ .*/,'');
  return firstWord;
}

function getLastTenDays(){
  today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  today = mm + '/' + dd;

  let labels = [];
  for (let i=7; i > -1; i--){
    let thisDate = new Date();
    thisDate.setDate(thisDate.getDate()-i);
    let thisDD = String(thisDate.getDate()).padStart(2, '0');
    let thisMM = String(thisDate.getMonth() + 1).padStart(2, '0');
    labels.push(thisMM + '/' + thisDD);
  }
  return labels;
}

function initChart() {
  getScores();

  Chart.defaults.global.defaultFontSize = 16
  Chart.defaults.global.defaultFontColor = '#264653'
  let ctx = document.getElementById('myChart').getContext('2d');

  myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: getLastTenDays(),
        datasets: [{
          label: 'Rick Astley - Never Gonna Give You Up',
          backgroundColor: red,
          data: [98, 37, 0, 0, 0, 0, 0],
        }, {
          label: 'Darude - Sandstorm',
          backgroundColor: orange,
          data: [30, 70, 75, 90, 0, 0, 0],
        }, {
          label: 'All Star - Smash Mouth',
          backgroundColor: yellow,
          data: [0, 0, 0, 0, 58, 80, 87],
        }, {
          label: 'Big Time Rush - Big Time Rush',
          backgroundColor: green,
          data: [0, 0, 0, 0, 0, 0, 0],
        }]
      },
      options: {
        title: {
          display: true,
          position: "top",
          text: "Progress Over the Past Week",
          fontFamily: 'Montserrat',
          fontSize: 18,
          fontColor: black
        },
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
