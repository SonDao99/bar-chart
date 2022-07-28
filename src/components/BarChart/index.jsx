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
    this.divWidth = 1400;
    this.divHeight = 500;
    this.margin = {top: 100, left: 100, right: 10, bottom: 50};
    this.width = this.divWidth - this.margin.left - this.margin.right;
    this.height = this.divHeight - this.margin.top - this.margin.bottom;
  }

  drawCanvas = () => {
    this.canvas = d3.select(this.chartRef.current)
      .append('canvas')
      .attr('width', this.divWidth)
      .attr('height', this.divHeight)
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
    this.rangeY = [0, maxAoG + 1000];

    this.xScale = d3
      .scaleLinear()
      .domain(this.rangeX)
      .range([0, this.width]);
    this.yScale = d3
      .scaleLinear()
      .domain(this.rangeY)
      .range([this.height, 0]);
  };

  drawData = () => {
    let ctx = this.ctx;
    ctx = this.canvas.node().getContext('2d');
    ctx.translate(this.margin.left, this.margin.top);

    // Highlight for coordination phases
    ctx.fillStyle = "rgba(204, 235, 235, 0.8)";
    this.data.forEach((d) => {
      if (d.is_coord_phase) {
        ctx.fillRect(this.xScale(d.phase)-55, 0, 140, this.height);
      }
    });

    //Dotted horizontal lines
    let yTickCount = 11,
      yTicks = this.yScale.ticks(yTickCount),
	    yTickFormat = this.yScale.tickFormat();

    ctx.setLineDash([2, 2])
    ctx.beginPath();
    yTicks.forEach((d, i) => {
      if (i === 0 || i === yTickCount) return;
      ctx.moveTo(0.5, this.yScale(d) + 0.5);
      ctx.lineTo(this.width - 0.5, this.yScale(d) + 0.5);
    });
    ctx.strokeStyle = "#c6c9cc";
    ctx.stroke();

    //y axis labels
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#b2b8bd";
    ctx.font = "12px arial"
    yTicks.forEach((d, i) => {
      if (i % 2 === 0) {
        ctx.fillText(yTickFormat(d), -15, this.yScale(d));
      }
    });

    ctx.save();
    ctx.rotate(Math.PI/2);
    ctx.fillText("AoG Volume Count", 130, 70);
    ctx.restore();

    //x axis labels
    let xTickCount = 8,
      xTicks = this.xScale.ticks(xTickCount),
      xTickFormat = (d) => `PHASE ${d}`;

    ctx.fillStyle = "#b2b8bd";
    ctx.font = "13px arial"
    xTicks.forEach((d, i) => {
      if (this.data[i].is_coord_phase) {
        ctx.fillStyle = "#11a0a0";
      } else {
        ctx.fillStyle = "#b2b8bd";
      }
      ctx.fillText(xTickFormat(d), this.xScale(d)+45, this.height + this.margin.bottom/2);
    });

    //Lines for x axis, y axis and horizontal line at the top of the chart
    ctx.setLineDash([])
    ctx.beginPath();
    ctx.moveTo(0.5, 0.5);
    ctx.lineTo(0.5, this.height - 0.5);
    ctx.lineTo(this.width - 0.5, this.height - 0.5);
    ctx.moveTo(0.5, 0.5);
    ctx.lineTo(this.width - 0.5, 0.5);
    ctx.strokeStyle = "#c6c9cc";
    ctx.stroke();

    // Blue rectangles for existign AoG
    ctx.fillStyle = "#2d9554";
    this.data.forEach((d) => {
      ctx.fillRect(this.xScale(d.phase)-25, this.yScale(d.existing_aog), 30, this.height - this.yScale(d.existing_aog));
    });

    //Green rectangles for predicted AoG
    ctx.fillStyle = "#40a0fd";
    this.data.forEach((d) => {
      ctx.fillRect(this.xScale(d.phase)+25, this.yScale(d.predicted_aog), 30, this.height - this.yScale(d.predicted_aog));
    });

  }

  drawArrows = () => {
    let ctx = this.ctx;
    ctx = this.canvas.node().getContext('2d');

    this.data.forEach((d, i) => {
      if (d.predicted_aog > d.existing_aog) {
        ctx.beginPath();
        ctx.moveTo(this.xScale(i) - 20, (this.yScale(d.predicted_aog) - 20));
        ctx.lineTo(this.xScale(i) - 10, (this.yScale(d.predicted_aog) - 20));
        ctx.lineTo(this.xScale(i) - 15, (this.yScale(d.predicted_aog) - 30));
        ctx.lineTo(this.xScale(i) - 20, (this.yScale(d.predicted_aog) - 20));
        // ctx.fillStyle("green");
        // ctx.fill();
        ctx.strokeStyle = "#c6c9cc";
        ctx.stroke();
        ctx.closePath();
      } else if (d.predicted_aog > d.existing_aog) {
        return;
      } else {
        return;
      }
    })
  }

  componentDidMount() {
    this.drawCanvas();
    this.getInitialAxis();
    this.drawData();
    this.drawArrows();
  }

  render() {
    return(
      <div className="bar-chart" ref={this.chartRef} style={{width:"1400px", height: "500px"}}>
      </div>
    )
  }
}

export default BarChart;