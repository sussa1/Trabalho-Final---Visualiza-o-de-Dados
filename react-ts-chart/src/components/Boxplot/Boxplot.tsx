import React from 'react';
import * as d3 from 'd3';
import './Boxplot.css'
import Histograma from '../Histograma/Histograma';
import Button from 'react-bootstrap/Button';

interface IProps {
    width: number,
    height: number,
    data: any,
    grouperKey: any,
    domain: any,
    variable: any,
    id: any,
    onChangeHistogram: any
}

interface IState {
    valoresHistograma: any
}

class Boxplot extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    constructor(props: IProps) {
        super(props);
        this.state = {
            valoresHistograma: []
        }
        this.buildGraph = this.buildGraph.bind(this);
        this.closeHistograma = this.closeHistograma.bind(this);
    }

    private buildGraph() {
        if (!this.props.data) {
            return;
        }

        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 30, bottom: 100, left: 75 };
        const width: number = this.props.width - margin.left - margin.right;
        const height: number = this.props.height - margin.top - margin.bottom;
        // append the svg object to the body of the page
        d3.select(this.ref).html("");
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        let tamanhoParte = width / this.props.domain.length;
        let tamanhoElementosBoxplot = tamanhoParte - 5;
        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        let groupRes = d3.group(this.props.data, (d: any) => d[this.props.grouperKey]);
        let sumstat = new Map<string, object>();
        let menorMin = Infinity;
        let maiorMax = 0;
        let conjEstados = new Set<String>();
        groupRes.forEach((v, k) => {
            conjEstados.add(k);
            let q1 = d3.quantile(v.map((g: any) => { return g[this.props.variable]; }).sort(d3.ascending), .25);
            let median = d3.quantile(v.map((g: any) => { return g[this.props.variable]; }).sort(d3.ascending), .5);
            let q3 = d3.quantile(v.map((g: any) => { return g[this.props.variable]; }).sort(d3.ascending), .75);
            if (q3 === undefined || q1 === undefined || k === undefined) {
                return NaN;
            }
            let min = Infinity;
            let max = 0;
            for (let val of v) {
                if (val[this.props.variable] < min) {
                    min = val[this.props.variable];
                }
                if (val[this.props.variable] > max) {
                    max = val[this.props.variable];
                }
            }
            let interQuantileRange = q3 - q1;
            if (min < menorMin) {
                menorMin = min;
            }
            if (max > maiorMax) {
                maiorMax = max;
            }
            sumstat.set(k, {
                q1: q1,
                median: median,
                q3: q3,
                interQuantileRange: interQuantileRange,
                min: min,
                max: max
            });
        });
        // Show the X scale
        var x = d3.scaleBand()
            .range([0, width])
            .domain(this.props.domain.sort())
            .paddingInner(1)
            .paddingOuter(.5);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // Show the Y scale
        var y = d3.scaleLinear()
            .domain([menorMin, maiorMax])
            .range([height, 0])
        svg.append("g").call(d3.axisLeft(y))

        let mouseover = (d: any) => {
            let max = d.target.__data__[1].max.toPrecision(3);
            let q3 = d.target.__data__[1].q3.toPrecision(3);
            let median = d.target.__data__[1].median.toPrecision(3);
            let q1 = d.target.__data__[1].q1.toPrecision(3);
            let min = d.target.__data__[1].min.toPrecision(3);
            d3.select(".tooltip-boxplot-container")
                .style("opacity", 1)
                .style("z-index", 1000);

            d3.select(".tooltip-boxplot-container")
                .style("transform", "scale(1,1)");
            d3.select(".tooltip-boxplot")
                .html("Máximo: " + max + "<br>3º Quartil: " + q3 + "<br>Mediana: " + median + "<br>1º Quartil: " + q1 + "<br>Mínimo: " + min);

            d3.selectAll(".myRectangle" + this.props.id)
                .style("opacity", 0.1)
            d3.selectAll(".ano" + d.target.__data__[0].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, ''))
                .style("opacity", 1)
        };

        let mousemove = function (d: any) {
            d3.select(".tooltip-boxplot-container")
                .style("-webkit-transition-property", "none")
                .style("-moz-transition-property", "none")
                .style("-o-transition-property", "none")
                .style("transition-property", "none")
                .style("left", (d.pageX + 20) + "px")
                .style("top", (d.pageY + 10) + "px");
        };

        let mouseleave = (d: any) => {
            d3.selectAll(".tooltip-boxplot-container")
                .style("opacity", 0)
                .style("z-index", -1000)
                .style("transform", "scale(0.1,0.1)")
                .style("transition", "all .2s ease-in-out");
            d3.selectAll(".myRectangle" + this.props.id)
                .style("opacity", 1)
        };

        let mouseclick = (d: any) => {
            let values = groupRes.get(d.target.__data__[0])?.map(v => v[this.props.variable]);
            this.props.onChangeHistogram(true);
            mouseleave(d);
            this.setState({ valoresHistograma: values });
        };

        // Show the top vertical line
        svg
            .selectAll("topVertLine")
            .data(sumstat)
            .enter()
            .append("line")
            .attr("x1", function (d: any) { return (Number(x(d[0].toString()))) })
            .attr("x2", function (d: any) { return (Number(x(d[0].toString()))) })
            .attr("y1", function (d: any) { return (y(d[1].max)) })
            .attr("y2", function (d: any) { return (y(d[1].q3)) })
            .attr("class", (d: any) => { return "myRectangle" + this.props.id + " ano" + d[0].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .attr("stroke", "black")
            .style("width", tamanhoElementosBoxplot)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", mouseclick);

        // Show the bottom vertical line
        svg
            .selectAll("bottomVertLine")
            .data(sumstat)
            .enter()
            .append("line")
            .attr("x1", function (d: any) { return (Number(x(d[0].toString()))) })
            .attr("x2", function (d: any) { return (Number(x(d[0].toString()))) })
            .attr("y1", function (d: any) { return (y(d[1].min)) })
            .attr("y2", function (d: any) { return (y(d[1].q1)) })
            .attr("class", (d: any) => { return "myRectangle" + this.props.id + " ano" + d[0].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .attr("stroke", "black")
            .style("width", tamanhoElementosBoxplot)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", mouseclick);

        // Show the top horizontal line
        svg
            .selectAll("topHorizLine")
            .data(sumstat)
            .enter()
            .append("line")
            .attr("y1", function (d: any) { return (y(d[1].max)) })
            .attr("y2", function (d: any) { return (y(d[1].max)) })
            .attr("x1", function (d: any) { return (Number(x(d[0].toString())) - tamanhoElementosBoxplot / 2) })
            .attr("x2", function (d: any) { return (Number(x(d[0].toString())) + tamanhoElementosBoxplot / 2) })
            .attr("class", (d: any) => { return "myRectangle" + this.props.id + " ano" + d[0].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .attr("stroke", "black")
            .style("width", tamanhoElementosBoxplot)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", mouseclick);

        // Show the bottom horizontal line
        svg
            .selectAll("topHorizLine")
            .data(sumstat)
            .enter()
            .append("line")
            .attr("y1", function (d: any) { return (y(d[1].min)) })
            .attr("y2", function (d: any) { return (y(d[1].min)) })
            .attr("x1", function (d: any) { return (Number(x(d[0].toString())) - tamanhoElementosBoxplot / 2) })
            .attr("x2", function (d: any) { return (Number(x(d[0].toString())) + tamanhoElementosBoxplot / 2) })
            .attr("stroke", "black")
            .attr("class", (d: any) => { return "myRectangle" + this.props.id + " ano" + d[0].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .style("width", tamanhoElementosBoxplot)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", mouseclick);

        // rectangle for the main box
        var boxWidth = tamanhoElementosBoxplot;
        svg
            .selectAll("boxes")
            .data(sumstat)
            .enter()
            .append("rect")
            .attr("x", function (d: any) { return ((x(d[0].toString()) || 0) - boxWidth / 2) })
            .attr("y", function (d: any) { return (y(d[1].q3)) })
            .attr("height", function (d: any) { return (y(d[1].q1) - y(d[1].q3)) })
            .attr("width", boxWidth)
            .attr("stroke", "black")
            .attr("class", (d: any) => { return "myRectangle" + this.props.id + " ano" + d[0].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .style("fill", "#69b3a2")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", mouseclick);

        svg
            .selectAll("medianLines")
            .data(sumstat)
            .enter()
            .append("line")
            .attr("x1", function (d: any) { return ((x(d[0].toString()) || 0) - boxWidth / 2) })
            .attr("x2", function (d: any) { return ((x(d[0].toString()) || 0) + boxWidth / 2) })
            .attr("y1", function (d: any) { return (y(d[1].median)) })
            .attr("y2", function (d: any) { return (y(d[1].median)) })
            .attr("class", (d: any) => { return "myRectangle" + this.props.id + " ano" + d[0].toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .attr("stroke", "black")
            .style("width", tamanhoElementosBoxplot)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", mouseclick);
    }

    componentDidMount() {
        this.buildGraph();
    }

    componentDidUpdate() {
        this.buildGraph();
    }

    closeHistograma() {
        this.props.onChangeHistogram(false);
        this.setState({ valoresHistograma: [] })
    }

    render() {
        if (this.state.valoresHistograma.length) {
            return (
                <div>
                    <div className="buttonDiv">
                        <Button onClick={this.closeHistograma} variant="secondary">Voltar</Button>
                    </div>
                    <Histograma id={this.props.id} width={this.props.width} height={this.props.height - 50} values={this.state.valoresHistograma}></Histograma>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="svg" >
                        <svg className="boxplot-container" ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
                    </div>
                    <div className="tooltip-boxplot-container">
                        <div className="tooltip-boxplot"></div>
                    </div>
                </div>
            );
        }
    }
}

export default Boxplot;