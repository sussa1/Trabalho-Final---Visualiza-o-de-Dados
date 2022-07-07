import React from 'react';
import Select from 'react-select';
import Linha from '../Linha/Linha';
import './Aba3.css';

interface IProps {

}

interface IState {
    products: boolean,
    selectedVariable: string,
    selectedFirstItem: string,
    selectedSecondItem: string
}

class Aba3 extends React.Component<IProps, IState> {

    produtos = ['Abacate', 'Abacaxi', 'Alfafa fenada', 'Algodão arbóreo', 'Algodão herbáceo', 'Alho', 'Amendoim', 'Arroz', 'Aveia', 'Azeitona', 'Açaí', 'Banana', 'Batata-doce', 'Batata-inglesa', 'Borracha', 'Cacau', 'Café Arábica', 'Café Canephora', 'Café Total', 'Caju', 'Cana para forragem', 'Cana-de-açúcar', 'Caqui', 'Castanha de caju', 'Cebola', 'Centeio', 'Cevada', 'Chá-da-índia', 'Coco-da-baía', 'Dendê', 'Erva-mate', 'Ervilha', 'Fava', 'Feijão', 'Figo', 'Fumo', 'Girassol', 'Goiaba', 'Guaraná', 'Juta', 'Laranja', 'Limão', 'Linho', 'Malva', 'Mamona', 'Mamão', 'Mandioca', 'Manga', 'Maracujá', 'Marmelo', 'Maçã', 'Melancia', 'Melão', 'Milho', 'Noz', 'Palmito', 'Pera', 'Pimenta-do-reino', 'Pêssego', 'Rami', 'Sisal ou agave', 'Soja', 'Sorgo', 'Tangerina', 'Tomate', 'Trigo', 'Triticale', 'Tungue', 'Urucum', 'Uva'];

    constructor(props: IProps) {
        super(props);
        this.state = {
            products: true,
            selectedVariable: "value",
            selectedFirstItem: "",
            selectedSecondItem: "",
        };
        this.onChangeSelectFirstElement = this.onChangeSelectFirstElement.bind(this);
        this.onChangeSelectSecondElement = this.onChangeSelectSecondElement.bind(this);
        this.getSelectElements = this.getSelectElements.bind(this);
    }

    getSelectElements() {
        return this.produtos.map((d: any) => {
            return {
                value: d,
                label: d
            };
        });
    }

    getMinYear() {
        if (this.state.selectedVariable === 'lostArea' || this.state.selectedVariable === 'plantedArea') {
            return 1988;
        }
        return 1974;
    }

    onChangeSelectFirstElement(d: any) {
        let selectedOption = d.value;
        if (!selectedOption) {
            selectedOption = '';
        }
        this.setState({ selectedFirstItem: selectedOption });
    }

    onChangeSelectSecondElement(d: any) {
        let selectedOption: string = d.value;
        if (!selectedOption) {
            selectedOption = '';
        }
        this.setState({ selectedSecondItem: selectedOption });
    }

    render() {
        return (
            <div>
                <div className="inputs" style={{display: "flex"}}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "30%" }}> {this.state.products? "Produto 1:" : "Estado 1"} <Select
                        name="products1"
                        options={this.state == null ? [] : this.getSelectElements()}
                        className="basic-select-1"
                        classNamePrefix="select"
                        placeholder="Escolha o produto"
                        onChange={this.onChangeSelectFirstElement}
                    /> </div>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "30%" }}> {this.state.products? "Produto 2:" : "Estado 2"} <Select
                        name="products2"
                        options={this.state == null ? [] : this.getSelectElements()}
                        className="basic-select-2"
                        classNamePrefix="select"
                        placeholder="Escolha o produto"
                        onChange={this.onChangeSelectSecondElement}
                    /> </div>
                </div>
                <div className="graficos">
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Valor </h3>
                        <Linha id="1" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='value' products={true} firstSelectedItem={this.state.selectedFirstItem} secondSelectedItem={this.state.selectedSecondItem}></Linha>
                    </div>
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Quantidade </h3>
                        <Linha id="2" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='quantity' products={true} firstSelectedItem={this.state.selectedFirstItem} secondSelectedItem={this.state.selectedSecondItem}></Linha>
                    </div>
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Área Plantada </h3>
                        <Linha id="3" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='plantedArea' products={true} firstSelectedItem={this.state.selectedFirstItem} secondSelectedItem={this.state.selectedSecondItem}></Linha>
                    </div>
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Área Perdida </h3>
                        <Linha id="4" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='lostArea' products={true} firstSelectedItem={this.state.selectedFirstItem} secondSelectedItem={this.state.selectedSecondItem}></Linha>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Aba3;
