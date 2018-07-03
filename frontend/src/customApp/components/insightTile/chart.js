import React, { Component } from 'react';
import { Row, Col, Tag } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'react-redux';

export class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style:(this.props.eChartStyle ? this.props.eChartStyle : null),
    };
  }
  render() {
    const style = this.state.style;
    return (
      <div>
        <Row justify="center">
          {style !== null ? 
          <ReactEcharts option={this.props.table.options} style={{width:style.width, height: style.height}}/> :
          <ReactEcharts option={this.props.table.options} /> }
        </Row>

        <Row justify="center" style={{height: '80px'}} >
          <Col md={24} xs={24}  >
            <h4>Description:</h4>
            <p>{this.props.table.description} </p>
          </Col>
          <Col md={24} xs={24} >
            <h4>Tags:</h4>
            {this.props.table.tags.map(function (tag) {
              return <Tag key={tag.name || tag}>{tag.name || tag}</Tag>
            })
            }

          </Col>
        </Row>
      </div>
    );
  }
}
export default connect(
)(Chart);