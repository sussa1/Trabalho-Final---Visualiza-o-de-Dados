import React from 'react';
import * as d3 from 'd3';
import './AreasEmpilhadas.css';
import Select from 'react-select';

interface IProps {
    width: number,
    height: number
}

interface IState {
    data: any[],
    minYear: number,
    maxYear: number,
    conjuntoProdutos: string[],
    produtosSelecionados: string[],
}

class AreasEmpilhadas extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    constructor(props: IProps) {
        super(props);
        this.buildGraph = this.buildGraph.bind(this);
        this.getSelectElements = this.getSelectElements.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    private buildGraph() {
        if (!this.state.data) {
            return;
        }
        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 55, bottom: 30, left: 75 };
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

        let maiorTotal = 0;
        this.state.data.forEach(d => {
            if (this.state.produtosSelecionados.includes(d.product) && d.value > maiorTotal) {
                maiorTotal = d.value;
            }
        });

        // List of groups = header of the csv files
        const keys: any = Array.from(this.state.produtosSelecionados);
        // Add X axis
        const x = d3.scaleLinear()
            .domain([this.state.minYear, this.state.maxYear])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(20));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, maiorTotal])
            .range([height, 0]);
        svg.append("g")
            .attr("transform", "translate(40, 0)")
            .call(d3.axisLeft(y));

        // color palette
        const color = (c: string) => d3.interpolateRdYlBu(keys.indexOf(c) / keys.length);
        let vals: { [key: string]: number; }[] = [];
        for (let i = this.state.minYear; i <= this.state.maxYear; i++) {
            let obj: { [key: string]: number } = {
            };
            this.state.data.forEach(d => {
                for (let grupo of keys) {
                    if (d.product === grupo && d.year === i) {
                        obj[grupo] = d.value as number;
                    }
                }

                for (let grupo of keys) {
                    if (!(grupo in obj)) {
                        obj[grupo] = 0;
                    }
                }
            });
            obj['year'] = i;
            vals.push(obj);
        }

        //stack the data?
        const stackedData = d3.stack()
            .keys(keys)
            (vals);

        // Show the areas
        svg
            .selectAll("mylayers")
            .data(stackedData)
            .join("path")
            .style("fill", function (d) { return String(color(d.key)) })
            .attr("class", function (d) { return "myArea " + d.key.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') })
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
            // reduce opacity of all groups
            d3.selectAll(".myArea").style("opacity", .1)
            // expect the one that is hovered
            d3.select("." + d.target.__data__.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '')).style("opacity", 1)
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
            .style("fill", function (d: any) { return String(color(d)) })
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", width - 70)
            .attr("y", function (d, i) { return 10 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d: any) { return String(color(d)) })
            .text((d: any) => d)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
    }

    componentDidMount() {
        if (!this.state || !this.state.data) {
            const apiUrl = 'http://localhost:3000/value';
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
                            conjuntoProdutos.add(d.product);
                        }
                    });

                    this.setState({ minYear: minYear, maxYear: maxYear, conjuntoProdutos: Array.from(conjuntoProdutos), produtosSelecionados: Array.from(conjuntoProdutos), data: data })
                });
        }

    }

    componentDidUpdate() {
        // activate   
        this.buildGraph();
    }

    getSelectElements(data: any) {
        if (!data) {
            return [];
        }
        return data.map((d: any) => {
            return {
                value: d,
                label: d
            };
        });
    }

    handleInputChange(v: any, action: any) {
        if (action.action === 'create-option') {
            return;
        }
        if (!v) {
            this.setState({ produtosSelecionados: this.state.conjuntoProdutos });
        }
        this.setState({ produtosSelecionados: v.map((valor: any) => valor.value) });
    }

    render() {
        return (
            <div className="root">
                <Select
                    isMulti
                    name="products"
                    options={this.state == null ? [] : this.getSelectElements(this.state.conjuntoProdutos)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={this.handleInputChange}
                />
                <div className="svg" >
                    <svg className="container" ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
                </div>
            </div>
        );
    }
}

export default AreasEmpilhadas;