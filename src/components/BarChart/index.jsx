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
      .attr('width', 1400)
      .attr('height', 500)
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

    this.rangeX = [0.5, this.data.length + 0.5];
    this.rangeY = [0, maxAoG];

    this.xScale = d3
      .scaleLinear()
      .domain(this.rangeX)
      .range([0, 1400]);
    this.yScale = d3
      .scaleLinear()
      .domain(this.rangeY)
      .range([500, 0]);
  };

  setData = () => {
    let ctx = this.ctx
    ctx = this.canvas.node().getContext('2d');
    ctx.beginPath();
    
    ctx.fillStyle = "rgba(204, 235, 235, 0.8)";
    this.data.forEach((d) => {
      if (d.is_coord_phase) {
        ctx.fillRect(this.xScale(d.phase)-55, 0, 140, 500);
      }
    });

    ctx.fillStyle = "#2d9554";
    this.data.forEach((d) => {
      ctx.fillRect(this.xScale(d.phase)-25, this.yScale(d.existing_aog), 30, 500 - this.yScale(d.existing_aog));
    });

    ctx.fillStyle = "#40a0fd";
    this.data.forEach((d) => {
      ctx.fillRect(this.xScale(d.phase)+25, this.yScale(d.predicted_aog), 30, 500 - this.yScale(d.predicted_aog));
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