import React from 'react';
import * as d3 from 'd3';
import './AreasEmpilhadas.css';
import { NumberValue } from 'd3';

interface IProps {
    width: number,
    height: number,
    data: any
}

interface IState {

}

class AreasEmpilhadas extends React.Component<IProps, IState> {
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

        // Parse the Data
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv").then(function (data) {
            let minYear = Infinity;
            let maxYear = 0;
            data.forEach(d => {
                let yearNum = Number(d.year);
                if (yearNum && yearNum > maxYear) {
                    maxYear = yearNum;
                }
                if (yearNum && yearNum < minYear) {
                    minYear = yearNum;
                }
            });
            // List of groups = header of the csv files
            const keys = data.columns.slice(1)
            // Add X axis
            const x = d3.scaleLinear()
                .domain([minYear, maxYear])
                .range([0, width]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(5));

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, 200000])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // color palette
            const color = d3.scaleOrdinal()
                .domain(keys)
                .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'])
            let vals: { [key: string]: number; }[] = [];
            data.forEach(d => {
                let obj: { [key: string]: number } = {
                    "Amanda": Number(d.Amanda),
                    "Ashley": Number(d.Ashley),
                    "Betty": Number(d.Betty),
                    "Deborah": Number(d.Deborah),
                    "Dorothy": Number(d.Dorothy),
                    "Helen": Number(d.Helen),
                    "Linda": Number(d.Linda),
                    "Patricia": Number(d.Patricia),
                    "year": Number(d.year)
                };
                vals.push(obj);
            });

            //stack the data?
            const stackedData = d3.stack()
                .keys(keys)
                (vals)
            //console.log("This is the stack result: ", stackedData)

            // Show the areas
            svg
                .selectAll("mylayers")
                .data(stackedData)
                .join("path")
                .style("fill", function (d) { return String(color(d.key)) })
                .attr("class", function (d) { return "myArea " + d.key })
                .attr("d", d3.area<{ [key: string]: any; }>()
                    .x(function (d, i) { return x(d.data.year); })
                    .y0(function (d) { return y(d[0]); })
                    .y1(function (d) { return y(d[1]); })
                )


            //////////
            // HIGHLIGHT GROUP //
            //////////

            // What to do when one group is hovered
            var highlight = function (d: any) {
                console.log(d)
                // reduce opacity of all groups
                d3.selectAll(".myArea").style("opacity", .1)
                // expect the one that is hovered
                d3.select("." + d.target.__data__).style("opacity", 1)
            }

            // And when it is not hovered anymore
            var noHighlight = function (d: any) {
                d3.selectAll(".myArea").style("opacity", 1)
            }



            //////////
            // LEGEND //
            //////////

            // Add one dot in the legend for each name.
            var size = 20
            svg.selectAll("myrect")
                .data(keys)
                .enter()
                .append("rect")
                .attr("x", width - 100)
                .attr("y", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", function (d) { return String(color(d)) })
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)

            // Add one dot in the legend for each name.
            svg.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", width - 70)
                .attr("y", function (d, i) { return 10 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function (d) { return String(color(d)) })
                .text(function (d) { return d })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)
        });
    }

    componentDidMount() {
        // activate   
        this.buildGraph();
    }

    render() {
        return (
            <div className="svg" >
                <svg className="container" ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
            </div>
        );
    }
}

export default AreasEmpilhadas;