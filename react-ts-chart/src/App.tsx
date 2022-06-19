import React from 'react';
import './App.css';
import AreasEmpilhadas from './components/AreasEmpilhadas/AreasEmpilhadas';
import Boxplot from './components/Boxplot/Boxplot';
import Linha from './components/Linha/Linha';
import Pareto from './components/Pareto/Pareto';
import Dispersao from './components/Dispersao/Dispersao';
import Select from 'react-select';
import Histograma from './components/Histograma/Histograma';

interface IProps {

}

interface IState {
  data: any
}

class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.getValues = this.getValues.bind(this);
  }

  componentDidMount() {
    if (!this.state || !this.state.data || !this.state.data.length) {
      const apiUrl = 'http://localhost:3000/state/quantity?stateCode=31';
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          this.setState({ data: data });
        });
    }
  }

  getValues() {
    if (this.state && this.state.data && this.state.data.length) {
      return this.state.data.filter((d: any) => d.year === 2000 && d.product === 'Cana-de-açúcar').map((d: any) => d.quantity);
    }
    return []
  }

  render() {
    return (
      <div className="App">
        <Histograma width={window.innerWidth * 0.8} height={window.innerHeight * 0.9} values={this.getValues()} ano={2000}></Histograma>;
      </div>
    );
  }
}

export default App;
