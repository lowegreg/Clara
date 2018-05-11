import React from 'react';
import DataCard from '../../components/dataCard';
import OpenDataPageWrapper from './style';
import { Input } from 'antd';
import SuperSelectField from 'material-ui-superselectfield'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Row, Col } from 'react-flexbox-grid';
const Search = Input.Search;

export default class OpenDataTable extends React.Component {
    constructor(props){
      super(props);
  
      this.state={
        tables: [{key:0, name:'',description:'', id: 0}],
        filterTables: [{key:0, name:'',description:'', id: 0}],
        search:'',
        filter:null,
      }
    }    
    
    
    componentDidMount(){
      fetch('http://35.182.224.114:3000/tableLookUp', {method: 'GET', mode: 'cors'})
      .then((response) =>  response.json())
      .then(responseJson=> {
        responseJson.tableId.forEach(function(obj) { obj.key = responseJson.tableId });
        this.setState({ tables:responseJson.tableId , filterTables: responseJson.tableId})
      })
      .catch((error) => { 
        console.error(error);
      });
    }   
  
    select= (values, name) =>   {
      var filter=this.state.tables
      if(values==null){
        filter=this.state.tables.filter(value=> value.name.toLowerCase().indexOf(this.state.search.toLowerCase())>=0)
        this.setState({
          filter: null,
          filterTables: filter
        })
        return;
      }
     
      if (values.value==='Rejected'){
        filter=this.state.tables.filter(value=> value.name.toLowerCase().indexOf(this.state.search.toLowerCase())>=0&& value.statusId==='rejected')
      }else if (values.value==='Accepted'){
        filter=this.state.tables.filter(value=>value.name.toLowerCase().indexOf(this.state.search.toLowerCase())>=0 && value.statusId==='accepted') 
      }else if(values.value==='Not Submitted'){
        filter=this.state.tables.filter(value=> value.name.toLowerCase().indexOf(this.state.search.toLowerCase())>=0&& value.statusId===null)
      }else {
        filter=this.state.tables.filter(value=> value.name.toLowerCase().indexOf(this.state.search.toLowerCase())>=0 && value.statusId==="submitted")
      }
     
     // var filter=this.state.tables.filter(value=> value.status.indexOf(event.target.value.toLowerCase())>=0)
      this.setState({
        filter: values,
        filterTables: filter
      })
    }   
    searchText(event){
      
      var filter;
      if (this.state.filter===null){
        filter=this.state.tables.filter(value=> value.name.toLowerCase().indexOf(event.target.value.toLowerCase())>=0)
      }else{
        var filterWord
        if (this.state.filter.value==='Rejected'){
          filter=this.state.tables.filter(value=> value.name.toLowerCase().indexOf(event.target.value.toLowerCase())>=0 &&value.statusId==='rejected' )
        }else if (this.state.filter.value==='Accepted'){
          filterWord='accepted'
          filter=this.state.tables.filter(value=> value.name.toLowerCase().indexOf(event.target.value.toLowerCase())>=0 &&value.statusId===filterWord )
        }else if (this.state.filter.value==='Not Submitted'){
          filter=this.state.tables.filter(value=> value.name.toLowerCase().indexOf(event.target.value.toLowerCase())>=0 &&value.statusId===null)
        }else {
          filterWord='submitted'
          filter=this.state.tables.filter(value=> value.name.toLowerCase().indexOf(event.target.value.toLowerCase())>=0 &&value.statusId===filterWord )
        }
      }
      
      this.setState({
        search: event.target.value,
        filterTables: filter    
      })
      
    }
  render() {
    return (
      <OpenDataPageWrapper className='isoInvoicePageWrapper'>
    
     <Row>
       <Col xs={2}></Col>
       
       <Col xs={7} style={{marginRight:'0px'}}>
        <Search
        placeholder="input search text"
        value={this.state.search}
        onChange={value => this.searchText(value)}
        //onSearch={value => console.log(value)}
        style={{ width: '80%' }}
        />
        </Col><Col  xs={1}style={{marginLeftt:'0px'}}>
      
          <MuiThemeProvider>
            <SuperSelectField
                name= {'Filter'}
                hintText='Filter'
                value={this.state.filter}
                onChange={this.select}
                style={{ minWidth: 150, margin: 10 }}
            >
              <div  value={'Accepted'}>Accepted</div> 
              <div  value={'Submitted'}>Submitted</div> 
              <div  value={'Rejected'}>Rejected</div> 
              <div  value={'Not Submitted'}>Not Submitted</div> 


            </SuperSelectField>
          </MuiThemeProvider>
     
        </Col></Row>
    
   
      {this.state.filterTables.map((table, key) => ( 
        <div key={key} className='isoSimpleTable'>
          <DataCard data={table}/>
        </div>
        ))
      }
      </OpenDataPageWrapper>
    );
  }
}
