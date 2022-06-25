// @ts-ignore: Object is possibly 'undefined'.

import React from 'react';
import * as d3 from 'd3';
import './Pareto.css'

interface IProps {
    width: number,
    height: number,
    variavel: string
}

interface IState {
    data: any[],
    minYear: number,
    maxYear: number,
    conjuntoProdutos: string[],
    produtosSelecionados: string[],
}

class Pareto extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    private buildGraph() {
        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 10, bottom: 80, left: 50 };
        const width: number = this.props.width - margin.left - margin.right;
        const height: number = this.props.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const Data: any = {};
        this.state.data.forEach(instance => {
            Data[instance.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "")] ? Data[instance.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "")] += instance.quantity : Data[instance.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "")] = instance.quantity;
        })

        const proccessedData: any = Object.keys(Data).map((produto: any) => {
            return {
                "Produto": produto,
                "Valor": Data[produto]
            }
        });

        console.log(proccessedData);
        // sort data
        proccessedData.sort(function (b: any, a: any) {
            return a.Valor - b.Valor;
        });

        let total = 0;
        proccessedData.forEach((row: any) => {
            total += Number(row.Valor);
        })

        // X axis
        const x = d3.scaleBand()
            .range([0, width])
            .domain(proccessedData.map((d: any) => d.Produto))
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
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(formatPercent)
            );

        // Pareto X axis
        const xAxis = d3.scaleBand()
            .range([0, width * 1])
            .domain(proccessedData.map((row: any, index: number) => (index + 1).toString()))
            .padding(0.2);
        svg.append("g")
            .attr("transform", `translate(0, ${height * 100})`)
            .call(d3.axisBottom(xAxis))
            .selectAll("text")

        // Bars
        svg.selectAll("mybar")
            .data(proccessedData)
            .enter()
            .append("rect")
            .attr("x", (d: any) => x((d.Produto || '').toString())!)
            .attr("y", (d: any) => y(Number(d.Valor) / total))
            .attr("width", x.bandwidth())
            .attr("height", (d: any) => height - y(Number(d.Valor) / total))
            .attr("fill", "#69b3a2")

        const filteredData: any[] = [];

        proccessedData.forEach((row: any, index: number) => {
            filteredData.push([index + 1, Number(row.Valor)])
        });

        let cumSum: number = 0;

        svg.append("path")
            .datum(filteredData)
            .attr("fill", "none")
            .attr("stroke", "royalblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return (xAxis(d[0].toString())! + x.bandwidth() / 2) })
                .y(function (d) { cumSum += d[1]; return y(cumSum / total) })
                .curve(d3.curveMonotoneX)
            )

        cumSum = 0;

        svg.selectAll("myCircles")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("fill", "red")
            .attr("stroke", "none")
            .attr("cx", function (d) { return (xAxis(d[0].toString())! + x.bandwidth() / 2) })
            .attr("cy", function (d) { cumSum += d[1]; return y(cumSum / total) })
            .attr("r", 1.5)
            .attr("fill", "royalblue")
            .attr("stroke", "royalblue");

    }

    componentDidMount() {
        if (!this.state || !this.state.data) {
            const apiUrl = 'http://localhost:5000/' + this.props.variavel;
            console.log(apiUrl)
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

                    this.setState({ minYear: minYear, maxYear: maxYear, conjuntoProdutos: Array.from(conjuntoProdutos), produtosSelecionados: Array.from(conjuntoProdutos), data: data })
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

export default Pareto;