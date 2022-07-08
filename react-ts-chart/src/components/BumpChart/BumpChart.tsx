import React from 'react';
import * as d3 from 'd3';
import './BumpChart.css';
import Select from 'react-select';

interface IProps {
    width: number,
    height: number,
    variable: string,
    id: string
}

interface IState {
    variable: string,
    data: any[],
}

class BumpChart extends React.Component<IProps, IState> {
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
            data: [],
            variable: "value"
        };
        this.buildGraph = this.buildGraph.bind(this);
        this.getData = this.getData.bind(this);

    }

    private buildGraph() {
        if (!(this.state.data && this.state.data.length && this.state.data[0] && this.state.data[0].length)) {
            return;
        }
        d3.select(this.ref)
            .html("");

        // set the dimensions and margins of the graph
        const margin = { top: 20, right: 100, bottom: 100, left: 30 };
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

        // Parse the Data
        const color: any = d3.scaleOrdinal()
            .domain(Object.keys(this.mapaCodigoEstado))
            .range(["#7dfc00","#0ec434","#228c68","#8ad8e8","#235b54","#29bdab","#3998f5","#37294f","#277da7","#3750db","#f22020","#991919","#ffcba5","#e68f66","#c56133","#96341c","#ffc413","#f47a22","#2f2aa0","#b732cc","#772b9d","#f07cab","#d30b94","#c2eaaa","#c3a5b4","#946aa2","#5d4c86"])

        // const color = (c: string) => d3.interpolateRainbow(Object.keys(this.mapaCodigoEstado).indexOf(c) / Object.keys(this.mapaCodigoEstado).length);

        const dimensions:any[] = [];
        for (let year=this.getMinYear(); year<2021; year++) {
            dimensions.push(year.toString())
        };
        
        let initial_data: any = {};
        
        let circle_data: any[] = Object.keys(initial_data);

        (this.state.data).forEach((year:any, index:any) => {
            year.forEach((state: any) => {
                if (!(state.state in initial_data)) {
                    initial_data[state.state] = {}
                }
                initial_data[state.state][(index+this.getMinYear()).toString()] = state[this.state.variable];
                initial_data[state.state]['State'] = state.state;

                let obj:any = {}
                obj[this.state.variable] = state[this.state.variable]
                obj['State'] = state.state;
                obj['Year'] = index+this.getMinYear();
                circle_data.push(obj)
            })
        })
        
        let data = Object.values(initial_data);
        
        // For each dimension, I build a linear scale. I store all in a y object
        const y: any = {}
        for (let i in dimensions) {
        let name: string = dimensions[i]
        y[name] = d3.scaleLinear()
            .domain( [27,1] ) // --> Same axis range for each group
            // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
            .range([height, 0])
        }
    
        // Build the X scale -> it find the best position for each Y axis
        const x = d3.scalePoint()
        .range([0, width])
        .domain(dimensions);
    
        // Highlight the state that is hovered
        const highlight = function(event: any, d: any){
            let selected_state = d.State
        
            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.1")
            d3.selectAll(".circle")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("fill", "lightgrey")
                .style("opacity", "0.1")

            // Second the hovered state takes its color
            d3.selectAll(".state-" + selected_state)
                .transition().duration(200)
                .style("stroke", color(selected_state))
                .style("opacity", "1")
            d3.selectAll(".state---" + selected_state)
                .transition().duration(200)
                .style("stroke", color(selected_state))
                .style("fill", color(selected_state))
                .style("opacity", "1")

        }

        const highlightCircle = (event: any, d: any) => {
            let selected_state = d.State
            // first every group turns grey
            highlight(event, d);
            d3.select(".tooltip-bump-chart-container")
                .style("opacity", 1)
                .style("z-index", 1000000)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 30) + "px")
                .style("transform", "scale(1,1)");
            d3.select(".tooltip-bump-chart")
                .html("Estado: " + this.mapaCodigoEstado[d.State] + "<br>Rank: " + d[this.state.variable] + "<br>Ano: " + d.Year);
        }
    
        // Unhighlight
        const doNotHighlight = function(event: any, d: any){
            d3.selectAll(".line")
                .transition().duration(200).delay(100)
                .style("stroke", function(d:any): any{ return( color(d.State))} )
                .style("opacity", "1")
            d3.selectAll(".circle")
                .transition().duration(200).delay(100)
                .style("stroke", function(d:any): any{ return( color(d.State))} )
                .style("fill", function(d:any): any{ return( color(d.State))} )
                .style("opacity", "1")

            d3.selectAll(".tooltip-bump-chart-container")
                .style("opacity", 0)
                .style("z-index", -1000000)
                .style("transform", "scale(0.1,0.1)")
                .style("transition", "all .2s ease-in-out");
            }
            
            // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
            function path(d: any) {
                return d3.line()(dimensions.map(function(p:any):any { return [x(p), y[p](d[p])]; }));
            }
            
            // Draw the axis:
            svg.selectAll("myAxisFirst")
                // For each dimension of the dataset I add a 'g' element:
                .data(dimensions.slice(0,1)).enter()
                .append("g")
                .attr("class", "axis")
                // I translate this element to its right position on the x axis
                .attr("transform", function(d) { return `translate(${x(d)})`})
                // And I build the axis with the call function
                .each(function(d) { d3.select(this).call(d3.axisLeft(y).ticks(27).scale(y[d])); })
                // Add axis title
                .append("text")
                    .style("text-anchor", "middle")
                    .attr("y", height+20)
                    .text(function(d) { return d; })
                    .style("fill", "black")

            let maxYear = 2020 - this.getMinYear() + 1;
    
            svg.selectAll("myAxis")
                // For each dimension of the dataset I add a 'g' element:
                .data(dimensions.slice(1,maxYear-1)).enter()
                .append("g")
                .attr("class", "axis")
                // I translate this element to its right position on the x axis
                .attr("transform", function(d) { return `translate(${x(d)})`})
                // And I build the axis with the call function
                .each(function(d) { d3.select(this).call(d3.axisLeft(y).ticks(0).tickFormat("" as any).scale(y[d])).call(g => g.select('path').style("opacity", 0.3)); })
                // Add axis title
                .append("text")
                    .style("text-anchor", "middle")
                    .attr("y", height+20)
                    .text(function(d) { return d; })
                    .style("fill", "black")
    
            let lastYearData = circle_data.filter(elem => elem.Year === 2020)
    
            let lastYearRankState:any = {};
    
            let lastYearCodeState:any = {};
    
            for (let data of lastYearData) {
                lastYearRankState[data[this.state.variable]] = this.mapaCodigoEstado[data.State];
                lastYearCodeState[data[this.state.variable]] = data.State;
            }
        
            // Draw the axis:
            svg.selectAll("myAxisLast")
                // For each dimension of the dataset I add a 'g' element:
                .data(dimensions.slice(maxYear-1,maxYear)).enter()
                .append("g")
                .attr("class", "axis")
                // I translate this element to its right position on the x axis
                .attr("transform", function(d) { return `translate(${x(d)})`})
                // And I build the axis with the call function
                .each(function(d) { d3.select(this).call(d3.axisRight(y).ticks(27).tickFormat((v:any) => {return lastYearRankState[v];}).scale(y[d])); })
                // Add axis title
                .append("text")
                    .style("text-anchor", "middle")
                    .attr("y", height+20)
                    .text(function(d) { return d; })
                    .style("fill", "black")

            // Draw the lines
            svg
        .selectAll("myPath")
        .data(data)
        .join("path")
            .attr("class", function (d: any) { return "line state-" + d.State } ) // 2 class for each line: 'line' and the group name
            .attr("d",  path)
            .style("fill", "none" )
            .style("stroke", function(d:any):any{ return( color(d.State))} )
            .style("opacity", 1)
            .attr("stroke-width", function(d:any):any{ return(3)})
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight )

        
        // Draw the lines
        svg
        .selectAll("myCircle")
        .data(circle_data)
        .join("circle")
            .attr("class", function (d: any) { return "circle state---" + d.State } ) // 2 class for each line: 'line' and the group name
            .attr("r", 4)
            .attr("cx", function (d:any):any { return x(d.Year.toString()) })
            .attr("cy", (d:any):any => { return y[d.Year.toString()](d[this!.state.variable]) })
            .style("stroke", function(d:any):any{ return( color(d.State))} )
            .style("fill", function(d:any):any{ return( color(d.State))} )
            .style("opacity", 1)
            .on("mouseover", highlightCircle)
            .on("mouseleave", doNotHighlight )

    


    
    }

    getMinYear() {
        if (this.state.variable === 'plantedArea' || this.state.variable === 'lostArea') {
            return 1988;
        } else {
            return 1974; 
        }
    }
        
    getData() {
        let fullData = Array(47);
        let promises: any[] = [];
        for (let year=(this.getMinYear()); year < 2021; year++) {
            let apiUrl = 'http://localhost:5000/stateYear/' + this.props.variable + '?year=' + year;
            promises.push(
            fetch(apiUrl)
                .then((response) => response.json())
            );
        }

        Promise.all(promises).then((values) => {
            values.forEach((data, index) => {
                let year = index+this.getMinYear();
                if (data.length < 27) {
                    Object.keys(this.mapaCodigoEstado).forEach(state => {
                        if (!data.find((instance:any) => instance.state === state)) {
                            let obj:any = {}
                            obj['state'] = state;
                            obj[this.props.variable] = 0;
                            data.push(obj)
                        }
                    })
                }
                fullData[year-this.getMinYear()] = (data.sort((a:any,b:any)=>b[this.state.variable] - a[this.state.variable]).map((elem:any, index:any) => {
                    let obj:any = {};
                    obj['state'] = elem.state;
                    obj[this.state.variable] = index + 1;
                    return obj;
                } ))
            })
            this.setState({ data: fullData }, this.buildGraph)
        })

    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        if (this.props.variable !== this.state.variable) {
            this.setState({ variable: this.props.variable}, this.getData);
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
                <div className="tooltip-bump-chart-container">
                    <div className="tooltip-bump-chart"></div>
                </div>
            </div >
        );
    }
}

export default BumpChart;