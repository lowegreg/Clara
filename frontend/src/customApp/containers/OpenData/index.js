import React from 'react';
import DataCard from '../../components/dataCard';
import OpenDataPageWrapper from './style';

export default class OpenDataTable extends React.Component {
    constructor(props){
      super(props);
  
      this.state={
        tables: [{key:0, name:'name',description:'decription', id: 0}],
      }
    }    
    
    
    componentDidMount(){
      fetch('http://35.182.224.114:3000/tableLookUp', {method: 'GET', mode: 'cors'})
      .then((response) =>  response.json())
      .then(responseJson=> {
        responseJson.tableId.forEach(function(obj) { obj.key = responseJson.tableId });
        this.setState({ tables:responseJson.tableId })
      })
      .catch((error) => { 
        console.error(error);
      });
    }    
    
  render() {
    return (
      <OpenDataPageWrapper className='isoInvoicePageWrapper'>
      {this.state.tables.map((table, key) => ( 
        <div key={key} className='isoSimpleTable'>
          <DataCard data={table}/>
        </div>
        ))
      }
      </OpenDataPageWrapper>
    );
  }
}
