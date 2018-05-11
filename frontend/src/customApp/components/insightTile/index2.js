import React, { Component } from 'react';
import Card from '../../../containers/Uielements/Card/card.style'
import { Row, Col,Tag } from 'antd';
import Icon from 'react-icons-kit';
import { pushpin } from 'react-icons-kit/icomoon/pushpin';         
import { Clickable, StopPropagation } from 'react-clickable';
import ReactEcharts from 'echarts-for-react';

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hover: false
        };
    }
    onSelect(){
        console.log('click');
    }
    mouseOver(){
        this.setState({hover: true});
    }
    mouseOut() {
        this.setState({hover: false});
    }

  render() {

    return (
        <Clickable onClick={this.onSelect} onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)} >
      
        <Card
                title={this.props.table.title}
                bordered={true}
                extra={ <StopPropagation><Clickable> <Icon icon={pushpin} /></Clickable> </StopPropagation>}//
                // style={{ width: this.props.widthOfCard }}
            >
      
          <Row  justify="center">
                    <ReactEcharts option={this.props.table.options} />
             
        </Row>  
        
        <Row  justify="center">  
            <Col md={24} xs={24}  >
                <h4>Description:</h4>
                <p>{this.props.table.description} </p> 
            </Col>
            <Col md={24} xs={24} >
                {/* {this.props.table.tags} */}
                <h4>Tags:</h4>
                    {this.props.table.tags.map(function(tag){
                    return <Tag key={tag.name}>{tag.name}</Tag>
                })
                }...
                
            </Col> 
                
        </Row> 
        
       
        </Card>
        </Clickable>
    );
  }
}
