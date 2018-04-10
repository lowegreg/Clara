import React, { Component } from 'react';
import { DataCardWrapper } from './style'
import { Clickable } from 'react-clickable';
import Badge from '../../../containers/Uielements/Badge/badge.style';
import { Modal } from 'antd';

class DataCard extends Component {
  onSelect(tableName,status){
 
    if (status===null|| status==='rejected'){
      window.location.href =  '/dashboard/dataManagement/'+tableName
    }else if (status==='accepted'){
      window.location.href =  '/dashboard/'+tableName
    }else{
      Modal.warning({
        title: 'Dataset is being processed.',
        content: 'This data set has been mapped and is waiting approval. Check back later, to use this data.',
      });
    }
    
  }
  mouseOver(){
      this.setState({hover: true});
  }
  mouseOut() {
      this.setState({hover: false});
  }

 setStatus(status){
   switch(status){
     case 'accepted':
        return 'success'
     case 'rejected':
        return 'error'   
     case 'submitted':
        return 'warning'
     default:
        return 'error'  
   }
 } 

  render() {
    //success, error, Warning
      return (
        <div>
          <Clickable  onClick={() => { this.onSelect(this.props.data.name, this.props.data.statusId)}} onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)} >
          <DataCardWrapper>
            <h3 className="isoCardTitle">{this.props.data.name} <Badge status={this.setStatus(this.props.data.statusId)} /></h3>
            <span className="isoCardDate">
              {this.props.data.description}
            </span>
            
          </DataCardWrapper>
          </Clickable>
        </div>
      );
    }
  }
  export default DataCard;