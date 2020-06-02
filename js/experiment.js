var numberOfSensor = 0;

$(document).ready(function () {

  if (Sensor.get("number")) {
		numberOfSensor = Number(Sensor.get("number"));
	}
	// console.log("Sensor Length", numberOfSensor);

  var dataTemp = [];
  var dataRegXY = [];
  var regX = [];
  var regY = [];
  var sbx = [];
  var sby = [];
  var dataNumber = 0;
  var imageNumber = 0;
  var regClicked = 0;
  var plotName = "plot-bidangmiring_";
  var dataName = "data-bidangmiring_";

  ready();

  setInterval(function () {
    if (dataNumber < 10) {
      $("#plotData").remove();
      $("<div id=\"plotData\" style=\"width:100%;height:450px;\"></div>").appendTo('#plot-data');
      dataTemp.push(new Date() + "," + Sensor.get((dataNumber + 1).toString()));
      $("#table-data tbody").append("<tr><td>" + (dataNumber + 1).toString() + "</td><td>" + dataTemp[dataNumber].split(",")[0] + "</td><td>" + ((new Date(dataTemp[dataNumber].split(",")[0]).getTime() - new Date(dataTemp[0].split(",")[0]).getTime())/1000).toString() + "</td><td class=\"text-center\">" + Sensor.get((dataNumber + 1).toString()) + "</td></tr>");
      // console.log(dataTemp);
      var tempDataXY = [];
      sbx.push((new Date(dataTemp[dataNumber].split(",")[0]).getTime() - new Date(dataTemp[0].split(",")[0]).getTime())/1000.);
      sby.push(Number(dataTemp[dataNumber].split(",")[1]));
      tempDataXY.push((new Date(dataTemp[dataNumber].split(",")[0]).getTime() - new Date(dataTemp[0].split(",")[0]).getTime())/1000.);
      tempDataXY.push(Number(dataTemp[dataNumber].split(",")[1]));
      // console.log(sbx);
      // console.log(sby);
      // console.log(tempDataXY);
      dataRegXY.push(tempDataXY);
      // console.log(dataRegXY);
      var trace = {
        x: sbx,
        y: sby,
        mode: "markers",
        type: "scatter",
        name: 'Data',
        marker: { size: 8 }
      };
      var layout = {
        plot_bgcolor: "transparent",
        paper_bgcolor: "transparent",
        font: {
          color: "#9A9A9A"
        },
        xaxis: {
          title: {
            text: "t (s)"
          },
          gridcolor: "#3F3F3F",
          gridwidth: 0.5
        },
        yaxis: {
          title: {
            text: "s (cm)"
          },
          gridcolor: "#3F3F3F",
          gridwidth: 0.5
        },
      };
      var config = {
        responsive: true,
        scrollZoom: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["toImage","zoom2d","pan2d","select2d","lasso2d","toggleSpikelines","resetScale2d"],
        modeBarButtonsToAdd: [{
          name: "Save plot as a png",
          icon: Plotly.Icons.camera,
          click: function (gd) {
            imageNumber++;
            Plotly.downloadImage(gd, {
              filename: plotName + formatName(new Date()),
              format: "png",
              height: 500,
              width: 700,
              scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            });
          }
        },{
          name: "Draw regression",
          icon: Plotly.Icons["drawline"],
          click: function (gd) {
            regX = [];
            regY = [];
            console.log(gd);
            if ($(".btn-core.active span").html().toLowerCase() == "linear") {
              plotName += "linear_";
              var result = regression.linear(dataRegXY);
              var xMax = Math.ceil(Math.max.apply(null, sbx));
              var xMin = Math.floor(Math.min.apply(null, sbx));
              for (var i = xMin * 100; i <= xMax * 100; i++) {
                regX.push(i/100);
                regY.push((result.equation[0] * i/100) + result.equation[1]);
              }
            } else if ($(".btn-core.active span").html().toLowerCase() == "quadratic") {
              plotName += "quadratic_";
              var result = regression.polynomial(dataRegXY, { order: 2 });
              var xMax = Math.ceil(Math.max.apply(null, sbx));
              var xMin = Math.floor(Math.min.apply(null, sbx));
              for (var i = xMin * 100; i <= xMax * 100; i++) {
                regX.push(i/100);
                regY.push((result.equation[0] * i/100 * i/100) + (result.equation[1] * i/100) + result.equation[2]);
              }
            }
            $.notify({
				      icon: "tim-icons icon-chart-bar-32",
				      message: result.string
				    }, {
				      type: "primary",
				      timer: 8000,
				      placement: {
				        from: "top",
				        align: "right"
				      }
				    });
            if (regClicked > 0) {
              if (gd.data.length > 1) {
                Plotly.deleteTraces(gd, [-1]);
                Plotly.addTraces(gd, {
                  x: regX,
                  y: regY,
                  mode: 'lines',
                  type: 'scatter',
                  name: 'Regression'
                });
              } else {
                Plotly.addTraces(gd, {
                  x: regX,
                  y: regY,
                  mode: 'lines',
                  type: 'scatter',
                  name: 'Regression'
                });
              }
              // Plotly.deleteTraces(gd, [-1]);
            } else {
              Plotly.addTraces(gd, {
                x: regX,
                y: regY,
                mode: 'lines',
                type: 'scatter',
                name: 'Regression'
              });
              regClicked++
            }
          }
        }]
      };
      var dataPlot = [trace];
      Plotly.newPlot('plotData', dataPlot, layout, config);
      dataNumber++;
    }
  }, 2000);

  $("#save-data").click(function (evt) {
    var textData = "";
    for (var i = 0; i < sbx.length; i++) {
      textData += sbx[i] + "," + sby[i] + "\n";
    }
    var blob = new Blob([textData], { type: "text/csv" });
    var anchor = document.createElement("a");
    var filename = dataName + formatName(new Date()) + ".csv";
    anchor.download = filename;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = "_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  });

});

// function formatName(date,number) {
function formatName(date) {
  var day = date.getDate().toString().padStart(2,"0");
  var monthIndex = (date.getMonth() + 1).toString().padStart(2,"0");
  var year = date.getFullYear();
  return year + "" + monthIndex + "" + day;
  // return year + "" + monthIndex + "" + day + "_" + number.toString().padStart(3,"0");
}
