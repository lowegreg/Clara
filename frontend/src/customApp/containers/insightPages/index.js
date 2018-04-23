import React, { Component } from 'react';
//import Tile from '../../components/insightTile';

//import { Grid, Row, Col } from 'react-flexbox-grid';
import * as func from '../../pageFunctions'; 
import ReactEcharts from 'echarts-for-react';
export default class  extends Component {
  constructor(props){
	super(props);

	this.state={
	  tableName:'Parking Infractions',
	  graphs:[],
	  allData:[],
	  status:false
	}
	
  }  
  createGraphType(props){
	var compare = func.catPropsFunction(props);
	this.setState({
		graphs:compare
	})	
  }

	fetchData(url,i){
		fetch(url, {method: 'GET', mode: 'cors'})
			.then((response) =>  response.json())
			.then(responseJson=>{
				var results= responseJson.id	
				console.log(url)
				if (results.length>1){
					var x=results.map(data => data.x);
					var y= results.map(data => data.y);
					var z= results.map(data => data.z) || null;
					console.log()
					if (y.filter((v, i, a) => a.indexOf(v) === i).length>1){
						var dataOut=func.formatData(this.state.graphs[i],x, y,z)
						var allData= this.state.allData
						allData.push(dataOut)
						this.setState({
							allData:allData
						})
					}
				}		
			} )
			.catch((error) => {
				console.error(error);
		});
  }

  setGraphs(){
		if (this.state.graphs.length === 0){
			return []
		}
		for(var i =0; i< this.state.graphs.length; i++){
			var url='http://35.182.224.114:3000/selectGraphData?tableName='+this.state.tableName+'&x='+this.state.graphs[i].x+'&y='+this.state.graphs[i].y+'&xType='+this.state.graphs[i].xType+'&yType='+this.state.graphs[i].yType
			this.fetchData(url,i)
		}
  } 

  componentDidMount (){
		var url='http://35.182.224.114:3000/dataManagement/getProps?tableName='+this.state.tableName  
		fetch(url, {method: 'GET', mode: 'cors'})
		.then((response) =>  response.json())
		.then(responseJson=> this.createGraphType(responseJson.id ))
		.catch((error) => {
			console.error(error);
		});
		
  }

  graphIt(){
	  return (
		<div>
		{this.state.allData[0]&&
		 	<ReactEcharts option={this.state.allData[0].options} /> 
		}
		</div>
	  )
  }
  render() {
	
	if (this.state.allData.length===0){
		this.setGraphs();
	}
		 
	return (
	  <div style={{alignContent:'center', alignItems:'ceter', marginLeft: '16px', marginTop: '16px'}}>
		
		{/* <Tile data={configs.setMizedGraphData(this.state.feesPerMonth)} componentName={'mixed'} {...configs.mixedDateInfractionsLine}/>  */}
		{this.state.allData.map((table, key) => ( 
        <div key={key} className='isoSimpleTable'>
			{table.title}
          <ReactEcharts option={table.options} />
        </div>
        ))
      }
	  </div>           
	);
  }
}


