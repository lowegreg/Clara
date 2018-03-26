import React, { Component } from 'react';
import { DataCardWrapper } from './style'
import { Clickable } from 'react-clickable';

class DataCard extends Component {
  onSelect(){
    window.location.href =  '/dashboard/parkingInfractions'
  }
  mouseOver(){
      this.setState({hover: true});
  }
  mouseOut() {
      this.setState({hover: false});
  }

  

  render() {
    
      return (
        <div>
          <Clickable  onClick={this.onSelect} onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)} >
          <DataCardWrapper>
            <h3 className="isoCardTitle">{this.props.data.name}</h3>
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