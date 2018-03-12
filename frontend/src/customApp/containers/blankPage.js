import React, { Component } from 'react';
import Tile from '../components/insightTile';

import { Grid, Row, Col } from 'react-flexbox-grid';

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
      widthOfCard:'65%',
      tags,
      dataKey:{name:'name', dataOne:'accidents'}
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
      widthOfCard:'100%',// 100 or 60
      tags,
      dataKey:{name:'name', dataOne:'accidents'}
    };
   
    let CustomActiveShapePieChart = {
      componentName: 'CustomActiveShapePieChart',
      key: 'CustomActiveShapePieChart',
      title: 'Custom Active Shape Pie Chart',
      width: 600,
      height,
      colors,
      dataKey: 'value',
      datas:[
        {name: 'Group A', value: 400},
        {name: 'Group B', value: 900},
        {name: 'Group C', value: 300},
        {name: 'Group D', value: 200},
      ],
      description:'This tile displays the correlations between accidents and weather conditions.',
      widthOfCard:'50%',
      tags,

    };
    return (
      <div style={{alignContent:'center', alignItems:'ceter', marginLeft: '16px', marginTop: '16px'}}>
         <Grid fluid>
          <Row style={{ marginBottom: '16px'}}>
            <Col xs={6} >
               <Tile {...LineBarAreaComposedChart} />
            </Col>
            <Col xs={3}  >
               <div style={{ marginBottom: '16px'}}>
                  <Tile {...CustomActiveShapePieChart} />
               </div> 
               <div> 
                  <Tile {...CustomActiveShapePieChart} />
                </div> 
            </Col>
            <Col xs={3}  >

                <Tile {...SimpleLineCharts} /> 
 
            </Col>
          </Row>
        
           
        <Row>
          <Col xs={12} >
            <Tile componentName='gmaps' tags={tags} height={height} widthOfCard={'100%'}  width={width} description={'A map of downtown kitchener'} title={'Maps'}/>
          </Col>
        </Row>  
        

 
        </Grid>
      
    </div>
    );
  }
}
