import React from 'react';
import { Bar } from 'react-chartjs-2';
import * as config from './config';

class MixChart extends React.Component {

    render() {
      return (
        <Bar data={this.props.data} {...config} />
      );
    }
  };
  
  export default MixChart;
