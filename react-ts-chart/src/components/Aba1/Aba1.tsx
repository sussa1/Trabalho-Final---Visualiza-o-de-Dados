import React from 'react';
import Select from 'react-select';
import AreasEmpilhadas from '../AreasEmpilhadas/AreasEmpilhadas';
import Boxplot from '../Boxplot/Boxplot';
import './Aba1.css';

interface IProps {

}

interface IState {
    produtosSelecionados: string[],
    boxplotData: any
}

class Aba1 extends React.Component<IProps, IState> {

    produtos = ['Abacate', 'Abacaxi', 'Alfafa fenada', 'Algodão arbóreo', 'Algodão herbáceo', 'Alho', 'Amendoim', 'Arroz', 'Aveia', 'Azeitona', 'Açaí', 'Banana', 'Batata-doce', 'Batata-inglesa', 'Borracha', 'Cacau', 'Café  Arábica', 'Café  Canephora', 'Café  Total', 'Caju', 'Cana para forragem', 'Cana-de-açúcar', 'Caqui', 'Castanha de caju', 'Cebola', 'Centeio', 'Cevada', 'Chá-da-índia', 'Coco-da-baía', 'Dendê', 'Erva-mate', 'Ervilha', 'Fava', 'Feijão', 'Figo', 'Fumo', 'Girassol', 'Goiaba', 'Guaraná', 'Juta', 'Laranja', 'Limão', 'Linho', 'Malva', 'Mamona', 'Mamão', 'Mandioca', 'Manga', 'Maracujá', 'Marmelo', 'Maçã', 'Melancia', 'Melão', 'Milho', 'Noz', 'Palmito', 'Pera', 'Pimenta-do-reino', 'Pêssego', 'Rami', 'Sisal ou agave', 'Soja', 'Sorgo', 'Tangerina', 'Tomate', 'Trigo', 'Triticale', 'Tungue', 'Urucum', 'Uva'];

    constructor(props: IProps) {
        super(props);
        this.state = {
            produtosSelecionados: this.produtos,
            boxplotData: []
        };
        this.onChangeProductSelect = this.onChangeProductSelect.bind(this);
        this.getSelectElements = this.getSelectElements.bind(this);
    }

    componentDidMount() {

    }

    onChangeProductSelect(v: any, action: any) {
        if (action.action === 'create-option') {
            return;
        }
        if (!v || v.length === 0) {
            this.setState({ produtosSelecionados: this.produtos });
        } else {
            this.setState({ produtosSelecionados: v.map((valor: any) => valor.value) });
        }
    }

    getSelectElements() {
        return this.produtos.map((d: any) => {
            return {
                value: d,
                label: d
            };
        });
    }

    render() {
        return (
            <div>
                <div className="selects">
                    <Select
                        isMulti
                        name="products"
                        options={this.state == null ? [] : this.getSelectElements()}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Escolha o(s) produto(s)"
                        onChange={this.onChangeProductSelect}
                    />
                </div>
                <div className="graficos">
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Valor (Mil Reais) - País</h3>
                        <AreasEmpilhadas id="1" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='value' produtosSelecionados={this.state.produtosSelecionados} estado='' pais={true}></AreasEmpilhadas>
                    </div>
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Quantidade (Toneladas) - País</h3>
                        <AreasEmpilhadas id="2" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='quantity' produtosSelecionados={this.state.produtosSelecionados} estado='' pais={true}></AreasEmpilhadas>
                    </div>
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Área Plantada (Hectares) - País</h3>
                        <AreasEmpilhadas id="3" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='plantedArea' produtosSelecionados={this.state.produtosSelecionados} estado='' pais={true}></AreasEmpilhadas>
                    </div>
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Área Perdida (Hectares) - País</h3>
                        <AreasEmpilhadas id="4" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='lostArea' produtosSelecionados={this.state.produtosSelecionados} estado='' pais={true}></AreasEmpilhadas>
                    </div>
                </div>
            </div>
        )
    }
}

export default Aba1;
