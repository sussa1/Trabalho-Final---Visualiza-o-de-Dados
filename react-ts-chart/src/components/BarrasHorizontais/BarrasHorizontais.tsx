import React from 'react';
import * as d3 from 'd3';
import './BarrasHorizontais.css';
import Select from 'react-select';

interface IProps {
    width: number,
    height: number
}

interface IState {
    data: any[],
    year: number
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

    constructor(props: IProps) {
        super(props);
        this.state = {
            data: [],
            year: 2019
        };
        this.buildGraph = this.buildGraph.bind(this);
        this.getVariableSelectElements = this.getVariableSelectElements.bind(this);
        this.handleVariableInputChange = this.handleVariableInputChange.bind(this);
        this.getData = this.getData.bind(this);
    }

    private buildGraph() {
        if (!this.state.data) {
            return;
        }
        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 55, bottom: 250, left: 150 };
        const width: number = this.props.width - 250 - margin.left - margin.right;
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
        // Add X axis
        let xDomain = [];
        for (let k of Object.keys(this.mapaCodigoEstado)) {
            xDomain.push(this.mapaCodigoEstado[k]);
        }
        // Show the Y scale
        let y = d3.scaleBand()
            .range([0, height])
            .domain(xDomain.sort());

        let maxValue = 0;
        for (let k of Object.keys(this.mapaCodigoEstado)) {
            if (this.state.data[k as any] > maxValue) {
                maxValue = this.state.data[k as any];
            }
        }

        // X axis
        let x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(this.state.data, d => d.value) + d3.max(this.state.data, d => d.value) * 0.001 as any]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-65)");

        svg.append("g")
            .call(d3.axisLeft(y))

        let mouseover = function (d: any) {
            d3.select(".tooltip-container")
                .style("opacity", 1)
                .style("z-index", 1000);

            d3.select(".tooltip-container")
                .style("transform", "scale(1,1)");
            d3.select(".tooltip")
                .html("Valor: " + d.target.__data__.value);

            d3.selectAll(".myRect")
                .style("opacity", 0.1)

            d3.selectAll(".state" + d.target.__data__.state)
                .style("opacity", 1)
        };

        let mousemove = function (d: any) {
            d3.select(".tooltip-container")
                .style("-webkit-transition-property", "none")
                .style("-moz-transition-property", "none")
                .style("-o-transition-property", "none")
                .style("transition-property", "none")
                .style("left", (d.pageX + 15) + "px")
                .style("top", (d.pageY - 50) + "px");
        };

        let mouseleave = function (d: any) {
            d3.selectAll(".tooltip-container")
                .style("opacity", 0)
                .style("z-index", -1000)
                .style("transform", "scale(0.1,0.1)")
                .style("transition", "all .2s ease-in-out");
            d3.selectAll(".myRect")
                .style("opacity", 1)
        };

        //Bars
        svg.selectAll("myRect")
            .data(this.state.data)
            .join("rect")
            .attr("x", x(d3.max(this.state.data, d => d.value) * 0.001) as any)
            .attr("y", d => y(this.mapaCodigoEstado[d.state]) as any + 5)
            .attr("width", d => x(d.value) as any)
            .attr("class", d => { return "myRect state" + d.state; })
            .attr("height", y.bandwidth() - 10)
            .attr("fill", "#69b3a2")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const apiUrl = 'http://localhost:3000/year/value?year=' + this.state.year;
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                this.setState({ data: data }, () => this.buildGraph());
            });
    }

    componentDidUpdate() {
        // activate   
        this.buildGraph();
    }

    getVariableSelectElements() {
        let values = [];
        for (let i = 2019; i >= 1974; i--) {
            values.push({
                value: i, label: i
            });
        }
        return values;
    }

    handleVariableInputChange(v: any, action: any) {
        if (action.action === 'create-option') {
            return;
        }
        if (!v) {
            this.setState({ year: 2019 }, () => this.getData());
        } else {
            this.setState({ year: v.value }, () => this.getData());
        }
    }

    render() {
        return (
            <div className="root">

                <Select
                    name="variable"
                    options={this.getVariableSelectElements()}
                    defaultValue={this.getVariableSelectElements()[0]}
                    className="basic-select"
                    classNamePrefix="select"
                    id="variableSelect"
                    placeholder="Escolha o ano"
                    onChange={this.handleVariableInputChange}
                />
                <div className="graph" style={{ height: this.props.height, width: this.props.width }}>
                    <div className="svg" >
                        <svg className="container" ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
                    </div>
                    <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                        <svg className="legends" style={{ overflowY: 'auto', overflowX: 'hidden' }}></svg>
                    </div>
                </div>
                <div className="tooltip-container">
                    <div className="tooltip"></div>
                </div>
            </div >
        );
    }
}

export default BarrasHorizontais;