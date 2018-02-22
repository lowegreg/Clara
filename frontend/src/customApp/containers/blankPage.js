import React, { Component } from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import LayoutContent from '../../components/utility/layoutContent';
import Tile from '../components/insightTile';
import { Row, Col } from 'antd';

import basicStyle from '../../config/basicStyle'
export default class extends Component {
  render() {
    const { rowStyle, colStyle, gutter } = basicStyle;
    const width = 300;
    const height = 200;
    const  colors = ['#BAA6CA', '#B7DCFA', '#FFE69A', '#788195'];
    const datas =  [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    ];
    const tags=[
      {name:'weather', route:''},
      {name:'traffic', route:''},
      {name:'cars', route:''},
      {name:'accidents', route:''},
      {name:'lineGraph', route:''},
    ];
    const SimpleLineCharts = {
      componentName: 'SimpleLineCharts',
      key: 'SimpleLineCharts',
      title: 'Accidents Vs. Weather',
      width,
      height,
      colors,
      datas,
      description:'This tile displays the correlations between accidents and weather conditions.',
      widthOfCard:'100%',
      tags,
    };
    const LineBarAreaComposedChart = {
      componentName: 'LineBarAreaComposedChart',
      key: 'LineBarAreaComposedChart',
      title: 'Line Bar Area ComposedChart',
      width,
      height,
      colors,
      datas,
      description:'This tile displays the correlations between accidents and weather conditions.',
      widthOfCard:'100%',
      tags,
    };
    return (
      <div>
      <Row style={rowStyle} gutter={gutter} justify="start">
        <Col md={12} xs={24} style={colStyle}> 
            <Tile {...LineBarAreaComposedChart} />
        </Col> 
        <Col md={12} xs={24} style={colStyle}> 
            <Tile {...SimpleLineCharts} />
        </Col> 
      </Row>
      <Row style={rowStyle} gutter={gutter} justify="start">
        <Col md={12} xs={24} style={colStyle}> 
            <Tile {...LineBarAreaComposedChart} />
        </Col> 
        <Col md={12} xs={24} style={colStyle}> 
            <Tile {...SimpleLineCharts} />
        </Col> 
    </Row>
    </div>
    );
  }
}
