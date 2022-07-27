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

    this.rangeX = [0, this.data.length];
    this.rangeY = [0, maxAoG];

    this.xScale = d3
      .scaleLinear()
      .range(this.rangeX)
      .domain([0, 1000]);
    this.yScale = d3
      .scaleLinear()
      .range(this.rangeY)
      .domain([700, 0]);
  };

  setData = () => {
    let ctx = this.ctx
    ctx = this.canvas.node().getContext('2d');
    ctx.beginPath();
    
    ctx.moveTo(-6.5, 0 + 0.5);
    ctx.lineTo(0.5, 0 + 0.5);
    ctx.lineTo(0.5, 700 + 0.5);
    ctx.lineTo(-6.5, 700 + 0.5);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("Frequency", -10, 10);
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