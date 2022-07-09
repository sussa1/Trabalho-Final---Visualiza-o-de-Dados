import React from 'react';
import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Aba1 from './components/Aba1/Aba1';
import Aba2 from './components/Aba2/Aba2';
import Aba3 from './components/Aba3/Aba3';
import Aba4 from './components/Aba4/Aba4';
import Aba5 from './components/Aba5/Aba5';

interface IProps {

}

interface IState {
}

class App extends React.Component<IProps, IState> {

  componentDidMount() {
    document.title = "Produção Agrícola";
  }

  render() {
    return (
      <div className="App">
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <img src="logo512.png" alt="Banner" height={window.innerHeight * 0.25} />
        </div>
        <Tabs>
          <TabList>
            <Tab>Dados do País</Tab>
            <Tab>Dados dos Estados</Tab>
            <Tab>Comparações</Tab>
            <Tab>Rankings</Tab>
            <Tab>Correlações</Tab>
          </TabList>

          <TabPanel>
            <div className='aba'>
              <Aba1></Aba1>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='aba'>
              <Aba2></Aba2>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='aba'>
              <Aba3></Aba3>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='aba'>
              <Aba4></Aba4>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='aba'>
              <Aba5></Aba5>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default App;
