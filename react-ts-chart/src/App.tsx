import React from 'react';
import './App.css';
import AreasEmpilhadas from './components/AreasEmpilhadas/AreasEmpilhadas';
import Boxplot from './components/Boxplot/Boxplot';

interface IProps {

}

interface IState {

}

class App extends React.Component<IProps, IState> {

  render() {
    return (
      <div className="App">
        <Boxplot width={window.innerWidth * 0.5} height={window.innerHeight * 0.5} data={null}></Boxplot>
      </div>
    );
  }
}

export default App;
