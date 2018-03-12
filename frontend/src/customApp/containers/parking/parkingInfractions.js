import React, { Component } from 'react';
import Tile from '../../components/insightTile';

import { Grid, Row, Col } from 'react-flexbox-grid';
import * as configs from './config'; 


export default class  extends Component {
  constructor(props){
    super(props);

    this.state={
      traffic: [],
      violations:[],
      feesPerMonth:[],
      locations:[],
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

    fetch('http://35.182.224.114:3000/ParkingInfractions/violations', {method: 'GET', mode: 'cors'})
    .then((response) =>  response.json())
    .then(responseJson=> this.setState({violations:responseJson.id }))
    .catch((error) => {
      console.error(error);
    });
    fetch('http://35.182.224.114:3000/ParkingInfractions/feesPerDate', {method: 'GET', mode: 'cors'})
    .then((response) =>  response.json())
    .then(responseJson=> this.setState({feesPerMonth:responseJson.id }))
    .catch((error) => {
      console.error(error);
    });
    fetch('http://35.182.224.114:3000/ParkingInfractions/locationFees', {method: 'GET', mode: 'cors'})
    .then((response) =>  response.json())
    .then(responseJson=> this.setState({locations:responseJson.id }))
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
    
    return (
      <div style={{alignContent:'center', alignItems:'ceter', marginLeft: '16px', marginTop: '16px'}}>
         <Grid fluid>
          <Row style={{ marginBottom: '16px'}}>
            <Col xs={6} >
              <div style={{ marginBottom: '16px'}}>
                 <Tile data={configs.setMizedGraphData(this.state.feesPerMonth)} componentName={'mixed'} {...configs.mixedDateInfractionsLine}/>
              </div> 
              <div>   
                {/* <Tile {...configs.violoationTypesPie} width={600} height={height} datas={this.state.violations} /> */}
                <Tile  {...configs.violoationTypesDoughnut} data={configs.setDoughnutData(this.state.violations)}/>
              </div>   
            </Col>
            <Col xs={6}  >
               <div style={{ marginBottom: '16px'}}>
                  
                  <Tile {...configs.locationMoneyLine} width={width} height={height} datas={this.state.feesPerMonth}  />
               </div> 
               <div> 
                  
                  <Tile {...configs.SimpleLineCharts}  width={width} height={height}  datas={this.state.locations}  /> 
                </div> 
            </Col>
            <Col xs={3}  >
                
            </Col>
              
          </Row> 
 
        </Grid>
      
    </div>
    );
  }
}


