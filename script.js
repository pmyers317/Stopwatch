const TARGET_TIME = 3000;
let startTime;
let attempts = [];
let chartData = [];

function toggleFunction() {
  let button = document.getElementById("toggleButton");
  let resultDiv = document.getElementById("result");
  let summaryDiv = document.getElementById("summary");

  if (button.innerHTML === "Start") {
    button.innerHTML = "Stop";
    startTime = new Date().getTime();
  } else {
    let stopTime = new Date().getTime();
    let elapsedTime = stopTime - startTime;
    let difference = Math.abs(elapsedTime - TARGET_TIME);

    let resultText;
    let indicatorClass;

    if (difference <= 200) {
      resultText = "Within +/- 0.2 seconds";
      indicatorClass = "green";
    } else if (difference <= 500) {
      resultText = "Within +/- 0.5 seconds";
      indicatorClass = "blue";
    } else {
      resultText = "Greater than 0.5 seconds";
      indicatorClass = "red";
    }

    resultDiv.innerHTML = `<div class="result-indicator ${indicatorClass}"></div> Elapsed Time: ${elapsedTime / 1000} seconds - ${resultText}`;

    attempts.push({
      attemptNumber: attempts.length + 1,
      startTime: startTime,
      stopTime: stopTime,
      elapsedTime: elapsedTime,
      resultText: resultText
    });

    updateSummary(summaryDiv);

    button.innerHTML = "Start";

    chartData.push({ x: attempts.length, y: elapsedTime });
    renderChart();
  }
}

function updateSummary(summaryDiv) {
  let min = Math.min(...attempts.map(attempt => attempt.elapsedTime));
  let max = Math.max(...attempts.map(attempt => attempt.elapsedTime));
  let totalAttempts = attempts.length;
  let totalElapsed = attempts.reduce((acc, attempt) => acc + attempt.elapsedTime, 0);
  let avg = totalElapsed / totalAttempts;

  summaryDiv.innerHTML = `<p>Total Attempts: ${totalAttempts}</p>
                          <p>Min Elapsed Time: ${min / 1000} seconds</p>
                          <p>Max Elapsed Time: ${max / 1000} seconds</p>
                          <p>Average Elapsed Time: ${avg / 1000} seconds</p>`;
}

function renderChart() {
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Elapsed Time',
        data: chartData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom'
        }]
      }
    }
  });
}

function toggleSummary() {
  var summaryDiv = document.getElementById("summary");
  if (summaryDiv.style.display === "none") {
    summaryDiv.style.display = "block";
    updateSummary(summaryDiv);
  } else {
    summaryDiv.style.display = "none";
  }
}
