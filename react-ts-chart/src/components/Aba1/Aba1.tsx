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

    produtos = ['Abacate', 'Abacaxi', 'Alfafa fenada', 'Algodão arbóreo', 'Algodão herbáceo', 'Alho', 'Amendoim', 'Arroz', 'Aveia', 'Azeitona', 'Açaí', 'Banana', 'Batata-doce', 'Batata-inglesa', 'Borracha', 'Cacau', 'Café Arábica', 'Café Canephora', 'Café Total', 'Caju', 'Cana para forragem', 'Cana-de-açúcar', 'Caqui', 'Castanha de caju', 'Cebola', 'Centeio', 'Cevada', 'Chá-da-índia', 'Coco-da-baía', 'Dendê', 'Erva-mate', 'Ervilha', 'Fava', 'Feijão', 'Figo', 'Fumo', 'Girassol', 'Goiaba', 'Guaraná', 'Juta', 'Laranja', 'Limão', 'Linho', 'Malva', 'Mamona', 'Mamão', 'Mandioca', 'Manga', 'Maracujá', 'Marmelo', 'Maçã', 'Melancia', 'Melão', 'Milho', 'Noz', 'Palmito', 'Pera', 'Pimenta-do-reino', 'Pêssego', 'Rami', 'Sisal ou agave', 'Soja', 'Sorgo', 'Tangerina', 'Tomate', 'Trigo', 'Triticale', 'Tungue', 'Urucum', 'Uva'];

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
            produtosSelecionados: this.produtos,
            boxplotData: []
        };
        this.onChangeProductSelect = this.onChangeProductSelect.bind(this);
        this.getSelectElements = this.getSelectElements.bind(this);
    }

    componentDidMount() {
        let apiUrl = 'boxplot/lostArea';
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                this.setState({ boxplotData: data.map((d: any) => { d.state = this.mapaCodigoEstado[d.stateCode]; return d }) });
            });
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
                        <h3 className="titulo-grafico">Valor - País</h3>
                        <AreasEmpilhadas id="1" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='value' produtosSelecionados={this.state.produtosSelecionados} estado='' pais={true}></AreasEmpilhadas>
                    </div>
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Quantidade - País</h3>
                        <AreasEmpilhadas id="2" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='quantity' produtosSelecionados={this.state.produtosSelecionados} estado='' pais={true}></AreasEmpilhadas>
                    </div>
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Área Plantada - País</h3>
                        <AreasEmpilhadas id="3" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='plantedArea' produtosSelecionados={this.state.produtosSelecionados} estado='' pais={true}></AreasEmpilhadas>
                    </div>
                    <div style={{ width: "47vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Área Perdida - País</h3>
                        <AreasEmpilhadas id="4" width={window.innerWidth * 0.47} height={window.innerHeight * 0.47} variable='lostArea' produtosSelecionados={this.state.produtosSelecionados} estado='' pais={true}></AreasEmpilhadas>
                    </div>
                    <div style={{ width: "100vw", height: "52vh" }}>
                        <h3 className="titulo-grafico">Área Perdida por Estado</h3>
                        <Boxplot width={window.innerWidth * 0.98} height={window.innerHeight * 0.47} onChangeHistogram={() => { }} data={this.state.boxplotData} domain={Array.from(Object.values(this.mapaCodigoEstado))} id="5" variable="lostArea" grouperKey="state"></Boxplot>
                    </div>

                </div>
            </div>
        )
    }
}

export default Aba1;
