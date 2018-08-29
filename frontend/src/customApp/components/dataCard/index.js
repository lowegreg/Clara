import React, { Component } from 'react';
import { DataCardWrapper } from './style'
import { Clickable } from 'react-clickable';
import { Modal } from 'antd';
import { Row, Col } from 'react-flexbox-grid';

class DataCard extends Component {
  onSelect(tableName, status) {

    if (status === null || status === 'rejected') {
      window.location.href = '/dashboard/dataManagement/' + tableName
    } else if (status === 'accepted') {
      window.location.href = '/dashboard/insights/' + tableName
    } else {
      Modal.warning({
        title: 'Dataset is being processed.',
        content: 'This data set has been mapped and is waiting approval. Check back later, to use this data.',
      });
    }

  }
  mouseOver() {
    this.setState({ hover: true });
  }
  mouseOut() {
    this.setState({ hover: false });
  }

  setStatus(status) {
    switch (status) {
      case 'accepted':
        return 'green'
      case 'rejected':
        return '#bf0505'
      case 'submitted':
        return 'orange'
      default:
        return '#bf0505'
    }
  }

  render() {
    //success, error, Warning
    return (
      <div >

        <Clickable onClick={() => { this.onSelect(this.props.data.name, this.props.data.statusId) }} onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)} >
          <Row style={{ marignBottom: '20px' }}>
            <Col ><div style={{ width: '9px', height: '94%', backgroundColor: this.setStatus(this.props.data.statusId) }}></div></Col>
            <div style={{ width: '99%' }}>
              <DataCardWrapper >
                <Row>
                  <Col xs={10}>
                    <h4 className="isoCardTitle">{this.props.data.name} </h4>
                    <span className="isoCardDate">
                      {this.props.data.description}
                    </span>
                  </Col>
                  <Col xs={2} style={{ borderStyle: 'dotted', borderRight: '5px', borderTop: '5px', borderBottom: '5px' }}>
                    <Row style={{ marginLeft: '5px', marginBottom: '15px' }}><h4 className="isoCardTitle">Status: </h4></Row>
                    <Row style={{ marginLeft: '20px' }}><h4 className="isoCardTitle">{this.props.data.statusId || 'not mapped'} </h4></Row>
                  </Col>
                </Row>
              </DataCardWrapper>
            </div>

          </Row>
        </Clickable>
      </div>
    );
  }
}
export default DataCard;