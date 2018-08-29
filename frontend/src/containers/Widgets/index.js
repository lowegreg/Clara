import React, { Component } from 'react';
import { Row, Col } from 'antd';
import basicStyle from '../../config/basicStyle';


export default class IsoWidgets extends Component {
  render() {
    const { rowStyle, colStyle } = basicStyle;
    const wisgetPageStyle = {
      display: 'flex',
      flexFlow: 'row wrap',
      alignItems: 'flex-start',
      padding: '15px',
      overflow: 'hidden'
    };


    return (
      <div style={wisgetPageStyle}>
        <Row style={rowStyle} gutter={0} justify="start">
          <Col md={8} sm={24} xs={24} style={colStyle}>
           
          </Col>

          
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          

          <Col md={8} sm={12} xs={24} style={colStyle}>
            
          </Col>
        </Row>
      </div>
    );
  }
}
