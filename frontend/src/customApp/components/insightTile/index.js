import React, { Component } from 'react';
import Card from '../../../containers/Uielements/Card/card.style'
// import IntlMessages from '../../../components/utility/intlMessages';


import { Row, Col,Tag } from 'antd';
import CustomActiveShapePieChart from '../../../containers/Charts/recharts/charts/customActiveShapePieChart';
import LineBarAreaComposedChart from '../../../containers/Charts/recharts/charts/lineBarAreaComposedChart';
import SimpleLineCharts from  '../../../containers/Charts/recharts/charts/simpleLineCharts';
import Box from '../../../components/utility/box';
import ContentHolder from '../../../components/utility/contentHolder';
import basicStyle from '../../../config/basicStyle';
import BasicMarker from '../../../containers/Map/GoogleMap/maps/basicMarker';
import Icon from 'react-icons-kit';
import { pushpin } from 'react-icons-kit/icomoon/pushpin';       
import { enlarge2 } from 'react-icons-kit/icomoon/enlarge2';       
import { Clickable, StopPropagation } from 'react-clickable';
 
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

    const { rowStyle, colStyle, gutter } = basicStyle;
    let shrink = parseFloat(this.props.widthOfCard)/100;
    let shrinkH= shrink
    
    console.log('card', this.props)
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
                // <ContentHolder>
                    <SimpleLineCharts  datas={this.props.datas} width={this.props.width*shrink}  height={this.props.height*shrinkH} colors={this.props.colors} dataKey={this.props.dataKey} />
                // </ContentHolder>
             } 
            { this.props.componentName=== 'LineBarAreaComposedChart' &&
                //   <ContentHolder>
                    <LineBarAreaComposedChart {...this.props} width={this.props.width*shrink} height={this.props.height*shrinkH}/>
                //   </ContentHolder>
             } 
             {this.props.componentName==='gmaps' &&
                //  <ContentHolder>
                    <BasicMarker height={this.props.height*shrinkH} width={this.props.width*shrink}/>
                // </ContentHolder>
             }
             {this.props.componentName==='CustomActiveShapePieChart' &&
                // <ContentHolder>
                    <CustomActiveShapePieChart {...this.props} width={this.props.width*shrink} shrink={shrink}/>
                //</ContentHolder>
             } 
             {/* </Box> */}
             
        </Row>  
        {shrink>=.80 &&
            <Row  justify="center">
                
                <Col md={20} xs={20} >
                    <h3>Description:</h3>
                    <p>{this.props.description} </p> 
                </Col>
                <Col md={14} xs={14} >
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
