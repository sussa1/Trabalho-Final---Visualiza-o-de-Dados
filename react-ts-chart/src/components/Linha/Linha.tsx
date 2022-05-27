import React from 'react';
import * as d3 from 'd3';
import './Linha.css'

interface IProps {
    width: number,
    height: number,
    data: any
}

interface IState {

}

class Linha extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    private buildGraph() {

        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 100, bottom: 30, left: 30};
        const width: number = this.props.width - margin.left - margin.right;
        const height: number = this.props.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        //Read the data
        d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv").then( 
            function(data) {

                // List of groups (here I have one group per column)
                const allGroup = Object.keys(data[0]).slice(1)

                var initialData: any = []
                
                data.forEach (line => {
                    initialData.push([Number(line.time), Number(line["valueA"])])
                })

                var hoverData = initialData.slice();

                // Add X axis --> it is a date format
                const x = d3.scaleLinear()
                    .domain([0,10])
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                // Add Y axis
                const y = d3.scaleLinear()
                    .domain([0,20])
                    .range([height, 0]);
                svg.append("g")
                    .call(d3.axisLeft(y));

                // add the options to the button
                d3.select("#selectButton")
                    .selectAll('option')
                    .data(allGroup)
                    .enter()
                    .append('option')
                    .text(function (d) { return d; }) // text showed in the menu
                    .attr("value", function (d) { return d; }) // corresponding value returned by the button

                // A color scale: one color for each group
                const myColor = d3.scaleOrdinal()
                    .domain(allGroup)
                    .range(d3.schemeSet2);

                // Initialize line with group A
                var line = svg
                    .append('g')
                    .append("path")
                    .datum(initialData)
                    .attr("d", d3.line()
                        .x(function(d) { return x(+d[0]); })
                        .y(function(d) { return y(+d[1]); })
                    )
                    .attr("stroke", function(d){ return String(myColor("valueA")) })
                    .style("stroke-width", 4)
                    .style("fill", "none")

                // This allows to find the closest X index of the mouse:
                var bisect = d3.bisector(function(d: any) { return d[0]; }).left;

                // Create the circle that travels along the curve of chart
                var focus = svg
                    .append('g')
                    .append('circle')
                    .style("fill", "black")
                    .attr("stroke", "black")
                    .attr('r', 2)
                    .style("opacity", 0)

                // Create the text that travels along the curve of chart
                var focusText = svg
                    .append('g')
                    .append('text')
                    .style("opacity", 0)
                    .attr("text-anchor", "left")
                    .attr("alignment-baseline", "middle")

                // A function that update the chart
                function update(selectedGroup: any) {
                    // Create new data with the selection?
                    const dataFilter: any = []
                    data.forEach (line => {
                        dataFilter.push([Number(line.time), Number(line[selectedGroup])])
                    })
                    // Give these new data to update line
                    line
                        .datum(dataFilter)
                        .transition()
                        .duration(500)
                        .attr("d", d3.line()
                            .x(function(d) { return x(+d[0]); })
                            .y(function(d) { return y(+d[1]); })
                        )
                        .attr("stroke", function(d){ return String(myColor(selectedGroup)) })

                    hoverData = dataFilter.slice();
                }

                // Create a rect on top of the svg area: this rectangle recovers mouse position
                svg
                    .append('rect')
                    .style("fill", "none")
                    .style("pointer-events", "all")
                    .attr('width', width)
                    .attr('height', height)
                    .on('mouseover', mouseover)
                    .on('mousemove', (e) => {mousemove(d3.pointer(e)) })
                    .on('mouseout', mouseout);


                // What happens when the mouse move -> show the annotations at the right positions.
                function mouseover() {
                    focus.style("opacity", 1)
                    focusText.style("opacity",1)
                }

                function mousemove(e: any) {
                    // recover coordinate we need
                    var x0 = Math.round(x.invert(e[0]));
                    var i = bisect(hoverData, x0, 1);
                    var selectedData = hoverData[i]
                    focus
                        .attr("cx", x(selectedData[0]))
                        .attr("cy", y(selectedData[1]))
                    focusText
                        .html("x:" + selectedData[0] + ",  " + "y:" + selectedData[1])
                        .attr("x", x(selectedData[0])+15)
                        .attr("y", y(selectedData[1]))
                }
                
                function mouseout() {
                    focus.style("opacity", 0)
                    focusText.style("opacity", 0)
                }

                // When the button is changed, run the updateChart function
                d3.select("#selectButton").on("change", function(event,d) {
                    // recover the option that has been chosen
                    const selectedOption = d3.select(this).property("value")
                    // run the updateChart function with this selected option
                    update(selectedOption)
                })

            })
    }

    componentDidMount() {
        // activate   
        this.buildGraph();
    }

    render() {
        return (
            <div>
                <select id="selectButton"></select>
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

export default Linha;