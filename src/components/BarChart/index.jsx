import React, { Component, createRef } from "react";
import * as d3 from "d3";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.ctx = null;
    this.chartRef = createRef();
    this.xScale = null;
    this.yScale = null;
    this.rangeX = [0, 0];
    this.rangeY = [0, 0];
    this.data = props.data;
  }

  drawCanvas = () => {
    this.canvas = d3.select(this.chartRef.current)
      .append('canvas')
      .attr('width', 1000)
      .attr('height', 700)
  }

  getInitialAxis = () => {
    let maxAoG = 0;
    this.data.forEach((phase => {
      if (phase.existing_aog > maxAoG) {
        maxAoG = phase.existing_aog;
      }
      if (phase.predicted_aog > maxAoG) {
        maxAoG = phase.predicted_aog;
      } 
    }))

    this.rangeX = [0, this.data.length + 1];
    this.rangeY = [0, maxAoG];

    this.xScale = d3
      .scaleLinear()
      .domain([this.rangeX])
      .range([0, 1000]);
    this.yScale = d3
      .scaleLinear()
      .range(this.rangeY)
      .domain([700, 0]);
  };

  setData = () => {
    let ctx = this.ctx
    ctx = this.canvas.node().getContext('2d');
    ctx.beginPath();
    
    ctx.fillStyle = "steelblue";
    this.data.forEach((d) => {
      console.log(d.phase, d.existing_aog, 10, 700 - d.existing_aog)
      ctx.fillRect(d.phase, d.existing_aog, 10, 700 - d.existing_aog);
    });

    ctx.closePath()
  }

  componentDidMount() {
    this.getInitialAxis();
    this.drawCanvas();
    this.setData();
  }

  render() {
    return(
      <div className="bar-chart" ref={this.chartRef}>
      </div>
    )
  }
}

export default BarChart;