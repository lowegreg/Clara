import React, { Component } from 'react';
import Card from '../../../containers/Uielements/Card/card.style'
// import IntlMessages from '../../../components/utility/intlMessages';


import { Row, Col,Tag } from 'antd';

import LineBarAreaComposedChart from '../../../containers/Charts/recharts/charts/lineBarAreaComposedChart';
import SimpleLineCharts from  '../../../containers/Charts/recharts/charts/simpleLineCharts';
import Box from '../../../components/utility/box';
import ContentHolder from '../../../components/utility/contentHolder';
import basicStyle from '../../../config/basicStyle';

export default class extends Component {

  render() {

    const { rowStyle, colStyle, gutter } = basicStyle;
   
    return (

        <Card
                title={this.props.title}
                bordered={true}
                style={{ width: this.props.widthOfCard }}
            >
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Box title={''}>
             { this.props.componentName=== 'SimpleLineCharts' &&
                <ContentHolder>
                    <SimpleLineCharts datas={this.props.datas} width={this.props.width} height={this.props.height} colors={this.props.colors} dataKey={this.props.dataKey} />
                 </ContentHolder>
             } 
            { this.props.componentName=== 'LineBarAreaComposedChart' &&
                <ContentHolder>
                    <LineBarAreaComposedChart {...this.props} />
                </ContentHolder>
             } 
            </Box>
          </Row>  
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={15} xs={25} style={colStyle}>
                <h3>Description:</h3>
                <p>{this.props.description} </p> 
            </Col>
            <Col md={9} xs={23} style={colStyle}>
                <h3>Tags:</h3>
                {this.props.tags.map(function(tag){
                    return <Tag key={tag.name}>{tag.name}</Tag>
                })
                }
                
            </Col>    
           </Row> 
        </Card>

    );
  }
}
