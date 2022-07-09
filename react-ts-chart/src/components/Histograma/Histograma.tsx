import React from 'react';
import * as d3 from 'd3';
import './Histograma.css';

interface IProps {
    width: number,
    height: number,
    values: number[],
    id: any
}

interface IState {
}

class Histograma extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    constructor(props: IProps) {
        super(props);
        this.buildGraph = this.buildGraph.bind(this);
    }

    private buildGraph() {
        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 80, bottom: 30, left: 60 };
        const width: number = this.props.width - margin.left - margin.right;
        const height: number = this.props.height - margin.top - margin.bottom;

        d3.select(this.ref)
            .html("");
        // append the svg object to the body of the page
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        // Processa dos dados
        // X axis: scale and draw:
        var x = d3.scaleLinear()
            .domain([0, 1.01 * d3.max(this.props.values, d => d as any) as any])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(this.props.width / 100));

        // set the parameters for the histogram
        const histogram = d3
            .bin()
            .value((d) => d)
            .domain(x.domain() as any)
            .thresholds(x.ticks(40));

        // And apply this function to data to get the bins
        var bins = histogram(this.props.values as any);

        // Y axis: scale and draw:
        var y = d3.scaleLinear()
            .range([height, 0]);
        y.domain([0, d3.max(bins, function (d) { return d.length; }) as Number]);   // d3.hist has to be called before the Y axis obviously
        svg.append("g")
            .call(d3.axisLeft(y));

        let mouseover = (d: any) => {
            d3.select(".tooltip-histograma-container")
                .style("opacity", 1)
                .style("z-index", 1000);

            const sorted_data = d.target.__data__.map((d: any) => d as Number).sort((a: any, b: any) => a - b);
            d3.select(".tooltip-histograma-container")
                .style("transform", "scale(1,1)");
            d3.select(".tooltip-histograma")
                .html("Intervalo: " + Math.round(sorted_data[0] * 10000) / 10000 + " a " + Math.round(sorted_data[sorted_data.length - 1] * 10000) / 10000 + "<br>Tamanho do Bin: " + d.target.__data__.length);

            d3.selectAll(".myRectangle" + this.props.id)
                .style("opacity", 0.1)

            d3.selectAll(".x0_" + d.target.__data__.x0 + "_x1_" + d.target.__data__.x1)
                .style("opacity", 1)
        };

        let mousemove = function (d: any) {
            d3.select(".tooltip-histograma-container")
                .style("-webkit-transition-property", "none")
                .style("-moz-transition-property", "none")
                .style("-o-transition-property", "none")
                .style("transition-property", "none")
                .style("left", (d.pageX + 15) + "px")
                .style("top", (d.pageY - 50) + "px");
        };

        let mouseleave = (d: any) => {
            d3.selectAll(".tooltip-histograma-container")
                .style("opacity", 0)
                .style("z-index", -1000)
                .style("transform", "scale(0.1,0.1)")
                .style("transition", "all .2s ease-in-out");
            d3.selectAll(".myRectangle" + this.props.id)
                .style("opacity", 1)
        };

        // append the bar rectangles to the svg element
        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function (d) { return "translate(" + x(d.x0 as any) + "," + y(d.length) + ")"; })
            .attr("width", function (d) { return x(d.x1 as any) - x(d.x0 as any) - 1; })
            .attr("height", function (d) { return height - y(d.length); })
            .attr("class", (d: any) => { return "myRectangle" + this.props.id + " x0_" + d.x0 + "_x1_" + d.x1 })
            .style("fill", "#69b3a2")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    }

    componentDidMount() {
        this.buildGraph();
    }

    componentDidUpdate() {
        this.buildGraph();
    }

    render() {
        return (
            <div className="root">
                <div className="graph" style={{ height: this.props.height, width: this.props.width }}>
                    <div className="svg" >
                        <svg className="container-hist" ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
                    </div>
                </div>
                <div className="tooltip-histograma-container">
                    <div className="tooltip-histograma"></div>
                </div>
            </div >
        );
    }
}

export default Histograma;