import React, { Component } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import ChartWrapper from '../../chart.style';

export default class extends Component {



  render() {
    const { datas, width, height, colors,dataKey } = this.props;

    return (
      <ChartWrapper>
        <LineChart
          width={width}
          height={height}
          data={datas}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey={this.props.dataKey.name} stroke={colors[3]} />
          <YAxis stroke={colors[3]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={this.props.dataKey.dataOne}
            stroke={colors[0]}
            activeDot={{ r: 8 }}
          />
          {dataKey.dataTwo&&
            <Line type="monotone" dataKey={this.props.dataKey.dateTwo} stroke={colors[1]} />
          }  
        </LineChart>
      </ChartWrapper>
    );
  }
}
