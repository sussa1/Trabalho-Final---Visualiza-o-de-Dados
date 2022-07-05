// @ts-ignore: Object is possibly 'undefined'.

import React from 'react';
import * as d3 from 'd3';
import './Dispersao.css'

interface IProps {
    width: number,
    height: number,
    year: number
}

interface IState {

}

class Dispersao extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    private buildGraph() {
        // set the dimensions and margins of the graph
        const margin = {top: 40, right: 20, bottom: 70, left: 50};
        const width: number = this.props.width - margin.left - margin.right;
        const height: number = this.props.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        //Read the data
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv").then( function(data) {

            // Add X axis
            var x = d3.scaleLinear()
            .domain([0, 4000])
            .range([ 0, width ]);
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
            // Add Y axis
            var y = d3.scaleLinear()
            .domain([0, 700000])
            .range([ height, 0]);
            svg.append("g")
            .call(d3.axisLeft(y));
        
            // Add dots
            svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function (d) { return x(Number(d.GrLivArea)); } )
                .attr("cy", function (d) { return y(Number(d.SalePrice)); } )
                .attr("r", 1.5)
                .style("fill", "#69b3a2")
  
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

export default Dispersao;