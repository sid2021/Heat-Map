let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let req = new XMLHttpRequest();

let values = [];
let baseTemp;

let xScale;
let yScale;

let width = 1200;
let height = 600;
let padding = 75;

let legendData = [
  {
    text: "2.8",
    color: "#3c40c6",
  },
  {
    text: "3.9",
    color: "#575fcf",
  },
  {
    text: "6.1",
    color: "#4bcffa",
  },
  {
    text: "7.2",
    color: "#d2dae2",
  },
  {
    text: "8.3",
    color: "#ffdd59",
  },
  {
    text: "9.5",
    color: "#ffd32a",
  },
  {
    text: "10.6",
    color: "#ffc048",
  },
  {
    text: "11.7",
    color: "#ffa801",
  },
  {
    text: "12.8",
    color: "#ff5e57",
  },
  {
    text: "",
    color: "#ff3f34",
  },
];

let svg = d3.select("svg");

let tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

let drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

let generateScales = () => {
  xScale = d3
    .scaleLinear()
    .range([padding, width - padding])
    .domain([d3.min(values, (d) => d.year), d3.max(values, (d) => d.year) + 1]);

  yScale = d3
    .scaleTime()
    .range([padding, height - padding])
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)]);
};

let drawCells = () => {
  svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("fill", (d) => {
      let temp = baseTemp + d.variance;
      if (temp <= 2.8) {
        return "#3c40c6";
      } else if (temp <= 3.9) {
        return "#575fcf";
      } else if (temp <= 5.0) {
        return "#0fbcf9";
      } else if (temp <= 6.1) {
        return "#4bcffa";
      } else if (temp <= 7.2) {
        return "#d2dae2";
      } else if (temp <= 8.3) {
        return "#ffdd59";
      } else if (temp <= 9.5) {
        return "#ffd32a";
      } else if (temp <= 10.6) {
        return "#ffc048";
      } else if (temp <= 11.7) {
        return "#ffa801";
      } else if (temp <= 12.8) {
        return "#ff5e57";
      } else {
        return "#ff3f34";
      }
    })
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemp + d.variance)
    .attr(
      "width",
      (d) =>
        (width - 2 * padding) /
        (d3.max(values, (d) => d.year) - d3.min(values, (d) => d.year))
    )
    .attr("height", (height - 2 * padding) / 12)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
    .on("mouseover", (d) => {
      let date = new Date(d.year, d.month - 1);
      tooltip
        .attr("data-year", d.year)
        .html(
          d3.timeFormat("%Y - %B")(date) +
            "<br>" +
            d3.format(".1f")(baseTemp + d.variance) +
            "&#8451;" +
            "<br>" +
            d3.format(".1f")(d.variance) +
            "&#8451;"
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px")
        .style("opacity", 0.9);
    })
    .on("mouseout", (d) => {
      tooltip.style("opacity", 0);
    });
};

let generateAxes = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  // Create SVG group element and place axis on the canvas
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)");
};

let createLegend = () => {
  let legend = svg
    .append("g")
    .attr("id", "legend")
    .selectAll("g")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item");

  legend
    .append("rect")
    .attr("class", "legend-item-rect")
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", (d, i) => 450 + i * 30)
    .attr("y", 550)
    .attr("fill", (d, i) => d.color);

  legend
    .append("text")
    .attr("class", "legend-item-text")
    .text((d) => d.text)
    .attr("x", (d, i) => 450 + i * 30)
    .attr("y", 595)
    .attr("transform", "translate(20, 0)");
};

req.open("GET", url, true);
req.onload = () => {
  let object = JSON.parse(req.responseText);
  baseTemp = object.baseTemperature;
  values = object.monthlyVariance;

  drawCanvas();
  generateScales();
  drawCells();
  generateAxes();
  createLegend();
};
req.send();
