import React from 'react';
import * as d3 from 'd3';
import './AreasEmpilhadas.css';
import Boxplot from '../Boxplot/Boxplot';
import Button from 'react-bootstrap/Button';

interface IProps {
    width: number,
    produtosSelecionados: string[],
    variable: string,
    height: number,
    estado: string,
    id: string,
    pais: boolean
}

interface IState {
    data: any[],
    minYear: number,
    maxYear: number,
    conjuntoProdutos: string[],
    produtosSelecionados: string[],
    variable: string,
    estado: string,
    onChangeVariableSelect: any,
    onChangeProductSelect: any,
    onChangeStateSelect: any,
    boxplotData: any,
    boxplotProduct: any,
    histogramShowing: any,
    rebuild: any
}

class AreasEmpilhadas extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    constructor(props: IProps) {
        super(props);
        this.state = {
            data: [],
            minYear: 0,
            maxYear: 0,
            conjuntoProdutos: [],
            produtosSelecionados: [],
            variable: '',
            estado: '',
            onChangeVariableSelect: null,
            onChangeProductSelect: null,
            onChangeStateSelect: null,
            boxplotData: [],
            boxplotProduct: '',
            histogramShowing: false,
            rebuild: true
        };
        this.buildGraph = this.buildGraph.bind(this);
        this.getYearDomainForBoxplot = this.getYearDomainForBoxplot.bind(this);
        this.closeBoxplot = this.closeBoxplot.bind(this);
    }

    private buildGraph() {
        if (!this.state.rebuild) {
            return;
        }
        d3.select(this.ref)
            .html("");
        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 20 + this.props.width * 0.03, bottom: 30, left: 70 };
        const legendWidth: number = this.props.width * 0.20;
        const width: number = this.props.width - legendWidth - margin.left - margin.right;
        const height: number = this.props.height - margin.top - margin.bottom;
        let getYear = (x: any) => {
            let inicial = margin.left;
            let tamanhoPorAno = width / (this.state.maxYear - this.state.minYear);
            let dif = x - inicial;
            return Math.round(this.state.minYear + dif / tamanhoPorAno);
        }

        let getXOfYear = (year: any) => {
            let tamanhoPorAno = width / (this.state.maxYear - this.state.minYear);
            return tamanhoPorAno * (year - this.state.minYear);
        }

        // append the svg object to the body of the page
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const x = d3.scaleLinear()
            .domain([this.state.minYear, this.state.maxYear])
            .range([0, width]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`);

        const y = d3.scaleLinear()
            .domain([0, 0])
            .range([height, 0]);
        const yAxis = svg.append("g")
            .attr("transform", "translate(0, 0)");

        let mouseover = (d: any, i: any) => {
            let product = i.key;
            let graphDiv = d.toElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            let currentYear = getYear(d.x - graphDiv.getBoundingClientRect().x);
            let index = this.state.data.find((d: any) => d.year === currentYear && d.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "") === product);
            let value = index[this.state.variable];

            let x = getXOfYear(currentYear);

            d3.select('.hover-line' + this.props.id)
                .style("opacity", 1)
                .style("z-index", 1000000000)
                .attr("x1", x)
                .attr("x2", x);

            d3.select(".tooltip-area-empilhada-container")
                .style("opacity", 1)
                .style("z-index", 1000);

            d3.select(".tooltip-area-empilhada-container")
                .style("transform", "scale(1,1)");
            d3.select(".tooltip-area-empilhada")
                .html("Produto: " + product + "<br>Ano: " + currentYear + "<br>Valor: " + value);

            // reduce opacity of all groups
            d3.selectAll(".myArea" + this.props.id).style("opacity", .1)
            // expect the one that is hovered
            d3.select("." + i.key.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') + this.props.id).style("opacity", 1)
        };

        let mousemove = (d: any, i: any) => {
            let product = i.key;
            let graphDiv = d.toElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            let currentYear = getYear(d.x - graphDiv.getBoundingClientRect().x);
            let index = this.state.data.find((d: any) => d.year === currentYear && d.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "") === product);
            let value = index[this.state.variable];

            let x = getXOfYear(currentYear);

            d3.select('.hover-line' + this.props.id)
                .style("opacity", 1)
                .style("z-index", 100000)
                .attr("x1", x)
                .attr("x2", x);

            d3.select(".tooltip-area-empilhada-container")
                .style("-webkit-transition-property", "none")
                .style("-moz-transition-property", "none")
                .style("-o-transition-property", "none")
                .style("transition-property", "none")
                .style("left", (d.pageX + 20) + "px")
                .style("top", (d.pageY - 80) + "px");
            d3.select(".tooltip-area-empilhada")
                .html("Produto: " + product + "<br>Ano: " + currentYear + "<br>Valor: " + value);
        };

        let mouseleave = (d: any) => {
            d3.select('.hover-line' + this.props.id)
                .style("opacity", 0);

            d3.selectAll(".myArea" + this.props.id).style("opacity", 1);
            d3.selectAll(".tooltip-area-empilhada-container")
                .style("opacity", 0)
                .style("z-index", -1000)
                .style("transform", "scale(0.1,0.1)")
                .style("transition", "all .2s ease-in-out");
            d3.selectAll(".myRectangle" + this.props.id)
                .style("opacity", 1)
        };

        let mouseclick = (d: any, i: any) => {
            mouseleave(d);
            let product = i.key;
            let apiUrl = 'http://localhost:5000/cities/' + this.state.variable + "?state=" + this.state.estado + "&product=" + product;
            if (this.props.pais) {
                apiUrl = 'http://localhost:5000/states/' + this.state.variable + "?product=" + product;
            }
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({ boxplotData: data, boxplotProduct: product });
                });
        }

        // What to do when one group is hovered
        var highlight = (d: any) => {
            // reduce opacity of all groups
            d3.selectAll(".myArea" + this.props.id).style("opacity", .1)
            // expect the one that is hovered
            d3.select("." + d.target.__data__.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') + this.props.id).style("opacity", 1)
        }

        // And when it is not hovered anymore
        var noHighlight = (d: any) => {
            d3.selectAll(".myArea" + this.props.id).style("opacity", 1)
        }

        d3.selectAll('.legends' + this.props.id)
            .html("");

        const legend = d3.selectAll('.legends' + this.props.id)
            .attr("width", legendWidth)
            .append("g");

        svg.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height)
            .attr("class", "hover-line" + this.props.id)
            .style("stroke-width", 1)
            .style("stroke", "black")
            .style("fill", "none")
            .style("opacity", 0);

        const getDataForUpdateAreas = () => {
            if (this.state.variable && this.state.produtosSelecionados && this.state.produtosSelecionados.length && (this.state.estado || this.props.pais)) {
                let apiUrl = 'http://localhost:5000/state/' + this.state.variable + "?state=" + this.state.estado;
                if (this.props.pais) {
                    apiUrl = 'http://localhost:5000/' + this.state.variable;
                }
                fetch(apiUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        let minYear = Infinity;
                        let maxYear = 0;
                        let conjuntoProdutos = new Set<string>();
                        data.forEach((d: any) => {
                            if (d.year > maxYear) {
                                maxYear = d.year;
                            }
                            if (d.year < minYear) {
                                minYear = d.year;
                            }
                            if (d.product !== "Total") {
                                let nomeCertoProduto = d.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "");
                                conjuntoProdutos.add(nomeCertoProduto);
                            }
                        });
                        this.setState({ minYear: minYear, maxYear: maxYear, conjuntoProdutos: Array.from(conjuntoProdutos).sort(), produtosSelecionados: Array.from(conjuntoProdutos).sort(), data: data }, () => updateAreas());
                    });
            }
        };

        const updateAreas = () => {
            let somaAno: any = {};
            let conjSelecionados = new Set(this.state.produtosSelecionados);
            this.state.data.forEach(d => {
                if (conjSelecionados.has(d.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", ""))) {
                    if (d.year in somaAno) {
                        somaAno[d.year] += d[this.state.variable];
                    } else {
                        somaAno[d.year] = d[this.state.variable];
                    }
                }
            });
            let maiorTotal = 0;
            for (let v of Object.entries(somaAno)) {
                if (v[1] as number > maiorTotal) {
                    maiorTotal = v[1] as number;
                }
            }

            // List of groups = header of the csv files
            const keys: any = Array.from(this.state.produtosSelecionados);
            // Add X axis
            x.domain([this.state.minYear, this.state.maxYear]);

            xAxis.transition().duration(500).call(d3.axisBottom(x).ticks(this.props.width / 50).tickFormat(d3.format("d")) as any)
            // Add Y axis
            y.domain([0, maiorTotal]);
            yAxis.transition().duration(500).call(d3.axisLeft(y));

            // color palette
            const color = (c: string) => d3.interpolateViridis(keys.indexOf(c) / keys.length);
            let vals: { [key: string]: number; }[] = [];
            let dadosOrganizados: any = []
            for (let i = this.state.minYear; i <= this.state.maxYear; i++) {
                dadosOrganizados.push({});
                for (let produto of this.state.produtosSelecionados) {
                    dadosOrganizados[i - this.state.minYear][produto] = 0;
                }
            }
            this.state.data.forEach(d => {
                let productName = d.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "");
                dadosOrganizados[d.year - this.state.minYear][productName] = d[this.state.variable];
            });
            for (let i = 0; i <= this.state.maxYear - this.state.minYear; i++) {
                let obj = dadosOrganizados[i];
                obj['year'] = i + this.state.minYear;
                vals.push(obj);
            }

            //stack the data?
            const stackedData = d3.stack()
                .keys(keys)
                (vals);

            let areas = svg.selectAll(".myArea" + this.props.id)
                .data(stackedData, (d: any) => d.key);
            areas.exit().remove();
            areas.enter()//this is the enter selection
                .append('path')
                .style("fill", function (d) { return String(color(d.key)) })
                .attr("class", (d: any) => { return "myArea" + this.props.id + " " + d.key.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') + this.props.id })
                .attr("d", d3.area<{ [key: string]: any; }>()
                    .x(function (d, i) { return x(d.data.year); })
                    .y0(function (d) { return y(d[0]); })
                    .y1(function (d) { return y(d[1]); })
                )
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .on("click", mouseclick)
                .merge(areas as any)//and from now on, both the enter and the update selections
                .transition()
                .duration(1000)
                .attr("d", d3.area<{ [key: string]: any; }>()
                    .x(function (d, i) { return x(d.data.year); })
                    .y0(function (d) { return y(d[0]); })
                    .y1(function (d) { return y(d[1]); })
                )
                .attr("class", (d: any) => { return "myArea" + this.props.id + " " + d.key.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') + this.props.id })
                .style("fill", function (d) { return String(color(d.key)) });

            // Add one dot in the legend for each name.
            var size = legendWidth * 0.09;
            d3.selectAll('.legends' + this.props.id)
                .attr("height", 5 + (this.state.produtosSelecionados.length) * (size + 5));

            let legendRects = legend.selectAll(".myRectLegend" + this.props.id)
                .data(keys, (d: any) => d);
            let legendTexts = legend.selectAll(".myTextLegend" + this.props.id)
                .data(keys, (d: any) => d);

            legendRects
                .enter()
                .append("rect")
                .attr("x", 5)
                .attr("y", function (d, i) { return 5 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", function (d: any) { return String(color(d)) })
                .attr("class", (d: any) => { return "myRectLegend" + this.props.id; })
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)
                .merge(legendRects as any)
                .transition()
                .duration(500)
                .attr("x", 5)
                .attr("y", function (d, i) { return 5 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("class", (d: any) => { return "myRectLegend" + this.props.id; })
                .attr("width", size)
                .attr("height", size)
                .style("fill", function (d: any) { return String(color(d)) });

            // Add one dot in the legend for each name.
            legendTexts
                .enter()
                .append("text")
                .attr("x", size + 10)
                .attr("y", function (d, i) { return 5 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("class", (d: any) => { return "myTextLegend" + this.props.id; })
                .style("fill", function (d: any) { return String(color(d)) })
                .text((d: any) => d)
                .attr("text-anchor", "left")
                .style("font-size", legendWidth * 0.09)
                .style("alignment-baseline", "middle")
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)
                .merge(legendTexts as any)
                .transition()
                .duration(500)
                .attr("x", size + 10)
                .attr("y", function (d, i) { return 5 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("class", (d: any) => { return "myTextLegend" + this.props.id; })
                .style("fill", function (d: any) { return String(color(d)) })
                .style("font-size", legendWidth * 0.09)
                .text((d: any) => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle");

            legendRects.exit().remove();

            legendTexts.exit().remove();
        };

        if (this.state.variable && this.state.produtosSelecionados && this.state.produtosSelecionados.length && (this.state.estado || this.props.pais)) {
            getDataForUpdateAreas();
        }
        this.setState({
            onChangeVariableSelect: (v: any) => {
                if (!v) {
                    this.setState({ variable: 'value' }, () => getDataForUpdateAreas());
                } else {
                    this.setState({ variable: v }, () => getDataForUpdateAreas());
                }
            },
            onChangeProductSelect: (v: any) => {
                if (!v || v.length === 0) {
                    this.setState({ produtosSelecionados: this.state.conjuntoProdutos }, () => updateAreas());
                } else {
                    this.setState({ produtosSelecionados: v }, () => updateAreas());
                }
            },
            onChangeStateSelect: (state: any) => {
                if (!state) {
                    this.setState({ estado: '' }, () => getDataForUpdateAreas());
                } else {
                    this.setState({ estado: state }, () => getDataForUpdateAreas());
                }
            },
            rebuild: false
        });
    }

    componentDidMount() {
        this.buildGraph();
    }

    componentDidUpdate() {
        this.buildGraph();
        if (this.props.produtosSelecionados !== this.state.produtosSelecionados) {
            if (this.state.boxplotProduct && this.state.boxplotData) {
                this.closeBoxplot();
            }
            this.state.onChangeProductSelect(this.props.produtosSelecionados)
        }
        if (this.props.variable !== this.state.variable) {
            if (this.state.boxplotProduct && this.state.boxplotData) {
                this.closeBoxplot();
            }
            this.state.onChangeVariableSelect(this.props.variable)
        }
        if (this.props.estado !== this.state.estado) {
            if (this.state.boxplotProduct && this.state.boxplotData) {
                this.closeBoxplot();
            }
            this.state.onChangeStateSelect(this.props.estado)
        }
    }

    getYearDomainForBoxplot() {
        let maxYear = 0;
        let minYear = Infinity;
        this.state.boxplotData.forEach((d: any) => {
            if (d.year > maxYear) {
                maxYear = d.year;
            }
            if (d.year < minYear) {
                minYear = d.year;
            }
        });
        let domain = []
        for (let i = minYear; i <= maxYear; i++) {
            domain.push(i.toString());
        }
        return domain;
    }

    closeBoxplot() {
        this.setState({ boxplotProduct: '', boxplotData: [], rebuild: true })
    }

    render() {
        if (this.state.boxplotProduct && this.state.boxplotData) {
            return (
                <div>
                    {!this.state.histogramShowing &&
                        <div className="buttonDiv">
                            <Button onClick={this.closeBoxplot} variant="secondary">Voltar</Button>
                        </div>}
                    <Boxplot width={this.props.width * 0.98} height={this.props.height - 48} onChangeHistogram={(v: any) => this.setState({ histogramShowing: v })} data={this.state.boxplotData} domain={this.getYearDomainForBoxplot()} id={this.props.id} variable={this.props.variable} grouperKey="year"></Boxplot>
                </div>
            );
        } else {
            return (
                <div className="root">
                    <div className="graph" style={{ height: this.props.height, width: this.props.width }}>
                        <div className="svg" >
                            <svg className="container" ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
                        </div>
                        <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                            <svg className={"legends" + this.props.id} style={{ overflowY: 'auto', overflowX: 'hidden' }}></svg>
                        </div>
                    </div>
                    <div className={"tooltip-area-empilhada-container"}>
                        <div className="tooltip-area-empilhada"></div>
                    </div>
                </div >
            );
        }
    }
}

export default AreasEmpilhadas;