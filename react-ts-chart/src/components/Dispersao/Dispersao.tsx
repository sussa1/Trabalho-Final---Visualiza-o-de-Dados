// @ts-ignore: Object is possibly 'undefined'.

import React from 'react';
import * as d3 from 'd3';
import './Dispersao.css'
import Select from 'react-select';

interface IProps {
    width: number,
    height: number,
    id: string,
    data: any, // x, y
    flag: boolean,
    ylabel: string,
    xlabel: string,
    minYear: number,
    maxYear: number
}

interface IState {
    onChangeProps: any,
    flag: boolean,
    year: string
}

class Dispersao extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    constructor(props: IProps) {
        super(props);
        this.state = {
            onChangeProps: null,
            flag: false,
            year: 'total'
        };
        this.getSelectElements = this.getSelectElements.bind(this);
        this.onChangeSelectElement = this.onChangeSelectElement.bind(this);
    }

    correlationCoefficient(X: any[], Y: any[]) {
        let n = X.length;
        let sum_X = 0, sum_Y = 0, sum_XY = 0;
        let squareSum_X = 0, squareSum_Y = 0;

        for (let i = 0; i < n; i++) {
            sum_X = sum_X + X[i];
            sum_Y = sum_Y + Y[i];
            sum_XY = sum_XY + X[i] * Y[i];
            squareSum_X = squareSum_X + X[i] * X[i];
            squareSum_Y = squareSum_Y + Y[i] * Y[i];
        }

        let corr = (n * sum_XY - sum_X * sum_Y) /
            (Math.sqrt((n * squareSum_X -
                sum_X * sum_X) *
                (n * squareSum_Y -
                    sum_Y * sum_Y)));

        return corr;
    }

    private buildGraph() {
        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 20, bottom: 120, left: 120 };
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

        // Add X axis
        let x = d3.scaleLinear()
            .range([0, width]);

        let xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")");

        // Add Y axis
        let y = d3.scaleLinear()
            .range([height, 0]);

        let yAxis = svg.append("g");

        svg.append('g')
            .attr('transform', 'translate(' + -80 + ', ' + height / 2 + ')')
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text(this.props.ylabel);

        svg.append("text")
            .attr("text-anchor", "center")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .text(this.props.xlabel);

        svg.append("text")
            .attr("class", "correlation-text")
            .attr("text-anchor", "center")
            .attr("x", width / 2)
            .attr("y", 20);

        let mouseover = (d: any) => {
            d3.select(".tooltip-dispersao-container")
                .style("opacity", 1)
                .style("z-index", 1000000);

            d3.select(".tooltip-dispersao-container")
                .style("transform", "scale(1,1)");

            d3.select(".tooltip-dispersao")
                .html(d.target.__data__.label);

            d3.selectAll(".dot" + this.props.id)
                .style("opacity", 0.1);

            d3.selectAll("." + d.target.__data__.id)
                .style("opacity", 1);
        };

        let mousemove = (d: any) => {
            d3.select(".tooltip-dispersao-container")
                .style("-webkit-transition-property", "none")
                .style("-moz-transition-property", "none")
                .style("-o-transition-property", "none")
                .style("transition-property", "none")
                .style("left", (d.pageX + 15) + "px")
                .style("top", (d.pageY - 80) + "px");
        };

        let mouseleave = (d: any) => {
            d3.selectAll(".tooltip-dispersao-container")
                .style("opacity", 0)
                .style("z-index", -1000000)
                .style("transform", "scale(0.1,0.1)")
                .style("transition", "all .2s ease-in-out");
            d3.selectAll(".dot" + this.props.id)
                .style("opacity", 1)
        };

        const updateAreas = () => {
            if (!this.props.data || !this.props.data.length) {
                return;
            }

            let actualData: any = []

            this.props.data.forEach((d: any) => {
                if (this.state.year === 'total') {
                    actualData.push(d);
                } else {
                    if (d.ano.toString() === this.state.year) {
                        actualData.push(d);
                    }
                }
            });

            let xData: any = [];
            let yData: any = [];

            let minX = Infinity;
            let maxX = -1;
            let minY = Infinity;
            let maxY = -1;
            actualData.forEach((d: any) => {
                if (d.x < minX) {
                    minX = d.x;
                }
                if (d.x > maxX) {
                    maxX = d.x;
                }
                if (d.y < minY) {
                    minY = d.y;
                }
                if (d.y > maxY) {
                    maxY = d.y;
                }
                xData.push(d.x);
                yData.push(d.y);
            });

            x.domain([minX - minX, maxX + minX]);

            xAxis.transition().duration(500).call(d3.axisBottom(x).ticks(this.props.width / 80).tickFormat(d3.format("d")) as any)
            // Add Y axis
            y.domain([minY - minY, maxY + minY]);
            yAxis.transition().duration(500).call(d3.axisLeft(y).ticks(this.props.height / 50).tickFormat(d3.format("d")) as any);

            svg.selectAll(".correlation-text")
                .text("Correlação: " + Math.round(this.correlationCoefficient(xData, yData) * 10000) / 10000);

            let pontos = svg.selectAll(".dot" + this.props.id)
                .data(actualData);
            pontos.exit()
                .transition()
                .duration(200)
                .attr("width", 0)
                .remove();
            pontos.enter()
                .append('circle')
                .attr("cx", function (d: any) { return x(Number(d.x)); })
                .attr("cy", function (d: any) { return y(Number(d.y)); })
                .attr("r", 0.002 * this.props.height)
                .style("fill", "#69b3a2")
                .attr("class", (d: any) => "dot" + this.props.id + " " + d.id)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .merge(pontos as any)
                .transition()
                .duration(1000)
                .attr("cx", function (d: any) { return x(Number(d.x)); })
                .attr("cy", function (d: any) { return y(Number(d.y)); })
                .attr("r", 0.002 * this.props.height)
                .style("fill", "#69b3a2");
        };

        updateAreas();

        this.setState({
            onChangeProps: () => {
                updateAreas();
            }
        });
    }

    componentDidMount() {
        this.buildGraph();
    }

    componentDidUpdate() {
        if (this.props.flag !== this.state.flag) {
            this.setState({ flag: this.props.flag }, this.state.onChangeProps)
        }
    }

    getSelectElements() {
        let elements = []
        elements.push({
            value: 'total',
            label: 'Todos'
        });
        for (let i = this.props.minYear; i <= this.props.maxYear; i++) {
            elements.push({
                value: i.toString(),
                label: i.toString()
            });
        }
        return elements;
    }

    onChangeSelectElement(d: any) {
        let selectedOption = d.value;
        if (!selectedOption) {
            selectedOption = 'total';
        }
        console.log(selectedOption);
        this.setState({ year: selectedOption }, this.state.onChangeProps);
    }

    render() {
        return (
            <div>
                <div style={{ margin: "10px", marginLeft: "20px", display: "flex", flexDirection: "row", width: "90%", alignItems: "center" }}> Ano: <Select
                    name="year"
                    options={this.state == null ? [] : this.getSelectElements()}
                    defaultValue={this.getSelectElements()[0] as any}
                    className="years-dispersao"
                    classNamePrefix="select"
                    placeholder="Escolha o ano"
                    onChange={this.onChangeSelectElement}
                /> </div>
                <div className="svg" >
                    <svg className="container" ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
                </div>
                <div className="tooltip-dispersao-container">
                    <div className="tooltip-dispersao"></div>
                </div>
            </div>
        );
    }
}

export default Dispersao;