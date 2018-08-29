import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import FullScreenTile from '../../components/insightTile/fullScreenTile';
import { connect } from 'react-redux';

export class FullScreenDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableName: this.props.allData ? 'dash' : '',
      graphs: [],
      allData: this.props.allData ? this.props.allData : [],
      status: false,
      update: false,
    }
  }
  componentWillMount() {
    if (this.state.tableName === '') {
      this.setState({ tableName: this.props.match.params.tableName })
    }
  }
  // orders tiles based on position in the dashboard so they can be displayed nicely
  orderTiles = () => {
    var evenArr = [];
    var oddArr = []
    var allData = this.state.allData

    var i;
    for (i = 0; i <= allData.length; i = i + 2) {
      if (allData[i] !== undefined) {
        evenArr.push(allData[i]);
        allData[i + 1] && oddArr.push(allData[i + 1]);
      }
    }
    return { oddArr, evenArr }
  }
  // sets allData to the updated list of tiles for a dashboard
  updateDash = (allData) => {
    allData ? this.setState({ allData: allData, update: true }) : this.setState({ update: true });
  }
  // make sure the update is completed properly
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.update && this.state.update) {
      this.setState({ update: false })
    }
  }

  render() {
    if (this.state.allData) {
      var temp = this.orderTiles();
      var left = temp.evenArr;
      var right = temp.oddArr;
    }
    
    return (
      <div style={{ alignContent: 'center', alignItems: 'ceter', }}>
        {!this.state.update &&
          <div>
            {(this.state.tableName !== 'dash') && <h1>{this.state.tableName}</h1>}
            <Row  style={{ width: window.innerWidth }} >
              <Col style={{ padding: 0, width: (window.innerWidth / 2), height: (window.innerHeight / 2) }}>
                {left.map((table, key) => (
                  <div key={key} className='isoSimpleTable' style={{ alignContent: 'center', marginBottom: '6px', marginTop: '16px', }} >
                  <FullScreenTile table={table} type={this.state.tableName} dashboard={this.props.dashboard} tileIndex={key} updateDash={this.updateDash} />
                  </div>
                ))
                }
              </Col>
              <Col style={{ padding: 0, width: (window.innerWidth / 2), height: (window.innerHeight / 2) }} >
                {right.map((table, key) => (
                  <div key={key} className='isoSimpleTable' style={{ alignContent: 'center', marginBottom: '16px', marginTop: '16px', }} >
                  <FullScreenTile table={table} type={this.state.tableName} dashboard={this.props.dashboard} tileIndex={(2 * key) + 1} updateDash={this.updateDash} />
                  </div>
                ))
                }
              </Col>
            </Row>
          </div>
        }
      </div>
    );
  }
}
export default connect()(FullScreenDashboard);

