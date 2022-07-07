import React from 'react';
import * as d3 from 'd3';
import './Linha.css'
import { cp } from 'fs/promises';

interface IProps {
    width: number,
    height: number,
    variable: string,
    firstSelectedItem: string,
    secondSelectedItem: string,
    products: boolean,
    id: string,
}

interface IState {
    data: any[],
    minYear: number,
    maxYear: number,
    conjuntoProdutos: string[],
    produtosSelecionados: string[],
    firstSelectedItem: string,
    secondSelectedItem: string,
    onChangeFirstItem: any,
    onChangeSecondItem: any
}

class Linha extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;

    constructor(props: IProps) {
        super(props);
        this.state = {
            data: [],
            minYear: 0,
            maxYear: Infinity,
            conjuntoProdutos: [],
            produtosSelecionados: [],
            firstSelectedItem: '',
            secondSelectedItem: '',
            onChangeFirstItem: null,
            onChangeSecondItem: null
        };
        this.buildGraph = this.buildGraph.bind(this);
    }

    private buildGraph() {

        d3.select(this.ref)
            .html("");
        // set the dimensions and margins of the graph
        const margin = {top: 10, right: 100, bottom: 30, left: 80};
        const width: number = this.props.width - margin.left - margin.right;
        const height: number = this.props.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        // List of groups (here I have one group per column)
        const products = ['Abacate', 'Abacaxi', 'Alfafa fenada', 'Algodão arbóreo', 'Algodão herbáceo', 'Alho', 'Amendoim', 'Arroz', 'Aveia', 'Azeitona', 'Açaí', 'Banana', 'Batata-doce', 'Batata-inglesa', 'Borracha', 'Cacau', 'Café Arábica', 'Café Canephora', 'Café Total', 'Caju', 'Cana para forragem', 'Cana-de-açúcar', 'Caqui', 'Castanha de caju', 'Cebola', 'Centeio', 'Cevada', 'Chá-da-índia', 'Coco-da-baía', 'Dendê', 'Erva-mate', 'Ervilha', 'Fava', 'Feijão', 'Figo', 'Fumo', 'Girassol', 'Goiaba', 'Guaraná', 'Juta', 'Laranja', 'Limão', 'Linho', 'Malva', 'Mamona', 'Mamão', 'Mandioca', 'Manga', 'Maracujá', 'Marmelo', 'Maçã', 'Melancia', 'Melão', 'Milho', 'Noz', 'Palmito', 'Pera', 'Pimenta-do-reino', 'Pêssego', 'Rami', 'Sisal ou agave', 'Soja', 'Sorgo', 'Tangerina', 'Tomate', 'Trigo', 'Triticale', 'Tungue', 'Urucum', 'Uva'];

        var hoverData: any = [];

        var hoverDataSecond: any = [];

        // Add X axis --> it is a date format
        const x = d3.scaleLinear()
            .domain([this.state.minYear-1, this.state.maxYear+1])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 5000000])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // A color scale: one color for each group
        const myColor = d3.scaleOrdinal()
            .domain(products)
            .range(d3.schemeSet2);

        // Initialize lines
        var line = svg
            .append('g')
            .append("path")
            .style("stroke-width", 3)
            .style("fill", "none")

        var secondLine = svg
            .append('g')
            .append("path")
            .style("stroke-width", 3)
            .style("fill", "none")

        // This allows to find the closest X index of the mouse:
        var bisect = d3.bisector(function(d: any) { return d[0]; }).left;

        // Create the circle that travels along the curve of chart
        var focus = svg
            .append('g')
            .append('circle')
            .style("fill", "black")
            .attr("stroke", "black")
            .attr('r', 2)
            .style("opacity", 0)

        var focusSecond = svg
            .append('g')
            .append('circle')
            .style("fill", "black")
            .attr("stroke", "black")
            .attr('r', 2)
            .style("opacity", 0)

        // Create the text that travels along the curve of chart
        var focusText = svg
            .append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        var focusTextSecond = svg
            .append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        const update = (selectedProduct: any) => {
            // const filteredData: any = [];
            // this.state.data.forEach(instance => {
            //     if (instance.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "") === selectedProduct) {
            //         filteredData.push([instance.year, instance[this.props.variable]]);
            //     }
            // });

            let apiUrl = '';
            let filteredData: any[] = []
            if (this.props.products) {
                apiUrl = 'http://localhost:5000/product/' + this.props.variable + '?product=' + selectedProduct;
            } else {
                apiUrl = 'http://localhost:5000/stateTotal/' + this.props.variable + '?state=' + selectedProduct;
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

                    filteredData = data;

                    this.setState({ minYear: minYear, maxYear: maxYear, conjuntoProdutos: Array.from(conjuntoProdutos), produtosSelecionados: Array.from(conjuntoProdutos), data: data, firstSelectedItem: this.props.firstSelectedItem, secondSelectedItem: this.props.secondSelectedItem })
                });


            console.log(filteredData)

            line
                .datum(filteredData)
                .transition()
                .duration(500)
                .attr("d", d3.line()
                    .x(function(d) { return x(+d[0]); })
                    .y(function(d) { return y(+d[1]); })
                )
                .attr("stroke", function(d){ return String(myColor(selectedProduct)) })

            hoverData = filteredData.slice();
        }

        const updateSecond = (selectedProduct: any) => {
            const filteredData: any = [];
            this.state.data.forEach(instance => {
                if (instance.product.replace(/ *\([^)]*\)*/g, "").replaceAll("*", "") === selectedProduct) {
                    filteredData.push([instance.year, instance[this.props.variable]]);
                }
            });

            secondLine
                .datum(filteredData)
                .transition()
                .duration(500)
                .attr("d", d3.line()
                    .x(function(d) { return x(+d[0]); })
                    .y(function(d) { return y(+d[1]); })
                )
                .attr("stroke", function(d){ return String(myColor(selectedProduct)) })

            hoverDataSecond = filteredData.slice();
        }

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mousemove', (e) => {mousemove(d3.pointer(e)) })
            .on('mouseout', mouseout);


        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseover() {
            if (hoverData.length > 0 && hoverData[0][0] && hoverData[0][1]) {
                focus.style("opacity", 1)
                focusText.style("opacity", 1)
            }
            if (hoverDataSecond.length > 0 && hoverDataSecond[0][0] && hoverDataSecond[0][1]) {
                focusSecond.style("opacity", 1)
                focusTextSecond.style("opacity",1)
            }
        }

        function mousemove(e: any) {
            // recover coordinate we need
            var x0 = Math.round(x.invert(e[0]));

            var i = bisect(hoverData, x0, 1);
            var selectedData = hoverData[i];

            var i2 = bisect(hoverDataSecond, x0, 1);
            var selectedDataSecond = hoverDataSecond[i2];

            if (selectedData) focus
                .attr("cx", x(selectedData[0]))
                .attr("cy", y(selectedData[1]))
            if (selectedData) focusText
                .html("Ano:" + selectedData[0] + ",  " + "Quantidade:" + selectedData[1])
                .attr("x", x(selectedData[0])+5)
                .attr("y", y(selectedData[1]))
            

            if (selectedDataSecond) focusSecond
                .attr("cx", x(selectedDataSecond[0]))
                .attr("cy", y(selectedDataSecond[1]))
            if (selectedDataSecond) focusTextSecond
                .html("Ano:" + selectedDataSecond[0] + ",  " + "Quantidade:" + selectedDataSecond[1])
                .attr("x", x(selectedDataSecond[0])+5)
                .attr("y", y(selectedDataSecond[1]))
        }
        
        function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity",0)

            focusSecond.style("opacity", 0)
            focusTextSecond.style("opacity",0)
        }

        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(event,d) {
            // recover the option that has been chosen
            const selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            update(selectedOption)
        })

        d3.select("#selectButtonSecond").on("change", function(event,d) {
            const selectedOption = d3.select(this).property("value")
            updateSecond(selectedOption)
        })

        this.setState({
            onChangeFirstItem: (v: any) => {
                if (!v || v.length === 0) {
                    this.setState({ firstSelectedItem: "Uva" }, () => update(this.state.firstSelectedItem));
                } else {
                    this.setState({ firstSelectedItem: this.state.firstSelectedItem }, () => update(this.state.firstSelectedItem));
                }
            },
            onChangeSecondItem: (v: any) => {
                if (!v || v.length === 0) {
                    this.setState({ secondSelectedItem: "Uva" }, () => updateSecond(this.state.secondSelectedItem));
                } else {
                    this.setState({ secondSelectedItem: this.state.secondSelectedItem }, () => updateSecond(this.state.secondSelectedItem));
                }
            }
        });

    }

    componentDidMount() {
        this.buildGraph();
    }

    componentDidUpdate() {
        this.buildGraph();
        if (this.props.firstSelectedItem !== this.state.firstSelectedItem) {
            this.setState({ firstSelectedItem: this.props.firstSelectedItem });
            this.state.onChangeFirstItem(this.state.firstSelectedItem);
        }
        
        if (this.props.secondSelectedItem !== this.state.secondSelectedItem) {
            this.setState({ secondSelectedItem: this.props.secondSelectedItem });
            this.state.onChangeSecondItem(this.state.secondSelectedItem);
        }
        
        console.log(this.state)
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

export default Linha;