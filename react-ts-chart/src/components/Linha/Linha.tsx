import React from 'react';
import * as d3 from 'd3';
import './Linha.css'
import Select from 'react-select';

interface IProps {
    width: number,
    height: number,
    products: boolean,
    id: string,
}

interface IState {
    firstData: any[],
    secondData: any[],
    firstSelectedItem: string,
    secondSelectedItem: string,
    onChangeFirstItem: any,
    onChangeSecondItem: any,
    onChangeVariable: any,
    variavel: any
}

class Linha extends React.Component<IProps, IState> {
    ref!: SVGSVGElement;
    produtos = ['Abacate', 'Abacaxi', 'Alfafa fenada', 'Algodão arbóreo', 'Algodão herbáceo', 'Alho', 'Amendoim', 'Arroz', 'Aveia', 'Azeitona', 'Açaí', 'Banana', 'Batata-doce', 'Batata-inglesa', 'Borracha', 'Cacau', 'Café  Arábica', 'Café  Canephora', 'Café  Total', 'Caju', 'Cana para forragem', 'Cana-de-açúcar', 'Caqui', 'Castanha de caju', 'Cebola', 'Centeio', 'Cevada', 'Chá-da-índia', 'Coco-da-baía', 'Dendê', 'Erva-mate', 'Ervilha', 'Fava', 'Feijão', 'Figo', 'Fumo', 'Girassol', 'Goiaba', 'Guaraná', 'Juta', 'Laranja', 'Limão', 'Linho', 'Malva', 'Mamona', 'Mamão', 'Mandioca', 'Manga', 'Maracujá', 'Marmelo', 'Maçã', 'Melancia', 'Melão', 'Milho', 'Noz', 'Palmito', 'Pera', 'Pimenta-do-reino', 'Pêssego', 'Rami', 'Sisal ou agave', 'Soja', 'Sorgo', 'Tangerina', 'Tomate', 'Trigo', 'Triticale', 'Tungue', 'Urucum', 'Uva'];
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
            firstData: [],
            secondData: [],
            firstSelectedItem: this.props.products ? 'Abacate' : '11',
            secondSelectedItem: this.props.products ? 'Abacaxi' : '12',
            onChangeFirstItem: null,
            onChangeSecondItem: null,
            onChangeVariable: null,
            variavel: 'value'
        };
        this.buildGraph = this.buildGraph.bind(this);
        this.onChangeSelectFirstElement = this.onChangeSelectFirstElement.bind(this);
        this.onChangeSelectSecondElement = this.onChangeSelectSecondElement.bind(this);
        this.getSelectElements = this.getSelectElements.bind(this);
        this.getVariableSelectElements = this.getVariableSelectElements.bind(this);
        this.onChangeVariableSelectElement = this.onChangeVariableSelectElement.bind(this);
    }


    private buildGraph() {

        d3.select(this.ref)
            .html("");
        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 250, bottom: 30, left: 80 };
        const width: number = this.props.width - margin.left - margin.right;
        const height: number = this.props.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select(this.ref)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        // List of groups (here I have one group per column)
        const products = ['Abacate', 'Abacaxi', 'Alfafa fenada', 'Algodão arbóreo', 'Algodão herbáceo', 'Alho', 'Amendoim', 'Arroz', 'Aveia', 'Azeitona', 'Açaí', 'Banana', 'Batata-doce', 'Batata-inglesa', 'Borracha', 'Cacau', 'Café  Arábica', 'Café  Canephora', 'Café  Total', 'Caju', 'Cana para forragem', 'Cana-de-açúcar', 'Caqui', 'Castanha de caju', 'Cebola', 'Centeio', 'Cevada', 'Chá-da-índia', 'Coco-da-baía', 'Dendê', 'Erva-mate', 'Ervilha', 'Fava', 'Feijão', 'Figo', 'Fumo', 'Girassol', 'Goiaba', 'Guaraná', 'Juta', 'Laranja', 'Limão', 'Linho', 'Malva', 'Mamona', 'Mamão', 'Mandioca', 'Manga', 'Maracujá', 'Marmelo', 'Maçã', 'Melancia', 'Melão', 'Milho', 'Noz', 'Palmito', 'Pera', 'Pimenta-do-reino', 'Pêssego', 'Rami', 'Sisal ou agave', 'Soja', 'Sorgo', 'Tangerina', 'Tomate', 'Trigo', 'Triticale', 'Tungue', 'Urucum', 'Uva'];

        var hoverData: any = [];

        var hoverDataSecond: any = [];

        // Add X axis --> it is a date format
        const x = d3.scaleLinear()
            .range([0, width]);
        let xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`);

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 5000000])
            .range([height, 0]);
        let yAxis = svg.append("g");

        // A color scale: one color for each group
        const myColor = d3.scaleOrdinal(d3.schemeCategory10);

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
        var bisect = d3.bisector(function (d: any) { return d[0]; }).left;

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

        let circulo1 = svg.append("circle").attr("cx", 40).attr("cy", 20).attr("r", 6).style("opacity", "0")
        let circulo2 = svg.append("circle").attr("cx", 40).attr("cy", 50).attr("r", 6).style("opacity", "0")
        let txt1 = svg.append("text").attr("x", 60).attr("y", 20).style("font-size", "15px").attr("alignment-baseline", "middle")
        let txt2 = svg.append("text").attr("x", 60).attr("y", 50).style("font-size", "15px").attr("alignment-baseline", "middle")


        const update = () => {
            if (!this.state.firstData || !this.state.firstData.length) {
                return;
            }
            let filteredData: any = [];
            let secondFilteredData: any = [];
            let maior = 0;
            let minYear = Infinity;
            let maxYear = 0;
            this.state.firstData.forEach(instance => {
                filteredData.push([instance.year, instance[this.state.variavel]]);
                maior = Math.max(maior, instance[this.state.variavel]);
                minYear = Math.min(minYear, instance.year);
                maxYear = Math.max(maxYear, instance.year);
            });

            this.state.secondData.forEach(instance => {
                secondFilteredData.push([instance.year, instance[this.state.variavel]]);
                maior = Math.max(maior, instance[this.state.variavel]);
                minYear = Math.min(minYear, instance.year);
                maxYear = Math.max(maxYear, instance.year);
            });

            console.log(filteredData);
            console.log(secondFilteredData);

            x.domain([minYear - 1, maxYear + 1]);
            xAxis.transition().duration(500).call(d3.axisBottom(x).tickFormat(d3.format("d")));
            y.domain([0, maior]);
            yAxis.transition().duration(500).call(d3.axisLeft(y));

            let color1 = myColor(String(Math.random() % 5));
            let color2 = myColor(String(5 + Math.random() % 5));
            console.log(color1);

            line
                .datum(filteredData)
                .transition()
                .duration(500)
                .attr("d", d3.line()
                    .x(function (d) { return x(+d[0]); })
                    .y(function (d) { return y(+d[1]); })
                )
                .attr("stroke", (d: any) => { return color1 })

            hoverData = filteredData.slice();

            secondLine
                .datum(secondFilteredData)
                .transition()
                .duration(500)
                .attr("d", d3.line()
                    .x(function (d) { return x(+d[0]); })
                    .y(function (d) { return y(+d[1]); })
                )
                .attr("stroke", (d: any) => { return color2 })

            hoverDataSecond = secondFilteredData.slice();

            circulo1.style("fill", color1).style("opacity", "1");
            circulo2.style("fill", color2).style("opacity", "1");
            txt1.text(this.props.products ? this.state.firstSelectedItem : this.mapaCodigoEstado[this.state.firstSelectedItem]);
            txt2.text(this.props.products ? this.state.secondSelectedItem : this.mapaCodigoEstado[this.state.secondSelectedItem]);
        }

        const getUpdateData = () => {
            let apiUrl = '';
            if (this.props.products) {
                apiUrl = 'http://localhost:5000/product/' + this.state.variavel + '?product=' + this.state.firstSelectedItem;
            } else {
                apiUrl = 'http://localhost:5000/stateTotal/' + this.state.variavel + '?state=' + this.state.firstSelectedItem;
            }
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({ firstData: data }, update);
                })
        }

        const getSecondUpdateData = () => {
            let apiUrl = '';
            if (this.props.products) {
                apiUrl = 'http://localhost:5000/product/' + this.state.variavel + '?product=' + this.state.secondSelectedItem;
            } else {
                apiUrl = 'http://localhost:5000/stateTotal/' + this.state.variavel + '?state=' + this.state.secondSelectedItem;
            }
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({ secondData: data }, update);
                })
        }

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mousemove', (e) => { mousemove(d3.pointer(e)) })
            .on('mouseout', mouseout);

        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseover() {
            if (hoverData.length > 0 && hoverData[0][0] && hoverData[0][1]) {
                focus.style("opacity", 1)
                focusText.style("opacity", 1)
            }
            if (hoverDataSecond.length > 0 && hoverDataSecond[0][0] && hoverDataSecond[0][1]) {
                focusSecond.style("opacity", 1)
                focusTextSecond.style("opacity", 1)
            }
        }

        function mousemove(e: any) {
            // recover coordinate we need
            var x0 = Math.round(x.invert(e[0]));

            var i = bisect(hoverData, x0, 0);
            var selectedData = hoverData[i];

            var i2 = bisect(hoverDataSecond, x0, 0);
            var selectedDataSecond = hoverDataSecond[i2];
            console.log(i2, hoverDataSecond);

            let ignoreFirst = false;
            let ignoreSecond = false;

            if (selectedData[0] < selectedDataSecond[0]) {
                ignoreSecond = true;
            }

            if (selectedDataSecond[0] < selectedData[0]) {
                ignoreFirst = true;
            }

            if (ignoreFirst) {
                focus.style("opacity", 0)
                focusText.style("opacity", 0)
            } else {
                focus.style("opacity", 1)
                focusText.style("opacity", 1)
            }

            if (ignoreSecond) {
                focusSecond.style("opacity", 0)
                focusTextSecond.style("opacity", 0)
            } else {
                focusSecond.style("opacity", 1)
                focusTextSecond.style("opacity", 1)
            }

            if (selectedData && !ignoreFirst) focus
                .attr("cx", x(selectedData[0]))
                .attr("cy", y(selectedData[1]))
            if (selectedData && !ignoreFirst) focusText
                .html("Ano:" + selectedData[0] + ", Valor:" + Math.round(selectedData[1] * 10000) / 10000)
                .attr("x", x(selectedData[0]) + 5)
                .attr("y", y(selectedData[1]))


            if (selectedDataSecond && !ignoreSecond) focusSecond
                .attr("cx", x(selectedDataSecond[0]))
                .attr("cy", y(selectedDataSecond[1]))
            if (selectedDataSecond && !ignoreSecond) focusTextSecond
                .html("Ano:" + selectedDataSecond[0] + ", Valor:" + Math.round(selectedDataSecond[1] * 10000) / 10000)
                .attr("x", x(selectedDataSecond[0]) + 5)
                .attr("y", y(selectedDataSecond[1]))
        }

        function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)

            focusSecond.style("opacity", 0)
            focusTextSecond.style("opacity", 0)
        }

        getUpdateData();
        getSecondUpdateData();

        this.setState({
            onChangeFirstItem: (v: any) => {
                getUpdateData();
            },
            onChangeSecondItem: (v: any) => {
                getSecondUpdateData();
            },
            onChangeVariable: (v: any) => {
                getUpdateData();
                getSecondUpdateData();
            }
        });

    }

    componentDidMount() {
        this.buildGraph();
    }

    getSelectElements() {
        if (this.props.products) {
            return this.produtos.map((d: any) => {
                return {
                    value: d,
                    label: d
                };
            });
        }
        return Object.keys(this.mapaCodigoEstado).map((d: any) => {
            return {
                value: d,
                label: this.mapaCodigoEstado[d]
            };
        });
    }

    onChangeSelectFirstElement(d: any) {
        let selectedOption = d.value;
        if (!selectedOption) {
            selectedOption = '';
        }
        this.setState({ firstSelectedItem: selectedOption }, this.state.onChangeFirstItem);
    }

    onChangeSelectSecondElement(d: any) {
        let selectedOption: string = d.value;
        if (!selectedOption) {
            selectedOption = '';
        }
        this.setState({ secondSelectedItem: selectedOption }, this.state.onChangeSecondItem);
    }

    getVariableSelectElements() {
        return [
            {
                value: "value", label: "Valor"
            },
            {
                value: "quantity", label: "Quantidade"
            },
            {
                value: "plantedArea", label: "Área Plantada"
            },
            {
                value: "lostArea", label: "Área Perdida"
            },
            {
                value: "harvestedArea", label: "Área Colhida"
            },
        ];
    }

    onChangeVariableSelectElement(d: any) {
        let selectedOption = d.value;
        if (!selectedOption) {
            selectedOption = 'value';
        }
        this.setState({ variavel: selectedOption }, this.state.onChangeVariable);
    }

    render() {
        return (
            <div>
                <div style={{ marginLeft: '15px', marginRight: '15px' }}>
                    <div>
                        <div style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center" }}> Variável: <Select
                            name="variables"
                            options={this.state == null ? [] : this.getVariableSelectElements()}
                            defaultValue={this.getVariableSelectElements()[0]}
                            className="variables"
                            classNamePrefix="select"
                            placeholder="Escolha o produto"
                            onChange={this.onChangeVariableSelectElement}
                        /> </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "50%" }}> {this.props.products ? "Produto 1" : "Estado 1"}: <Select
                            name="products1"
                            options={this.state == null ? [] : this.getSelectElements()}
                            defaultValue={this.getSelectElements()[0]}
                            className="variables"
                            classNamePrefix="select"
                            placeholder="Escolha o produto"
                            onChange={this.onChangeSelectFirstElement}
                        /> </div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "50%" }}> {this.props.products ? "Produto 2" : "Estado 2"}: <Select
                            name="products2"
                            options={this.state == null ? [] : this.getSelectElements()}
                            defaultValue={this.getSelectElements()[1]}
                            className="variables"
                            classNamePrefix="select"
                            placeholder="Escolha o produto"
                            onChange={this.onChangeSelectSecondElement}
                        /> </div>
                    </div>
                </div>
                <div className="svg" >
                    <svg className="container-linha" ref={(ref: SVGSVGElement) => this.ref = ref} width='100' height='100'></svg>
                </div>
                <div className="tooltip-container">
                    <div className="tooltip"></div>
                </div>
            </div>
        );
    }
}

export default Linha;