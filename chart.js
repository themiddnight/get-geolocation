const latList = [];
const lonList = [];
const accList = [];
const speedList = [];

// Clear graph button event
clearGraphBtn.addEventListener("click", () => {
  latList.length = 0;
  lonList.length = 0;
  accList.length = 0;
  speedList.length = 0;
  latLonChart.render();
  speedChart.render();
});

// Chart
const latLonChart = new CanvasJS.Chart("latLonChartContainer", {
  title: { text: "Latitude and Longitude" },
  axisY: { title: "Latitude" },
  axisY2: { title: "Longitude" },
  data: [
    {
      type: "line",
      name: "Latitude",
      showInLegend: true,
      dataPoints: latList,
    },
    {
      type: "line",
      name: "Longitude",
      axisYType: "secondary",
      showInLegend: true,
      dataPoints: lonList,
    },
  ],
});

const speedChart = new CanvasJS.Chart("speedChartContainer", {
  title: { text: "Speed, Accuracy" },
  axisY: { title: "Accuracy (m)" },
  axisY2: { title: "Speed (m/s)" },
  data: [
    {
      type: "line",
      name: "Accuracy",
      showInLegend: true,
      dataPoints: accList,
    },
    {
      type: "line",
      name: "Speed",
      axisYType: "secondary",
      showInLegend: true,
      dataPoints: speedList,
    },
  ],
});

// functions
export function updateChart(count, lat, lon, acc, speed) {
  if (latList.length >= 100) {
    latList.length = 0;
    lonList.length = 0;
    accList.length = 0;
    speedList.length = 0;
  }
  latList.push({ label: count, y: lat });
  lonList.push({ label: count, y: lon });
  accList.push({ label: count, y: acc });
  speedList.push({ label: count, y: speed? speed : 0 });
  latLonChart.render();
  speedChart.render();
}