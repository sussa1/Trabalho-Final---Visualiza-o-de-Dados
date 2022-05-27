// @ts-ignore: Object is possibly 'undefined'.

import React from 'react';
import * as d3 from 'd3';
import './Pareto.css'

interface IProps {
    width: number,
    height: number,
    data: any
}

interface IState {

}

class Pareto extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    private buildGraph() {
        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 10, bottom: 70, left: 50};
        const width: number = this.props.width*1.2 - margin.left - margin.right;
        const height: number = this.props.height*1.5 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Parse the Data
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv").then ( function(data) {

            // sort data
            data.sort(function(b: any, a: any) {
                return a.Value - b.Value;
            });

            let total = 0;
            data.forEach(row => {
                total += Number(row.Value);
            })

            // X axis
            const x = d3.scaleBand()
                .range([ 0, width ])
                .domain(data.map((d: any) => d.Country))
                .padding(0.2);
                svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            var formatPercent = d3.format(".0%");

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, 1])
                .range([ height, 0]);
                svg.append("g")
                .call(d3.axisLeft(y).tickFormat(formatPercent)
                );

            // Pareto X axis
            const xAxis = d3.scaleBand()
                .range([ 0, width*1.05])
                .domain(data.map((row, index) => (index+1).toString()))
                .padding(0.58);
                svg.append("g")
                .attr("transform", `translate(0, ${height*100})`)
                .call(d3.axisBottom(xAxis))
                .selectAll("text")

            console.log(data)

            // Bars
            svg.selectAll("mybar")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", (d: any) => x((d.Country || '').toString())!)
                .attr("y", d => y(Number(d.Value)/total))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(Number(d.Value)/total))
                .attr("fill", "#69b3a2")

            const filteredData: any[] = [];

            data.forEach((row, index) => {
                filteredData.push([index+1, Number(row.Value)])
            });

            console.log(filteredData)

            let cumSum: number = 0;
            
            svg.append("path")
                .datum(filteredData)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function(d) { return xAxis(d[0].toString())! })
                    .y(function(d) { cumSum += d[1]; return y(cumSum/total) })
                )

            cumSum = 0;

            svg.selectAll("myCircles")
            .data(filteredData)
            .enter()
            .append("circle")
                .attr("fill", "red")
                .attr("stroke", "none")
                .attr("cx", function(d) { return xAxis(d[0].toString())! })
                .attr("cy", function(d) { cumSum += d[1]; return y(cumSum/total) })
                .attr("r", 1.5)
                .attr("fill", "steelblue")            
                .attr("stroke", "steelblue");

        })
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

export default Pareto;