// @ts-ignore: Object is possibly 'undefined'.

import React from 'react';
import * as d3 from 'd3';
import './Pareto.css'

interface IProps {
    width: number,
    height: number,
    variable: string,
    id: string,
    estado: string
}

interface IState {
    data: any[],
    estado: string,
    minYear: number,
    maxYear: number,
    conjuntoProdutos: string[],
    produtosSelecionados: string[],
}

class Pareto extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    private buildGraph() {
        d3.select(this.ref)
            .html("");

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
            Data[instance.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "")] ? Data[instance.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "")] += instance[this.props.variable] : Data[instance.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "")] = instance[this.props.variable];
        })


        const proccessedData: any = Object.keys(Data).map((produto: any) => {
            return {
                "Produto": produto,
                "Valor": Data[produto]
            }
        });

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

        const keys: any = Array.from(this.state.produtosSelecionados);
        const color = (c: string) => d3.interpolateViridis(keys.indexOf(c) / keys.length);

        // Highlight the state that is hovered
        const highlight = (event: any, d: any) => {
            let selected_product = d.Produto
        
            // first every group turns grey
            d3.selectAll(".bar"+ this.props.id)
                .transition().duration(200)
                .style("fill", "lightgrey")
                .style("opacity", "0.5")

            // Second the hovered state takes its color
            d3.selectAll(".state-" + selected_product.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, ''))
                .transition().duration(200)
                .style("fill", function(d:any): any{ return( (color(d.Produto)))} )
                .style("opacity", "1")

            d3.selectAll(".line"+ this.props.id)
                .transition().duration(200)
                .style("fill", "none")
                .style("stroke", "lightgray")
                .style("opacity", "0.05")
            
            d3.selectAll(".circle"+ this.props.id)
                .transition().duration(200)
                .style("stroke", "lightgray")
                .style("opacity", "0.05")

            d3.select(".tooltip-pareto-container")
                .style("opacity", 1)
                .style("z-index", 1000000)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 30) + "px")
                .style("transform", "scale(1,1)");
            d3.select(".tooltip-pareto")
                .html("Valor absoluto: " + d.Valor + "<br>Valor relativo: " + d.Valor/total * 100 + "%");
        }

        const doNotHighlight = (event: any, d: any) => {
            let selected_product = d.Produto

            d3.selectAll(".bar"+ this.props.id)
                .transition().duration(200).delay(100)
                .style("fill", (d: any) => color(d.Produto) )
                .style("opacity", "1")

            d3.selectAll(".line"+ this.props.id)
                .transition().duration(200).delay(100)
                .style("stroke", "orange" )
                .style("opacity", "1")

            d3.selectAll(".circle"+ this.props.id)
                .transition().duration(200).delay(100)
                .style("stroke", "orange")
                .style("opacity", "1")

            d3.selectAll(".tooltip-pareto-container")
                .style("opacity", 0)
                .style("z-index", -1000000)
                .style("transform", "scale(0.1,0.1)")
                .style("transition", "all .2s ease-in-out");
        }

        // Highlight the state that is hovered
        const highlightCircle = (event: any, d: any) => {
            let selected_product = d[0]

            d3.selectAll(".bar"+ this.props.id)
                .transition().duration(200)
                .style("fill", "lightgrey")
                .style("opacity", "0.5")

            d3.selectAll(".line"+ this.props.id)
                .transition().duration(200)
                .style("fill", "none")
                .style("stroke", "lightgray")
                .style("opacity", "0.05")
            
            d3.selectAll(".circle"+ this.props.id)
                .transition().duration(200)
                .style("stroke", "lightgray")
                .style("opacity", "0.05")

            d3.selectAll(".state-" + selected_product )
                .transition().duration(200)
                .style("fill", "orange" )
                .style("opacity", "1")

            for (let i=0; i<d[0]; i++) {
                d3.selectAll(".state-" + proccessedData[i].Produto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') )
                    .transition().duration(200)
                    .style("fill", (d: any) => color(proccessedData[i].Produto) )
                    .style("opacity", "1")
            }

            d3.select(".tooltip-pareto-container")
                .style("opacity", 1)
                .style("z-index", 1000000)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 30) + "px")
                .style("transform", "scale(1,1)");

            let acumulado = 0;
            for (let i=0; i<d[0]; i++) {
                acumulado += (proccessedData[i].Valor/total * 100)
            }
            
            d3.select(".tooltip-pareto")
                .html("Acumulado: " + acumulado + "%");
        }

        const doNotHighlightCircle = (event: any, d: any) => {
            let selected_product = d.Produto
            d3.selectAll(".bar"+ this.props.id)
                .transition().duration(200).delay(100)
                .style("fill", (d: any) => color(d.Produto) )
                .style("opacity", "1")

            d3.selectAll(".line"+ this.props.id)
                .transition().duration(200).delay(100)
                .style("stroke", "orange" )
                .style("opacity", "1")

            d3.selectAll(".circle"+ this.props.id)
                .transition().duration(200).delay(100)
                .style("stroke", "orange")
                .style("opacity", "1")

            d3.selectAll(".tooltip-pareto-container")
                .style("opacity", 0)
                .style("z-index", -1000000)
                .style("transform", "scale(0.1,0.1)")
                .style("transition", "all .2s ease-in-out");
        }

        // Bars
        svg.selectAll("mybar")
            .data(proccessedData)
            .enter()
            .append("rect")
            .attr("class", (d: any) => { return "bar" + this.props.id + " state-" + d.Produto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "").replace(/\W/g, '') } )
            .attr("x", (d: any) => x((d.Produto || '').toString())!)
            .attr("y", (d: any) => y(Number(d.Valor) / total))
            .attr("width", x.bandwidth())
            .attr("height", (d: any) => height - y(Number(d.Valor) / total))
            .attr("fill", (d: any) => color(d.Produto))
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight )

        const filteredData: any[] = [];

        proccessedData.forEach((row: any, index: number) => {
            filteredData.push([index + 1, Number(row.Valor)])
        });

        let cumSum: number = 0;

        svg.append("path")
            .datum(filteredData)
            .attr("class", "line"+ this.props.id)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 2)
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
            .attr("cx", function (d) { return (xAxis(d[0].toString())! + x.bandwidth() / 2) })
            .attr("cy", function (d) { cumSum += d[1]; return y(cumSum / total) })
            .attr("class", (d: any) => { return "circle"+ this.props.id + " state-" + d[0] } )
            .attr("r", 5)
            .attr("fill", "orange")
            .attr("stroke", "orange")
            .on("mouseover", highlightCircle)
            .on("mouseleave", doNotHighlightCircle);

    }

    componentDidMount() {
        if (!this.state || !this.state.data) {
            const apiUrl = 'http://localhost:5000/state/' + this.props.variable + "?state=" + this.props.estado;
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

                    this.setState({ minYear: minYear, maxYear: maxYear, conjuntoProdutos: Array.from(conjuntoProdutos), produtosSelecionados: Array.from(conjuntoProdutos), data: data, estado: this.props.estado })
                });
        }

    }

    componentDidUpdate() {
        if (this.state.estado !== this.props.estado) {
            const apiUrl = 'http://localhost:5000/state/' + this.props.variable + "?state=" + this.props.estado;
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

                    this.setState({ minYear: minYear, maxYear: maxYear, conjuntoProdutos: Array.from(conjuntoProdutos), produtosSelecionados: Array.from(conjuntoProdutos), data: data, estado: this.props.estado  })
                });
        }
        
        this.buildGraph();
    }

    render() {
        return (
            <div>
                <div className="svg" >
                    <svg className="container-pareto" ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
                </div>
                <div className="tooltip-pareto-container">
                    <div className="tooltip-pareto"></div>
                </div>
            </div>
        );
    }
}

export default Pareto;