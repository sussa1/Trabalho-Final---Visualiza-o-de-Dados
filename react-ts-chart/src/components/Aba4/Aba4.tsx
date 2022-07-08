import React from 'react';
import BarrasHorizontais from '../BarrasHorizontais/BarrasHorizontais';
import Select from 'react-select';
import './Aba4.css';
import RangeSlider from 'react-bootstrap-range-slider';
import BumpChart from '../BumpChart/BumpChart';

interface IProps {

}

interface IState {
    selectedVariable: string,
    selectedYear: number
}

class Aba4 extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedYear: 2020,
            selectedVariable: "value"
        };
        this.onChangeSelectElement = this.onChangeSelectElement.bind(this);
        this.getSelectElements = this.getSelectElements.bind(this);
    }

    getSelectElements() {
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

    getSelectedVariableText() {
        if (this.state.selectedVariable === "value") {
            return "Valor";
        } else if (this.state.selectedVariable === "quantity") {
            return "Quantidade";
        } else if (this.state.selectedVariable === "plantedArea") {
            return "Área Plantada";
        } else if (this.state.selectedVariable === "lostArea") {
            return "Área Perdida";
        } else if (this.state.selectedVariable === "harvestedArea") {
            return "Área Colhida";
        }
    }

    getMinYear() {
        if (this.state.selectedVariable === 'lostArea' || this.state.selectedVariable === 'plantedArea') {
            return 1988;
        }
        return 1974;
    }

    onChangeSelectElement(d: any) {
        let selectedOption = d.value;
        if (!selectedOption) {
            selectedOption = 'value';
        }
        if ((selectedOption === 'lostArea' || selectedOption === 'plantedArea') && this.state.selectedYear < 1988) {
            this.setState({ selectedYear: 1988, selectedVariable: selectedOption });
        } else {
            this.setState({ selectedVariable: selectedOption });
        }
    }

    render() {
        return (
            <div>
                <div className="inputs">
                    <div style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center" }}> Variável: <Select
                        name="variables"
                        options={this.state == null ? [] : this.getSelectElements()}
                        defaultValue={this.getSelectElements()[0]}
                        className="variables"
                        classNamePrefix="select"
                        placeholder="Escolha o produto"
                        onChange={this.onChangeSelectElement}
                    /> </div>
                </div>
                <div className="graficos">
                    <div style={{ width: "100vw", height: "70vh" }}>
                        <h3 className="titulo-grafico">{this.getSelectedVariableText()} por Estado</h3>
                        <BumpChart id="3" width={window.innerWidth * 0.98} height={window.innerHeight * 0.67} variable={this.state.selectedVariable}></BumpChart>
                    </div>
                <div/>

                <div className='inputs' style={{width: '100%'}}>
                    <div style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center" }}> Ano: <RangeSlider
                        className='years'
                        min={this.getMinYear()}
                        max={2020}
                        value={this.state.selectedYear}
                        onChange={changeEvent => this.setState({ selectedYear: parseFloat(changeEvent.target.value) })}
                    /></div>
                </div>
                <div className='graficos'>
                    <div style={{ width: "48vw", height: "80vh" }}>
                        <h3 className="titulo-grafico">{this.getSelectedVariableText()} em {this.state.selectedYear} por Estado</h3>
                        <BarrasHorizontais id="1" width={window.innerWidth * 0.48} height={window.innerHeight * 0.77} city={false} variable={this.state.selectedVariable} year={this.state.selectedYear}></BarrasHorizontais>
                    </div>
                    <div style={{ width: "48vw", height: "80vh" }}>
                        <h3 className="titulo-grafico">{this.getSelectedVariableText()} em {this.state.selectedYear} por Município</h3>
                        <BarrasHorizontais id="2" width={window.innerWidth * 0.48} height={window.innerHeight * 0.77} city={true} variable={this.state.selectedVariable} year={this.state.selectedYear}></BarrasHorizontais>
                    </div>
                </div>

                </div>
            </div>
        )
    }
}

export default Aba4;
