import React from 'react';
import * as d3 from 'd3';
import './Boxplot.css'

interface IProps {
    width: number,
    height: number,
    data: any
}

interface IState {

}

class Boxplot extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    private buildGraph() {
        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 30, bottom: 30, left: 55 };
        const width: number = this.props.width - margin.left - margin.right;
        const height: number = this.props.height - margin.top - margin.bottom;
        // append the svg object to the body of the page
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Read the data and compute summary statistics for each specie
        d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then(function (data) {

            // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
            let groupRes = d3.group(data, function (d) { return d.Species; });
            let sumstat = new Map<string, object>();
            groupRes.forEach((v, k) => {
                let q1 = d3.quantile(v.map(function (g: any) { return g.Sepal_Length; }).sort(d3.ascending), .25);
                let median = d3.quantile(v.map(function (g: any) { return g.Sepal_Length; }).sort(d3.ascending), .5);
                let q3 = d3.quantile(v.map(function (g: any) { return g.Sepal_Length; }).sort(d3.ascending), .75);
                if (!q3 || !q1 || !k) {
                    return NaN;
                }
                let interQuantileRange = q3 - q1;
                let min = q1 - 1.5 * interQuantileRange
                let max = q3 + 1.5 * interQuantileRange
                sumstat.set(k, {
                    q1: q1,
                    median: median,
                    q3: q3,
                    interQuantileRange: interQuantileRange,
                    min: min,
                    max: max
                });
            });
            console.log(sumstat);

            // Show the X scale
            var x = d3.scaleBand()
                .range([0, width])
                .domain(["setosa", "versicolor", "virginica"])
                .paddingInner(1)
                .paddingOuter(.5)
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))

            // Show the Y scale
            var y = d3.scaleLinear()
                .domain([3, 9])
                .range([height, 0])
            svg.append("g").call(d3.axisLeft(y))

            let mouseover = function (d: any) {
                let max = d.target.__data__[1].max.toPrecision(3);
                let q3 = d.target.__data__[1].q3.toPrecision(3);
                let median = d.target.__data__[1].median.toPrecision(3);
                let q1 = d.target.__data__[1].q1.toPrecision(3);
                let min = d.target.__data__[1].min.toPrecision(3);
                d3.select(".tooltip-container")
                    .style("opacity", 1)
                    .style("z-index", 1000);

                d3.select(".tooltip-container")
                    .style("transform", "scale(1,1)");
                d3.select(".tooltip")
                    .html("Máximo: " + max + "<br>3º Quartil: " + q3 + "<br>Mediana: " + median + "<br>1º Quartil: " + q1 + "<br>Mínimo: " + min);

                d3.selectAll(".myRectangle")
                    .style("opacity", 0.1)
                d3.selectAll("." + d.target.__data__[0])
                    .style("opacity", 1)
            };

            let mousemove = function (d: any) {
                d3.select(".tooltip-container")
                    .style("-webkit-transition-property", "none")
                    .style("-moz-transition-property", "none")
                    .style("-o-transition-property", "none")
                    .style("transition-property", "none")
                    .style("left", (d.pageX + 20) + "px")
                    .style("top", (d.pageY + 10) + "px");
            };

            let mouseleave = function (d: any) {
                d3.selectAll(".tooltip-container")
                    .style("opacity", 0)
                    .style("z-index", -1000)
                    .style("transform", "scale(0.1,0.1)")
                    .style("transition", "all .2s ease-in-out");
                d3.selectAll(".myRectangle")
                    .style("opacity", 1)
            };

            // Show the top vertical line
            svg
                .selectAll("topVertLine")
                .data(sumstat)
                .enter()
                .append("line")
                .attr("x1", function (d: any) { return (Number(x(d[0]))) })
                .attr("x2", function (d: any) { return (Number(x(d[0]))) })
                .attr("y1", function (d: any) { return (y(d[1].max)) })
                .attr("y2", function (d: any) { return (y(d[1].q3)) })
                .attr("class", function (d) { return "myRectangle " + d[0] })
                .attr("stroke", "black")
                .style("width", 40)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

            // Show the bottom vertical line
            svg
                .selectAll("bottomVertLine")
                .data(sumstat)
                .enter()
                .append("line")
                .attr("x1", function (d: any) { return (Number(x(d[0]))) })
                .attr("x2", function (d: any) { return (Number(x(d[0]))) })
                .attr("y1", function (d: any) { return (y(d[1].min)) })
                .attr("y2", function (d: any) { return (y(d[1].q1)) })
                .attr("class", function (d) { return "myRectangle " + d[0] })
                .attr("stroke", "black")
                .style("width", 40)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

            // Show the top horizontal line
            svg
                .selectAll("topHorizLine")
                .data(sumstat)
                .enter()
                .append("line")
                .attr("y1", function (d: any) { return (y(d[1].max)) })
                .attr("y2", function (d: any) { return (y(d[1].max)) })
                .attr("x1", function (d: any) { return (Number(x(d[0])) - 20) })
                .attr("x2", function (d: any) { return (Number(x(d[0])) + 20) })
                .attr("class", function (d) { return "myRectangle " + d[0] })
                .attr("stroke", "black")
                .style("width", 40)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

            // Show the bottom horizontal line
            svg
                .selectAll("topHorizLine")
                .data(sumstat)
                .enter()
                .append("line")
                .attr("y1", function (d: any) { return (y(d[1].min)) })
                .attr("y2", function (d: any) { return (y(d[1].min)) })
                .attr("x1", function (d: any) { return (Number(x(d[0])) - 20) })
                .attr("x2", function (d: any) { return (Number(x(d[0])) + 20) })
                .attr("stroke", "black")
                .attr("class", function (d) { return "myRectangle " + d[0] })
                .style("width", 40)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

            // rectangle for the main box
            var boxWidth = 60;
            svg
                .selectAll("boxes")
                .data(sumstat)
                .enter()
                .append("rect")
                .attr("x", function (d: any) { return ((x(d[0]) || 0) - boxWidth / 2) })
                .attr("y", function (d: any) { return (y(d[1].q3)) })
                .attr("height", function (d: any) { return (y(d[1].q1) - y(d[1].q3)) })
                .attr("width", boxWidth)
                .attr("stroke", "black")
                .attr("class", function (d) { return "myRectangle " + d[0] })
                .style("fill", "#69b3a2")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

            svg
                .selectAll("medianLines")
                .data(sumstat)
                .enter()
                .append("line")
                .attr("x1", function (d: any) { return ((x(d[0]) || 0) - boxWidth / 2) })
                .attr("x2", function (d: any) { return ((x(d[0]) || 0) + boxWidth / 2) })
                .attr("y1", function (d: any) { return (y(d[1].median)) })
                .attr("y2", function (d: any) { return (y(d[1].median)) })
                .attr("class", function (d) { return "myRectangle " + d[0] })
                .attr("stroke", "black")
                .style("width", 80)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
        });
    }

    componentDidMount() {
        // activate   
        this.buildGraph();
    }

    render() {
        return (
            <div>
                <div className="svg" >
                    <svg className="container" ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
                </div>
                <div className="tooltip-container">
                    <div className="tooltip"></div>
                </div>
            </div>
        );
    }
}

export default Boxplot;