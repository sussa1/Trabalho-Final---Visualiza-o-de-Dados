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
  estado: string
}

class App extends React.Component<IProps, IState> {

  produtos = ['Abacate', 'Abacaxi', 'Alfafa fenada', 'Algodão arbóreo', 'Algodão herbáceo', 'Alho', 'Amendoim', 'Arroz', 'Aveia', 'Azeitona', 'Açaí', 'Banana', 'Batata-doce', 'Batata-inglesa', 'Borracha', 'Cacau', 'Café Arábica', 'Café Canephora', 'Café Total', 'Caju', 'Cana para forragem', 'Cana-de-açúcar', 'Caqui', 'Castanha de caju', 'Cebola', 'Centeio', 'Cevada', 'Chá-da-índia', 'Coco-da-baía', 'Dendê', 'Erva-mate', 'Ervilha', 'Fava', 'Feijão', 'Figo', 'Fumo', 'Girassol', 'Goiaba', 'Guaraná', 'Juta', 'Laranja', 'Limão', 'Linho', 'Malva', 'Mamona', 'Mamão', 'Mandioca', 'Manga', 'Maracujá', 'Marmelo', 'Maçã', 'Melancia', 'Melão', 'Milho', 'Noz', 'Palmito', 'Pera', 'Pimenta-do-reino', 'Pêssego', 'Rami', 'Sisal ou agave', 'Soja', 'Sorgo', 'Tangerina', 'Tomate', 'Trigo', 'Triticale', 'Tungue', 'Urucum', 'Uva'];

  constructor(props: IProps) {
    super(props);
    this.state = {
      estado: '',
      produtosSelecionados: this.produtos
    };
    this.onChangeProductSelect = this.onChangeProductSelect.bind(this);
    this.getSelectElements = this.getSelectElements.bind(this);
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

  escolherEstado(estado: any) {
    this.setState({ estado: estado }, () => this.doScrolling(window.innerHeight * 0.9, 500));
  }


  doScrolling(elementY: any, duration: any) {
    const startingY = window.pageYOffset
    const diff = elementY - startingY
    let start: any = undefined;

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp
      // Elapsed milliseconds since start of scrolling.
      const time = timestamp - start
      // Get percent of completion in range [0, 1].
      const percent = Math.min(time / duration, 1)

      window.scrollTo(0, startingY + diff * percent)

      // Proceed with animation as long as we wanted it to.
      if (time < duration) {
        window.requestAnimationFrame(step)
      }
    })
  }

  render() {
    return (
      <div className="App">
        <div>
          <Mapa width={window.innerWidth * 0.9} height={window.innerHeight * 0.9} estadoCallBack={(state: any) => this.escolherEstado(state)}></Mapa>
        </div>
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
          <AreasEmpilhadas id="1" width={window.innerWidth * 0.49} height={window.innerHeight * 0.85} variable='value' produtosSelecionados={this.state.produtosSelecionados} estado={this.state.estado}></AreasEmpilhadas>
          <AreasEmpilhadas id="2" width={window.innerWidth * 0.49} height={window.innerHeight * 0.85} variable='quantity' produtosSelecionados={this.state.produtosSelecionados} estado={this.state.estado}></AreasEmpilhadas>
          <AreasEmpilhadas id="3" width={window.innerWidth * 0.49} height={window.innerHeight * 0.85} variable='plantedArea' produtosSelecionados={this.state.produtosSelecionados} estado={this.state.estado}></AreasEmpilhadas>
          <AreasEmpilhadas id="4" width={window.innerWidth * 0.49} height={window.innerHeight * 0.85} variable='lostArea' produtosSelecionados={this.state.produtosSelecionados} estado={this.state.estado}></AreasEmpilhadas>
          <Pareto width={window.innerWidth * 0.49} height={window.innerHeight * 0.85} variavel='value'></Pareto>
          <Pareto width={window.innerWidth * 0.49} height={window.innerHeight * 0.85} variavel='quantity'></Pareto>
        </div>
      </div >
    );
  }
}

export default App;
