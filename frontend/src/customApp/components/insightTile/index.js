import React, { Component } from 'react';
import Card from '../../../containers/Uielements/Card/card.style'
// import IntlMessages from '../../../components/utility/intlMessages';


import { Row, Col,Tag } from 'antd';
import CustomActiveShapePieChart from '../../../containers/Charts/recharts/charts/customActiveShapePieChart';
import LineBarAreaComposedChart from '../../../containers/Charts/recharts/charts/lineBarAreaComposedChart';
import SimpleLineCharts from  '../../../containers/Charts/recharts/charts/simpleLineCharts';
// import SimpleRadialBarChart from '../../../containers/Charts/recharts/charts/simpleRadialBarChart';
import BasicMarker from '../../../containers/Map/GoogleMap/maps/basicMarker';
import Icon from 'react-icons-kit';
import { pushpin } from 'react-icons-kit/icomoon/pushpin';       
      
import { Clickable, StopPropagation } from 'react-clickable';
 
import Async from '../../../helpers/asyncComponent';


const Polar = props => (
 
    <Async
      load={import(/* webpackChunkName: "ReactChart2-polar" */ '../../../containers/Charts/reactChart2/components/polar/polar')}
      componentProps={props}
    />
 
);
const MixedData = props => (
       
      <Async
        load={import(/* webpackChunkName: "ReactChart2-mix" */ '../../../containers/Charts/reactChart2/components/mix/mix')}
        componentProps={props}
      />
   
  );
  const Doughnut = props => (
   
      <Async
        load={import(/* webpackChunkName: "ReactChart2-Doughnut" */ '../../../containers/Charts/reactChart2/components/doughnut/doughnut')}
        componentProps={props}
      />
   
  );

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

    let shrink = parseFloat(this.props.widthOfCard)/100;
    let shrinkH= shrink
    
    return (
        <Clickable onClick={this.onSelect} onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)} >
      
        <Card
                title={this.props.title}
                bordered={true}
                 extra={ <StopPropagation><Clickable> <Icon icon={pushpin} /></Clickable> </StopPropagation>}//
                // style={{ width: this.props.widthOfCard }}
            >
      
          <Row  justify="center">
         
            {/* <Box title={this.props.title}  > */}
           
            { this.props.componentName=== 'SimpleLineCharts' &&
                <SimpleLineCharts  datas={this.props.datas} width={this.props.width*shrink}  height={this.props.height*shrinkH} colors={this.props.colors} dataKey={this.props.dataKey} />
            } 
            { this.props.componentName=== 'LineBarAreaComposedChart' &&
                <LineBarAreaComposedChart {...this.props} width={this.props.width*shrink} height={this.props.height*shrinkH}/>
            } 
            {this.props.componentName==='gmaps' &&
                <BasicMarker height={this.props.height*shrinkH} width={this.props.width*shrink}/>
            }
            {this.props.componentName==='CustomActiveShapePieChart' &&
                <CustomActiveShapePieChart {...this.props} width={this.props.width*shrink} shrink={shrink}/>
            } 
            {this.props.componentName==='SimpleRadialBarChart' &&
                <Polar {...this.props} />
            }
            {this.props.componentName=== 'mixed' &&
                 <MixedData data={this.props.data} />
            }
            {this.props.componentName==='Doughnut' &&
                <Doughnut  data={this.props.data}/>
            }
            {/* </Box> */}
             
        </Row>  
        {shrink>=.90 &&
            <Row  justify="center">
                
                <Col md={24} xs={24} >
                    <h3>Description:</h3>
                    <p>{this.props.description} </p> 
                </Col>
                <Col md={24} xs={24} >
                    <h3>Tags:</h3>
                    {this.props.tags.map(function(tag){
                        return <Tag key={tag.name}>{tag.name}</Tag>
                    })
                    }
                    
                </Col> 
                    
            </Row> 
        }
       
        </Card>
        </Clickable>
    );
  }
}
