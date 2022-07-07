import React from 'react';
import * as d3 from 'd3';
import './BarrasHorizontais.css';
import Select from 'react-select';

interface IProps {
    width: number,
    height: number,
    city: boolean,
    year: number,
    variable: string,
    id: string
}

interface IState {
    currentVariable: string,
    currentYear: number,
    onChangeProps: any
}

class BarrasHorizontais extends React.Component<IProps, IState> {
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

    mapaEstadoCodigo: any = {
        'Acre': '12',
        'Alagoas': '27',
        'Amapá': '16',
        'Amazonas': '13',
        'Bahia': '29',
        'Ceará': '23',
        'Distrito Federal': '53',
        'Espírito Santo': '32',
        'Goiás': '52',
        'Maranhão': '21',
        'Mato Grosso': '51',
        'Mato Grosso do Sul': '50',
        'Minas Gerais': '31',
        'Pará': '15',
        'Paraíba': '25',
        'Paraná': '41',
        'Pernambuco': '26',
        'Piauí': '22',
        'Rio Grande do Norte': '24',
        'Rio Grande do Sul': '43',
        'Rio de Janeiro': '33',
        'Rondônia': '11',
        'Roraima': '14',
        'Santa Catarina': '42',
        'São Paulo': '35',
        'Sergipe': '28',
        'Tocantins': '17'
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            currentVariable: 'value',
            currentYear: 2020,
            onChangeProps: () => { }
        };
        this.buildGraph = this.buildGraph.bind(this);
    }

    private buildGraph() {
        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 15, bottom: 100, left: 230 };
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

        // Show the Y scale
        let y = d3.scaleBand()
            .range([0, height]);

        // X axis
        let x = d3.scaleLinear()
            .range([0, width]);

        let xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`);

        let yAxis = svg.append("g");

        let mouseoverState = (d: any) => {
            d3.select(".tooltip-barra-horizontal-container")
                .style("opacity", 1)
                .style("z-index", 1000000);

            d3.select(".tooltip-barra-horizontal-container")
                .style("transform", "scale(1,1)");
            d3.select(".tooltip-barra-horizontal")
                .html("Valor: " + Math.round(d.target.__data__[this.props.variable] * 10000) / 10000);

            d3.selectAll(".myRect" + this.props.id)
                .style("opacity", 0.1)

            d3.selectAll(".state" + d.target.__data__.state)
                .style("opacity", 1)
        };

        let mouseoverCity = (d: any) => {
            d3.select(".tooltip-barra-horizontal-container")
                .style("opacity", 1)
                .style("z-index", 1000000);

            d3.select(".tooltip-barra-horizontal-container")
                .style("transform", "scale(1,1)");
            d3.select(".tooltip-barra-horizontal")
                .html("Valor: " + Math.round(d.target.__data__[this.props.variable] * 10000) / 10000);

            d3.selectAll(".myRect" + this.props.id)
                .style("opacity", 0.1)

            d3.selectAll(".city" + d.target.__data__.id)
                .style("opacity", 1)
        };

        let mousemove = (d: any) => {
            console.log(d3.select(".tooltip-barra-horizontal-container"));
            d3.select(".tooltip-barra-horizontal-container")
                .style("-webkit-transition-property", "none")
                .style("-moz-transition-property", "none")
                .style("-o-transition-property", "none")
                .style("transition-property", "none")
                .style("left", (d.pageX + 15) + "px")
                .style("top", (d.pageY - 30) + "px");
        };

        let mouseleave = (d: any) => {
            d3.selectAll(".tooltip-barra-horizontal-container")
                .style("opacity", 0)
                .style("z-index", -1000000)
                .style("transform", "scale(0.1,0.1)")
                .style("transition", "all .2s ease-in-out");
            d3.selectAll(".myRect" + this.props.id)
                .style("opacity", 1)
        };

        const updateBars = (year: any, variable: any) => {
            if (this.props.city) {
                let apiUrl = 'cityYear/' + this.props.variable + '?year=' + year;
                fetch(apiUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data) {
                            data.sort((a: any, b: any) => {
                                return b[this.props.variable] - a[this.props.variable];
                            });
                            data.forEach((element: any, ind: any) => {
                                let d = element;
                                d.id = ind;
                                return d;
                            });
                            data = data.slice(0, 30);
                            x.domain([0, d3.max(data, (d: any) => d[variable]) as any]);
                            let yDomain = [];
                            for (let d of data) {
                                yDomain.push(d.city);
                            }
                            y.domain(yDomain);
                            xAxis.transition().duration(500).call(d3.axisBottom(x) as any).selectAll("text")
                                .style("text-anchor", "end")
                                .attr("transform", "rotate(-65)");;
                            yAxis.call(d3.axisLeft(y));
                            let barras = svg.selectAll(".myRect" + this.props.id)
                                .data(data, (d: any) => d.city);
                            barras.exit()
                                .transition()
                                .duration(1000)
                                .attr("width", 0)
                                .remove();
                            barras.enter()//this is the enter selection
                                .append('rect')
                                .attr("x", 1 as any)
                                .attr("y", (d: any) => y(d.city) as any + 5)
                                .attr("width", (d: any) => x(d[variable]) + 1 as any)
                                .attr("class", (d: any) => { return "myRect" + this.props.id + " city" + d.id; })
                                .attr("height", y.bandwidth() - 10)
                                .attr("fill", "#69b3a2")
                                .on("mouseover", mouseoverCity)
                                .on("mousemove", mousemove)
                                .on("mouseleave", mouseleave)
                                .merge(barras as any)//and from now on, both the enter and the update selections
                                .transition()
                                .duration(1000)
                                .attr("x", 1 as any)
                                .attr("y", (d: any) => y(d.city) as any + 5)
                                .attr("width", (d: any) => x(d[variable]) + 1 as any)
                                .attr("class", (d: any) => { return "myRect" + this.props.id + " city" + d.id; })
                                .attr("height", y.bandwidth() - 10)
                                .attr("fill", "#69b3a2");

                        }
                    })
            } else {
                let apiUrl = 'stateYear/' + this.props.variable + '?year=' + year;
                fetch(apiUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data) {
                            x.domain([0, d3.max(data, (d: any) => d[variable]) as any]);
                            let yDomain = [];
                            for (let k of Object.keys(this.mapaCodigoEstado)) {
                                yDomain.push(this.mapaCodigoEstado[k]);
                            }
                            yDomain.sort((a: any, b: any) => {
                                let codigoA = this.mapaEstadoCodigo[a];
                                let codigoB = this.mapaEstadoCodigo[b];
                                let valorA = 0;
                                let valorB = 0;
                                data.forEach((d: any) => {
                                    if (d.state === codigoA) {
                                        valorA = d[variable];
                                    }
                                    if (d.state === codigoB) {
                                        valorB = d[variable];
                                    }
                                });
                                return valorB - valorA;
                            });
                            y.domain(yDomain);
                            xAxis.transition().duration(500).call(d3.axisBottom(x) as any).selectAll("text")
                                .style("text-anchor", "end")
                                .attr("transform", "rotate(-65)");;
                            yAxis.call(d3.axisLeft(y));
                            let barras = svg.selectAll(".myRect" + this.props.id)
                                .data(data, (d: any) => d.state);
                            barras.exit()
                                .transition()
                                .duration(1000)
                                .attr("width", 0)
                                .remove();
                            barras.enter()//this is the enter selection
                                .append('rect')
                                .attr("x", 1 as any)
                                .attr("y", (d: any) => y(this.mapaCodigoEstado[d.state]) as any + 5)
                                .attr("width", (d: any) => x(d[variable]) + 1 as any)
                                .attr("class", (d: any) => { return "myRect" + this.props.id + " state" + d.state; })
                                .attr("height", y.bandwidth() - 10)
                                .attr("fill", "#69b3a2")
                                .on("mouseover", mouseoverState)
                                .on("mousemove", mousemove)
                                .on("mouseleave", mouseleave)
                                .merge(barras as any)//and from now on, both the enter and the update selections
                                .transition()
                                .duration(1000)
                                .attr("x", 1 as any)
                                .attr("y", (d: any) => y(this.mapaCodigoEstado[d.state]) as any + 5)
                                .attr("width", (d: any) => x(d[variable]) + 1 as any)
                                .attr("class", (d: any) => { return "myRect" + this.props.id + " state" + d.state; })
                                .attr("height", y.bandwidth() - 10)
                                .attr("fill", "#69b3a2");

                        }
                    })
            }
        };
        updateBars(this.props.year, this.props.variable);
        this.setState({
            onChangeProps: () => {
                updateBars(this.props.year, this.props.variable);
            }
        });
    }

    componentDidMount() {
        this.buildGraph();
    }

    componentDidUpdate() {
        if (this.props.variable !== this.state.currentVariable || this.props.year !== this.state.currentYear) {
            this.setState({ currentVariable: this.props.variable, currentYear: this.props.year }, this.state.onChangeProps);
        }
    }

    render() {
        return (
            <div className="root">
                <div className="graph" style={{ height: this.props.height, width: this.props.width }}>
                    <div className="svg" >
                        <svg ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
                    </div>
                </div>
                <div className="tooltip-barra-horizontal-container">
                    <div className="tooltip-barra-horizontal"></div>
                </div>
            </div >
        );
    }
}

export default BarrasHorizontais;