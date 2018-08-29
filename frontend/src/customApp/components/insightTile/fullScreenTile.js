import React, { Component } from 'react';
import Card from '../../../containers/Uielements/Card/card.style';
import { connect } from 'react-redux';
import ReactEcharts from 'echarts-for-react'

export class FullScreenTile extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }
  render() {
    return (
        <Card
          title={`${this.props.table.tableName}: ${this.props.table.title}`}
          bordered={true}
          style={{ width: window.innerWidth*0.45, margin: '5px', }}
        >
          <ReactEcharts option={this.props.table.options} style={{ width: '100%' , height: (window.innerHeight / 3) }} />
        </Card>
    );
  }
}
export default connect()(FullScreenTile);