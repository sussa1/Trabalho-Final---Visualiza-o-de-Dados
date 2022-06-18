import React from 'react';
import './App.css';
import AreasEmpilhadas from './components/AreasEmpilhadas/AreasEmpilhadas';
import Boxplot from './components/Boxplot/Boxplot';
import Linha from './components/Linha/Linha';
import Pareto from './components/Pareto/Pareto';
import Dispersao from './components/Dispersao/Dispersao';
import Select from 'react-select';

interface IProps {

}

interface IState {
  variable: string
}

class App extends React.Component<IProps, IState> {

  render() {
    return (
      <div className="App">
        <AreasEmpilhadas width={window.innerWidth * 0.8} height={window.innerHeight * 0.9}></AreasEmpilhadas>;
      </div>
    );
  }
}

export default App;
