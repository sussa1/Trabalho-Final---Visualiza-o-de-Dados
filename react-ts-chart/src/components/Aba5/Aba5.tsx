import React from 'react';
import Dispersao from '../Dispersao/Dispersao';
import './Aba5.css';

interface IProps {

}

interface IState {
}

class Aba5 extends React.Component<IProps, IState> {

    render() {
        return (
            <div>
                <Dispersao width={window.innerWidth * 0.48} height={window.innerHeight * 0.77} year={null}></Dispersao>
                <Dispersao width={window.innerWidth * 0.48} height={window.innerHeight * 0.77} year={null}></Dispersao>
            </div>
        )
    }
}

export default Aba5;
