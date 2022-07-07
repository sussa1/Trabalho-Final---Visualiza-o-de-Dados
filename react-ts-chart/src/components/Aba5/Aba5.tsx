import React from 'react';
import Dispersao from '../Dispersao/Dispersao';
import './Aba5.css';

interface IProps {

}

interface IState {
    dadosPib: any,
    dadosPibPerCapita: any,
    dadosDesmatamento: any,
    flagPerCapita: boolean,
    flagPib: boolean,
    flagDesmatamento: boolean
}

class Aba5 extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dadosPib: [],
            dadosPibPerCapita: [],
            dadosDesmatamento: [],
            flagPerCapita: false,
            flagPib: false,
            flagDesmatamento: false
        };
        this.getPIBData = this.getPIBData.bind(this);
        this.getDeflorestation = this.getDeflorestation.bind(this);
        this.getPibPerCapitaData = this.getPibPerCapitaData.bind(this);
        this.getGraphPibData = this.getGraphPibData.bind(this);
        this.getDesmatamentoData = this.getDesmatamentoData.bind(this);
    }

    getPIBData() {
        let apiUrl = 'correlation/pib';
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                let dadosPib: any = [];
                let dadosPibPerCapita: any = [];
                let id = 0;
                data.forEach((d: any) => {
                    dadosPib.push({
                        x: d.value,
                        y: d.pib,
                        ano: d.year,
                        label: 'Ano: ' + d.year + "<br>Estado: " + d.uf + "<br>Valor: " + Math.round(d.value * 10000) / 10000 + "<br>PIB: " + Math.round(d.pib * 10000) / 10000,
                        id: "v1" + id.toString()
                    });
                    dadosPibPerCapita.push({
                        x: d.value,
                        y: d.pib_per_capita,
                        ano: d.year,
                        label: 'Ano: ' + d.year + "<br>Estado: " + d.uf + "<br>Valor: " + Math.round(d.value * 10000) / 10000 + "<br>PIB per Capita: " + Math.round(d.pib_per_capita * 10000) / 10000,
                        id: "v2" + id.toString()
                    });
                    id++;
                });
                this.setState({ dadosPib: dadosPib, dadosPibPerCapita: dadosPibPerCapita, flagPerCapita: !this.state.flagPerCapita, flagPib: !this.state.flagPib });
            });
    }

    getDeflorestation() {
        let apiUrl = 'correlation/deflorestation';
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                let dadosDesmatamento: any = [];
                let id = 0;
                data.forEach((d: any) => {
                    dadosDesmatamento.push({
                        x: d.quantity,
                        y: d.destroyed,
                        ano: d.year,
                        label: 'Ano: ' + d.year + "<br>Município: " + d.city + "<br>Quantidade: " + Math.round(d.quantity * 10000) / 10000 + "<br>Área Desmatada: " + Math.round(d.destroyed * 10000) / 10000,
                        id: "v3" + id.toString()
                    });
                    id++;
                });
                this.setState({ dadosDesmatamento: dadosDesmatamento, flagDesmatamento: !this.state.flagDesmatamento });
            });
    }

    componentDidMount() {
        this.getPIBData();
        this.getDeflorestation();
    }

    getPibPerCapitaData() {
        return this.state.dadosPibPerCapita;
    }

    getGraphPibData() {
        return this.state.dadosPib;
    }

    getDesmatamentoData() {
        return this.state.dadosDesmatamento;
    }

    render() {
        return (
            <div className="graficos">
                <Dispersao minYear={2002} maxYear={2019} xlabel="Valor (mil reais)" ylabel="PIB per Capita" id="1" flag={this.state.flagPerCapita} width={window.innerHeight * 0.8} height={window.innerHeight * 0.8} data={this.getPibPerCapitaData()}></Dispersao>
                <Dispersao minYear={2002} maxYear={2019} xlabel="Valor (mil reais)" ylabel="PIB" id="2" flag={this.state.flagPib} width={window.innerHeight * 0.8} height={window.innerHeight * 0.8} data={this.getGraphPibData()}></Dispersao>
                <Dispersao minYear={2001} maxYear={2020} xlabel="Quantidade" ylabel="Área Desmatada (km²)" id="3" flag={this.state.flagDesmatamento} width={window.innerHeight * 0.8} height={window.innerHeight * 0.8} data={this.getDesmatamentoData()}></Dispersao>
            </div>
        )
    }
}

export default Aba5;
