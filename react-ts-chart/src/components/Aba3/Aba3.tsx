import React from 'react';
import Linha from '../Linha/Linha';
import './Aba3.css';

interface IProps {

}

interface IState {
}

class Aba3 extends React.Component<IProps, IState> {

    render() {
        return (
            <div>
                <div className="graficos">
                    <div style={{ width: "100vw", height: "70vh" }}>
                        <h3 className="titulo-grafico">Comparação de Produtos</h3>
                        <Linha id="1" width={window.innerWidth * 0.98} height={window.innerHeight * 0.47} products={true}></Linha>
                    </div>
                    <div style={{ width: "100vw", height: "70vh" }}>
                        <h3 className="titulo-grafico">Comparação de Estados</h3>
                        <Linha id="2" width={window.innerWidth * 0.98} height={window.innerHeight * 0.47} products={false}></Linha>
                    </div>
                </div>

            </div>
        )
    }
}

export default Aba3;
