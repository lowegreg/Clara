import React, { Component } from 'react';
import Tile from '../components/insightTile';
import { Row, Col } from 'antd';
// import BasicMarker from '../../../containers/maps/basicMarker';
import BasicMarker from '../../containers/Map/GoogleMap/maps/basicMarker';
import basicStyle from '../../config/basicStyle'
export default class extends Component {
  constructor(props){
    super(props);

    this.state={
      traffic: [],
      height: props.height,
      width: props.width
    }
    
  }    
   componentDidMount (){
     fetch('http://35.182.224.114:3000/TrafficCollisions', {method: 'GET', mode: 'cors'})
    .then((response) =>  response.json())
    .then(responseJson=> this.setState({traffic:responseJson.id }))
    .catch((error) => {
      console.error(error);
    });

  }
  
  componentWillMount(){
    this.setState({height: window.innerHeight});
    this.setState({width: window.innerWidth });
  }
  
  render() {

    const { rowStyle, colStyle, gutter } = basicStyle;
    let width = this.state.width/3;//800
    let height = this.state.height/2;//400
    if (height>400){
      height=400;
    }
    if (width>800){
      width=800;
    }

    const  colors = ['#BAA6CA', '#B7DCFA', '#FFE69A', '#788195'];

    const tags=[
      {name:'weather', route:''},
      {name:'traffic', route:''},
      {name:'cars', route:''},
      {name:'accidents', route:''},
      {name:'lineGraph', route:''},
    ];
    let SimpleLineCharts = {
      componentName: 'SimpleLineCharts',
      key: 'SimpleLineCharts',
      title: 'Accidents Vs. Weather',
      width,
      height,
      colors,
      datas: this.state.traffic,
      description:'This tile displays the correlations between accidents and weather conditions.',
      widthOfCard:'100%',
      tags,
      dataKey:{name:'weather', dataOne:'accidents'}
    };
    let LineBarAreaComposedChart = {
      componentName: 'LineBarAreaComposedChart',
      key: 'LineBarAreaComposedChart',
      title: 'Line Bar Area ComposedChart',
      width,
      height,
      colors,
      datas: this.state.traffic,
      description:'This tile displays the correlations between accidents and weather conditions.',
      widthOfCard:'100%',
      tags,
      dataKey:{name:'weather', dataOne:'accidents'}
    };
    return (
      <div>
      <Row md={12} xs={24} style={colStyle} >
        <Col md={12} xs={24} style={colStyle}>   
            <Tile {...LineBarAreaComposedChart} />
        </Col> 
        <Col md={12} xs={24} style={colStyle}> 
            <Tile {...SimpleLineCharts} />
          
        </Col> 
      </Row>
      <Row md={12} xs={24} style={colStyle} >
        <BasicMarker />
      </Row>  

    </div>
    );
  }
}
