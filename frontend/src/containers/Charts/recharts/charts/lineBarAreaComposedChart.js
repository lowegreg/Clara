import React, { Component } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
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
      // <ChartWrapper className="isoChartWrapper" style={align items } >
      
        <ComposedChart
          width={width}
          height={height}
          data={datas}
         
        >
          <XAxis dataKey={dataKey.name} stroke={colors[3]} />
          <YAxis stroke={colors[3]} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#f5f5f5" />
          <Area
            type="monotone"
            dataKey={dataKey.dataOne}
            fill={colors[0]}
            stroke={colors[0]}
          />
          {dataKey.dataTwo &&
          <Bar dataKey={dataKey.dataTwo} barSize={20} fill={colors[1]} />
          }
          {dataKey.dataThree &&
          <Line type="monotone" dataKey={dataKey.dataThree} stroke={colors[3]} />
          }
        </ComposedChart>
     
        
    );
  }
}
