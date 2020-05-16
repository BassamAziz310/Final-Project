let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;


let svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("NBA_shotchart.csv").then(function(NBA_shotchart) {
    
        NBA_shotchart.forEach(function(data) {
            data.FG_percen = +FG_percen;
            data.PPG = +data.PPG;
      });

        let xLinearScale = d3.scaleLinear()
            .domain([20, d3.max(NBA_shotchart, d => d.FG_percen)])
            .range([0, width]);
        
        let yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(NBA_shotchart, d => d.PPG)])
            .range([height, 0]);
        
        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);
            
            
        let circlesGroup = chartGroup.selectAll("circle")
        .data(NBA_shotchart)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.FG_percen))
        .attr("cy", d => yLinearScale(d.PPG))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5");


        let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
        return (`${d.Player_Name}<br>FG_percen: ${d.FG_percen}<br>PPG: ${d.PPG}`);
        });
        
        chartGroup.call(toolTip);


        circlesGroup.on("click", function(data) {
            toolTip.show(data, this);
          })


          .on("mouseout", function(data, index) {
            toolTip.hide(data);
          });
        

        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 40)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("PPG");
        
        chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .attr("class", "axisText")
          .text("FG%");
    }).catch(function(error) {
        console.log(error);
    });


