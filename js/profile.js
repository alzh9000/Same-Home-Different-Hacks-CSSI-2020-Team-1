let red = 'rgb(231, 111, 081)';
let orange = 'rgb(244, 162, 097)';
let yellow = 'rgb(233, 196, 106)';
let green = 'rgb(042, 157, 143)';
let black = 'rgb(038, 070, 083)';
let myChart, today, lastSevenDays;

$(document).ready(function() {
  initChart();
  initProfile();
  getScores();
  checkIfLoggedIn();
});

function checkIfLoggedIn(){
  Authentication.self().then(function(e){
    if(e.reason==="unauthorized") window.location.href = "login.html";
  });
}

function goHome() {
  window.location.href = "index.html";
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

//CHART STUFF - NONE OF THIS HAS BEEN TESTED YET//

function getScores(){
  Scores.all().then(function(e){
    //sorts all scores in a dictionary with each unique id
    let scoresArray = e.data;
    let scores = {};
    for(let i=0;i < scoresArray.length; i++){
      let s = scoresArray[i];
      //converts date to find index in lastSevenDays
      let d = new Date(s.timestamp * 1000);
      let index = lastSevenDays.findIndex(getDateString(d));
      scores[s.video_id][index] = s.score;
    }

    let colorInt = -1;
    let colors = [red, orange, yellow, green, black];

    for (var key in scores) {
      if (scores.hasOwnProperty(key)) {
        colorInt++;
        if(colorInt > colors.length-1) colorInt = 0;
        let c = colors[colorInt];

        Videos.read(key).then(function(f){
          date = {
            label: f.video_name,
            backgroundColor: c,
            data: scores[key]
          };
          myChart.data.datasets.push(data);
          myChart.update();
        });
      }
    }
  });
}

function getlastSevenDays(){
  today = new Date();

  lastSevenDays = [];
  for (let i=7; i > -1; i--){
    let thisDate = new Date();
    thisDate.setDate(thisDate.getDate()-i);
    lastSevenDays.push(getDateString(thisDate));
  }
  return lastSevenDays;
}

function getDateString(today) {
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  today = mm + '/' + dd;
  return today;
}

function initChart() {
  getScores();

  Chart.defaults.global.defaultFontSize = 16
  Chart.defaults.global.defaultFontColor = '#264653'
  let ctx = document.getElementById('myChart').getContext('2d');

  myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: getlastSevenDays(),
        datasets: [/*{
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
        }*/]
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
