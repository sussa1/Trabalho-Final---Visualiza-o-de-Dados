import React from 'react';
import './App.css';
import AreasEmpilhadas from './components/AreasEmpilhadas/AreasEmpilhadas';
import Boxplot from './components/Boxplot/Boxplot';
import Linha from './components/Linha/Linha';
import Pareto from './components/Pareto/Pareto';
import Dispersao from './components/Dispersao/Dispersao';
import Select from 'react-select';
import Histograma from './components/Histograma/Histograma';
import BarrasHorizontais from './components/BarrasHorizontais/BarrasHorizontais';
import Mapa from './components/Mapa/Mapa';

interface IProps {

}

interface IState {
  produtosSelecionados: string[],
  variable: string,
  estado: string
}

class App extends React.Component<IProps, IState> {

  produtos = ['Abacate', 'Abacaxi', 'Alfafa fenada', 'Algodão arbóreo', 'Algodão herbáceo', 'Alho', 'Amendoim', 'Arroz', 'Aveia', 'Azeitona', 'Açaí', 'Banana', 'Batata-doce', 'Batata-inglesa', 'Borracha', 'Cacau', 'Café Arábica', 'Café Canephora', 'Café Total', 'Caju', 'Cana para forragem', 'Cana-de-açúcar', 'Caqui', 'Castanha de caju', 'Cebola', 'Centeio', 'Cevada', 'Chá-da-índia', 'Coco-da-baía', 'Dendê', 'Erva-mate', 'Ervilha', 'Fava', 'Feijão', 'Figo', 'Fumo', 'Girassol', 'Goiaba', 'Guaraná', 'Juta', 'Laranja', 'Limão', 'Linho', 'Malva', 'Mamona', 'Mamão', 'Mandioca', 'Manga', 'Maracujá', 'Marmelo', 'Maçã', 'Melancia', 'Melão', 'Milho', 'Noz', 'Palmito', 'Pera', 'Pimenta-do-reino', 'Pêssego', 'Rami', 'Sisal ou agave', 'Soja', 'Sorgo', 'Tangerina', 'Tomate', 'Trigo', 'Triticale', 'Tungue', 'Urucum', 'Uva'];

  constructor(props: IProps) {
    super(props);
    this.state = {
      variable: 'value',
      estado: '',
      produtosSelecionados: this.produtos
    };
    this.onChangeVariableSelect = this.onChangeVariableSelect.bind(this);
    this.onChangeProductSelect = this.onChangeProductSelect.bind(this);
    this.getSelectElements = this.getSelectElements.bind(this);
    this.getVariableSelectElements = this.getVariableSelectElements.bind(this);
  }


  onChangeVariableSelect(v: any, action: any) {
    if (action.action === 'create-option') {
      return;
    }
    if (!v) {
      this.setState({ variable: 'value' });
    } else {
      this.setState({ variable: v.value });
    }
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

  getVariableSelectElements() {
    return [
      { value: 'value', label: 'Valor' },
      { value: 'quantity', label: 'Quantidade' },
      { value: 'plantedArea', label: 'Área Plantada' },
      { value: 'harvestedArea', label: 'Área Colhida' },
      { value: 'lostArea', label: 'Área Perdida' }
    ]
  }

  escolherEstado(estado: any) {
    this.setState({ estado: estado });
  }

  render() {
    return (
      <div className="App">
        <div className="selects">

          <Select
            name="variable"
            options={this.getVariableSelectElements()}
            defaultValue={this.getVariableSelectElements()[0]}
            className="basic-select"
            classNamePrefix="select"
            id="variableSelect"
            placeholder="Escolha a variável"
            onChange={this.onChangeVariableSelect}
          />
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
          <Mapa width={window.innerWidth * 0.3} height={window.innerHeight * 0.85} estadoCallBack={(state: any) => this.escolherEstado(state)}></Mapa>
          <AreasEmpilhadas width={window.innerWidth * 0.7} height={window.innerHeight * 0.85} variable={this.state.variable} produtosSelecionados={this.state.produtosSelecionados} estado={this.state.estado}></AreasEmpilhadas>
        </div>
      </div >
    );
  }
}

export default App;
