$(document).ready(function () {
  var timeData = [],
    eco2Data = [],
    tvocData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'eCO2',
        yAxisID: 'eCO2',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: eco2Data
      },
      {
        fill: false,
        label: 'TVOC',
        yAxisID: 'TVOC',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: tvocData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'VOC Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'eCO2',
        type: 'linear',
        scaleLabel: {
          labelString: 'eCO2(ppm)',
          display: true
        },
        position: 'left',
      }, {
          id: 'TVOC',
          type: 'linear',
          scaleLabel: {
            labelString: 'TVOC(ppb)',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.tvoc) {
        return;
      }
      timeData.push(obj.time);
      tvocData.push(obj.tvoc);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        tvocData.shift();
      }

      if (obj.eco2) {
        eco2Data.push(obj.eco2);
      }
      if (eco2Data.length > maxLen) {
        eco2Data.shift();
      }

      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
