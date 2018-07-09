import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'react-flexbox-grid';
import Buttons from '../../../components/uielements/button';
import Chart from '../../components/insightTile/chart';

export class Display extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tile: this.props.tile
    };
  }
  componentWillUpdate(prevProp) {
    if (prevProp.tile !== this.props.tile) {
      this.props.setUpdate(false)
    } else {
      this.props.setUpdate(true)
    }
  }

  render() {
    const { tile } = this.state   
    return (
      <div>
        { tile &&
          <Row style={{ justifyContent: 'center', alignContent: 'center' }}>
          <p style={{ paddingLeft: '20px', paddingTop: '10px', paddingBottom: '10px' }}><font size="5">{tile.value.title}</font></p>
          <div style={{ marginLeft: 'auto', marginRight: '20px', marginTop: '5px' }}>
            <Buttons size='small'>Edit</Buttons>
          </div>

          <div style={{ borderStyle: 'solid', padding: '15px', alignContent: 'center', justifyContent: 'center' }}>
            <Chart table={tile.value} eChartStyle={{ width: window.innerWidth - 600, height: (window.innerHeight / 2) + 100 }} />
          </div>
          </Row>
        }
        
      </div>
    );
  }
}
export default connect(
)(Display);