import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import * as func from '../../pageFunctions'; 
import Tile from '../../components/insightTile/index2';
import { Spin } from 'antd';

export default class  extends Component {
    constructor(props){
		super(props);

		this.state={
			tableName: this.props.allData ? 'dash' :'',
			graphs:[],
			allData: this.props.allData ? this.props.allData :[],
			status:false,
			loading: -1,
			update: false,
		}
	}  
    createGraphType(props){
		var compare = func.catPropsFunction(props);
		this.setState({
			graphs:compare,
			loading: compare.length*2
		})	
    }
	checkAllData(dataOut){
		var exists= false
		var allData= this.state.allData
		for(var i=0;i< this.state.allData.length; i++){
			if (this.state.allData[i].title === dataOut.title){
				exists= true
				break;
			}
		}
		if (!exists){
			dataOut.tableName = this.state.tableName;
			allData.push(dataOut)
			this.setState({
				allData:allData
			})
		}
		return
	}
	fetchData(url,i){
		fetch(url, {method: 'GET', mode: 'cors'})
			.then((response) =>  response.json())
			.then(responseJson=>{
				var results= responseJson.id	
				results=func.removeNull(results)
				this.setState({loading: this.state.loading-1})
				if (results.length>1){			  
					var x=results.map(data => data.x);
					var y= results.map(data => data.y);
					var z= results.map(data => data.z) || null;
					if (y.filter((v, i, a) => a.indexOf(v) === i).length>1){
						var dataOut=func.formatData(this.state.graphs[i],x, y,z)				
						this.checkAllData(dataOut)// check if the title already exisits				
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
	componentWillMount(){
		if (this.state.tableName===''){
			this.setState({tableName:this.props.match.params.tableName})
		}
	}
	// orders tiles based on position in the dashboard so they can be displayed nicely
	orderTiles=() =>{
		var evenArr=[]; 
		var oddArr = []
		var allData = this.state.allData

		var i;
		for (i = 0; i <= allData.length; i = i + 2) {
			if (allData[i] !== undefined) {
				evenArr.push(allData[i]);
				allData[i+1] && oddArr.push(allData[i + 1]);
			}
		}
		return {oddArr,evenArr}
	}
	// sets allData to the updated list of tiles for a dashboard
	updateDash=(allData)=> {
		allData ? this.setState({allData :allData, update: true}) : this.setState({update: true});
	}
	// make sure the update is completed properly
	componentDidUpdate(prevProps, prevState){
			if(!prevProps.update && this.state.update){
				this.setState({update: false})
		}
	}
  	render() {
		if (this.state.allData.length===0){
			this.setGraphs();
		}

		if (this.state.allData&& this.state.loading===0){
			var temp = this.orderTiles();
			var left = temp.evenArr;
			var right = temp.oddArr;
		}
		
		return (
		<div style={{alignContent:'center', alignItems:'ceter', marginLeft: '16px',marginTop: '16px',marginRight:'16px'}}>
			{(this.state.loading===0 && !this.state.update) &&
				<div>
					{(this.state.tableName!=='dash' )&&<h1>{this.state.tableName}</h1>}
					<Row >
						<Col md={6} xs={6} >
							{left.map((table, key) => ( 
								<div key={key} className='isoSimpleTable' style={{alignContent:'center', alignItems:'ceter', marginBottom: '16px', marginTop: '16px'}} >
									<Tile  table={table} type={this.state.tableName} dashboard={this.props.dashboard} tileIndex={key} updateDash={this.updateDash}/>
								</div>
							))
							}
						</Col>
						<Col md={6} xs={6} >
							{right.map((table, key) => ( 
								<div key={key} className='isoSimpleTable' style={{alignContent:'center', alignItems:'ceter',marginBottom: '16px', marginTop: '16px'}}>
									<Tile  table={table} type={this.state.tableName} dashboard={this.props.dashboard} tileIndex={(2*key)+1} updateDash={this.updateDash}/>	
								</div>
							))
							}
						</Col>
					</Row>
				</div>	
			}
			{this.state.loading!==0 &&
				<div  style={{display:'flex',felx:1, justifyContent:'center', alignItems:'space-around', marginTop:'50px'}}>
					<Spin size="large"   />	
				</div>
			}
		</div>   
		);
  	}
}


