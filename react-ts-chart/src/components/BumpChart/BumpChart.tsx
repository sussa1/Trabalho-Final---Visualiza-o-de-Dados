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

    private buildGraph() {
        d3.select(this.ref)
            .html("");

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

        // Parse the Data
        let data: any[] = [];

        const color: any = d3.scaleOrdinal()
            .domain(Object.keys(this.mapaCodigoEstado))
            .range(["#7dfc00","#0ec434","#228c68","#8ad8e8","#235b54","#29bdab","#3998f5","#37294f","#277da7","#3750db","#f22020","#991919","#ffcba5","#e68f66","#c56133","#96341c","#ffc413","#f47a22","#2f2aa0","#b732cc","#772b9d","#f07cab","#d30b94","#edeff3","#c3a5b4","#946aa2","#5d4c86"])

        const dimensions = ['1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'];
    
        // console.log((this.state.data));

        // let dataTest = Object.keys(this.mapaCodigoEstado).map((estado:String) => {
        //     let obj: any = {}
        //     obj['1974'] = (this.state.data)[0].filter((elem: any) => elem.state === estado)[this.state.variable];
        //     return obj;
        // })

        // console.log(dataTest);

        data = [{'1974': 1, '1975':5, 'Species': '31'}, {'1974': 3, '1975':2, 'Species': '13'},]

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
    
        // Highlight the specie that is hovered
        const highlight = function(event: any, d: any){
            let selected_specie = d.Species
        
            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.2")
            // Second the hovered specie takes its color
            d3.selectAll("." + selected_specie)
                .transition().duration(200)
                .style("stroke", color(selected_specie))
                .style("opacity", "1")
        }
    
        // Unhighlight
        const doNotHighlight = function(event: any, d: any){
        d3.selectAll(".line")
            .transition().duration(200).delay(1000)
            .style("stroke", function(d:any): any{ return( color(d.Species))} )
            .style("opacity", "1")
        }
    
        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d: any) {
            return d3.line()(dimensions.map(function(p:any):any { return [x(p), y[p](d[p])]; }));
        }
    
        // Draw the lines
        svg
        .selectAll("myPath")
        .data(data)
        .join("path")
            .attr("class", function (d) { return "line " + d.Species } ) // 2 class for each line: 'line' and the group name
            .attr("d",  path)
            .style("fill", "none" )
            .style("stroke", function(d:any):any{ return( color(d.Species))} )
            .style("opacity", 0.5)
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight )
    
        // Draw the axis:
        svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        .attr("class", "axis")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return `translate(${x(d)})`})
        // And I build the axis with the call function
        .each(function(d) { d3.select(this).call(d3.axisLeft(y).ticks(5).scale(y[d])); })
        // Add axis title
        .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; })
            .style("fill", "black")
    
    }
        
    // }

    componentDidMount() {
        if (!this.state || !this.state.data) {
            let fullData: any[] = [];
            for (let year=1974; year < 2021; year++) {
                let apiUrl = 'http://localhost:5000/stateYear/' + this.props.variable + '?year=' + year;
                fetch(apiUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        let minYear = Infinity;
                        let maxYear = 0;
                        data.forEach((d: any) => {
                            if (d.year > maxYear) {
                                maxYear = d.year;
                            }
                            if (d.year < minYear) {
                                minYear = d.year;
                            }
                        });
                        fullData.push(data.sort((a:any,b:any)=>b[this.state.variable] - a[this.state.variable]).map((elem:any, index:any) => {
                            let obj:any = {};
                            obj['state'] = elem.state;
                            obj[this.state.variable] = index + 1;
                            return obj;
                        } ))
                    });
            }

            console.log(fullData)

            this.setState({ data: fullData })
        }
    }

    componentDidUpdate() {
        if (this.props.variable !== this.state.variable) {
            this.setState({ variable: this.props.variable});
        }

        this.buildGraph();
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

export default BumpChart;