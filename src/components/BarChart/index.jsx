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
        ctx.fillRect(this.xScale(d.phase)-65, 0, 160, this.height);
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
    let xTickCount = this.data.length,
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

    // Blue rectangles for existing AoG
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

        //If difference in existing and predicted larger than length of arrow head, 
        if ((this.yScale(d.existing_aog) - this.yScale(d.predicted_aog)) > 12) {
          //Draw arrow head
          ctx.beginPath();
          ctx.moveTo(this.xScale(i+1) - 16, this.yScale(d.predicted_aog) + 12);
          ctx.lineTo(this.xScale(i+1) - 4, this.yScale(d.predicted_aog) + 12);
          ctx.lineTo(this.xScale(i+1) - 10, this.yScale(d.predicted_aog));
          ctx.lineTo(this.xScale(i+1) - 16, this.yScale(d.predicted_aog) + 12);
          ctx.strokeStyle = "#c6c9cc";
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = "#009999";
          ctx.fill();

          //Draw tail
          ctx.beginPath();
          ctx.moveTo(this.xScale(i+1) - 10, this.yScale(d.existing_aog) - 3);
          ctx.lineTo(this.xScale(i+1) - 10, this.yScale(d.predicted_aog) + 12);
          ctx.strokeStyle = "#009999";
          ctx.stroke();

        } else {

          //Draw arrow head only
          ctx.beginPath();
          ctx.moveTo(this.xScale(i+1) - 16, this.yScale(d.existing_aog) - 3);
          ctx.lineTo(this.xScale(i+1) - 4, this.yScale(d.existing_aog) - 3);
          ctx.lineTo(this.xScale(i+1) - 10, this.yScale(d.existing_aog) - 15);
          ctx.lineTo(this.xScale(i+1) - 16, this.yScale(d.existing_aog) - 3);
          ctx.strokeStyle = "#c6c9cc";
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = "#009999";
          ctx.fill();
        }

      } else if (d.existing_aog > d.predicted_aog) {
        //Draw arrow head
        ctx.beginPath();
        ctx.moveTo(this.xScale(i+1) + 40, this.yScale(d.predicted_aog) - 3);
        ctx.lineTo(this.xScale(i+1) + 46, this.yScale(d.predicted_aog) - 15);
        ctx.lineTo(this.xScale(i+1) + 34, this.yScale(d.predicted_aog) - 15);
        ctx.lineTo(this.xScale(i+1) + 40, this.yScale(d.predicted_aog) - 3);
        ctx.strokeStyle = "#c6c9cc";
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "#fc4850";
        ctx.fill();

        //Draw tail
        if ((this.yScale(d.predicted_aog) - this.yScale(d.existing_aog)) > 12) {
          ctx.beginPath();
          ctx.moveTo(this.xScale(i+1) + 40, this.yScale(d.predicted_aog) - 15);
          ctx.lineTo(this.xScale(i+1) + 40, this.yScale(d.existing_aog));
          ctx.strokeStyle = "#fc4850";
          ctx.stroke();
        }
        
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