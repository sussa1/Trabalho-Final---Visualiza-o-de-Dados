import React from 'react';
import * as d3 from 'd3';
import './Boxplot.css'

interface IProps {
    width: number,
    height: number,
    year: any
}

interface IState {
    data: any
}

class Boxplot extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    mapaCodigoEstado: any = {
        '12': 'Acre',
        '27': 'Alagoas',
        '16': 'Amapá',
        '13': 'Amazonas',
        '29': 'Bahia',
        '23': 'Ceará',
        '53': 'Distrito Federal',
        '32': 'Espírito Santo',
        '52': 'Goiás',
        '21': 'Maranhão',
        '51': 'Mato Grosso',
        '50': 'Mato Grosso do Sul',
        '31': 'Minas Gerais',
        '15': 'Pará',
        '25': 'Paraíba',
        '41': 'Paraná',
        '26': 'Pernambuco',
        '22': 'Piauí',
        '24': 'Rio Grande do Norte',
        '43': 'Rio Grande do Sul',
        '33': 'Rio de Janeiro',
        '11': 'Rondônia',
        '14': 'Roraima',
        '42': 'Santa Catarina',
        '35': 'São Paulo',
        '28': 'Sergipe',
        '17': 'Tocantins'
    };

    constructor(props: IProps) {
        super(props);
        this.buildGraph = this.buildGraph.bind(this);
    }

    private buildGraph() {
        if (!this.state.data) {
            return;
        }

        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 30, bottom: 100, left: 55 };
        const width: number = this.props.width - margin.left - margin.right;
        const height: number = this.props.height - margin.top - margin.bottom;
        // append the svg object to the body of the page
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        let groupRes = d3.group(this.state.data, (d: any) => this.mapaCodigoEstado[d.cityId.toString().substring(0, 2)]);
        let sumstat = new Map<string, object>();
        let menorMin = Infinity;
        let maiorMax = 0;
        let conjEstados = new Set<String>();
        groupRes.forEach((v, k) => {
            conjEstados.add(k);
            let q1 = d3.quantile(v.map(function (g: any) { return g.lostArea; }).sort(d3.ascending), .25);
            let median = d3.quantile(v.map(function (g: any) { return g.lostArea; }).sort(d3.ascending), .5);
            let q3 = d3.quantile(v.map(function (g: any) { return g.lostArea; }).sort(d3.ascending), .75);
            if (q3 === undefined || q1 === undefined || k === undefined) {
                return NaN;
            }
            let min = Infinity;
            let max = 0;
            for (let val of v) {
                if (val.lostArea < min) {
                    min = val.lostArea;
                }
                if (val.lostArea > max) {
                    max = val.lostArea;
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
        let xDomain = [];
        for (let k of Object.keys(this.mapaCodigoEstado)) {
            xDomain.push(this.mapaCodigoEstado[k]);
        }
        // Show the X scale
        var x = d3.scaleBand()
            .range([0, width])
            .domain(xDomain.sort())
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
            d3.selectAll("." + d.target.__data__[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, ''))
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
            .attr("class", function (d) { return "myRectangle " + d[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .attr("stroke", "black")
            .style("width", 20)
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
            .attr("class", function (d) { return "myRectangle " + d[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .attr("stroke", "black")
            .style("width", 20)
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
            .attr("x1", function (d: any) { return (Number(x(d[0])) - 10) })
            .attr("x2", function (d: any) { return (Number(x(d[0])) + 10) })
            .attr("class", function (d) { return "myRectangle " + d[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .attr("stroke", "black")
            .style("width", 20)
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
            .attr("x1", function (d: any) { return (Number(x(d[0])) - 10) })
            .attr("x2", function (d: any) { return (Number(x(d[0])) + 10) })
            .attr("stroke", "black")
            .attr("class", function (d) { return "myRectangle " + d[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .style("width", 20)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        // rectangle for the main box
        var boxWidth = 20;
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
            .attr("class", function (d) { return "myRectangle " + d[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
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
            .attr("class", function (d) { return "myRectangle " + d[0].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
            .attr("stroke", "black")
            .style("width", 20)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    }

    componentDidMount() {
        if (!this.state || !this.state.data) {
            const apiUrl = 'http://localhost:3000/lostArea/year?year=' + this.props.year;
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({ data: data })
                });
        }

    }

    componentDidUpdate() {
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