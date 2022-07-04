import React from 'react';
import Select from 'react-select';
import Linha from '../Linha/Linha';
import './Aba3.css';

interface IProps {

}

interface IState {
    selectedVariable: string,
    selectedYear: number
}

class Aba3 extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedYear: 2019,
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
                        placeholder="Escolha o(s) produto(s)"
                        onChange={this.onChangeSelectElement}
                    /> </div>
                </div>
                <div className="graficos">
                    <div>
                        <Linha width={window.innerWidth * 0.9} height={window.innerHeight * 0.9} variavel={this.state.selectedVariable}></Linha>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Aba3;
