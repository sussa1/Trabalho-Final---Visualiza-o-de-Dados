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

  render() {
    return (
      <div className="App">
        <Tabs>
          <TabList>
            <Tab>Dados do País</Tab>
            <Tab>Dados dos Estados</Tab>
            <Tab>Comparações</Tab>
            <Tab>Rankings</Tab>
            <Tab>Correlações</Tab>
          </TabList>

          <TabPanel>
            <Aba1></Aba1>
          </TabPanel>
          <TabPanel>
            <Aba2></Aba2>
          </TabPanel>
          <TabPanel>
            <Aba3></Aba3>
          </TabPanel>
          <TabPanel>
            <Aba4></Aba4>
          </TabPanel>
          <TabPanel>
            <Aba5></Aba5>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default App;
