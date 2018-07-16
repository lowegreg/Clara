import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import Buttons from '../../../components/uielements/button';
import Chart from '../../components/insightTile/chart';
import { Modal, Slider } from 'antd';
import Export from './export';

export class Display extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tile: JSON.parse(JSON.stringify(this.props.tile)),
      edit: false,
      slider: [],
      originalTile: JSON.parse(JSON.stringify(this.props.tile)),
      update: false
    };
  }
  setEditValues = () => {
    const { tile, originalTile } = this.state;
    var name;
    var slider = []
    if (tile.graph === 'circleBar' || tile.graph === 'multiBar' || tile.graph === 'line') {
      for (let i = 0; i < tile.options.series.length; i++) {
        const x = tile.options.series[i];
        var data = x.data.filter(function (object) {
          return object !== null && object !== undefined;
        })
        if (tile.graph === 'line') {
          name = tile.yName
        } else {
          name = x.name
        }

        slider.push({
          name: name,
          data: x.data,
          max: Math.round(Math.max(...originalTile.options.series[i].data)),
          min: Math.round(Math.min(...originalTile.options.series[i].data)),
          value: [
            Math.min(...data),
            Math.max(...data)
          ],
          marks: {
            [Math.round(Math.max(...originalTile.options.series[i].data))]: `${Math.round(Math.max(...originalTile.options.series[i].data))}`,
            [Math.round(Math.min(...originalTile.options.series[i].data))]: `${Math.round(Math.min(...originalTile.options.series[i].data))}`,
          }
        })
      }
    } else if (tile.graph === 'pie') {
      data = [];
      var originalData = [];
      for (const i in tile.options.series[0].data) {
        data[i] = tile.options.series[0].data[i].value
        originalData[i] = originalTile.options.series[0].data[i].value
      }
      slider.push({
        name: originalTile.yName,
        max: Math.round(Math.max(...originalData)),
        min: Math.round(Math.min(...originalData)),
        value: [
          Math.min(...data),
          Math.max(...data)
        ],
        marks: {
          [Math.round(Math.max(...originalData))]: `${Math.round(Math.max(...originalData))}`,
          [Math.round(Math.min(...originalData))]: `${Math.round(Math.min(...originalData))}`,
        }
      })
    } else if (tile.graph === 'fillLine') {
      slider.push({
        name: originalTile.yName,
        max: Math.round(Math.max(...originalTile.options.series[0].data)),
        min: Math.round(Math.min(...originalTile.options.series[0].data)),
        value: [
          Math.min(...tile.options.series[0].data),
          Math.max(...tile.options.series[0].data)
        ],
        marks: {
          [Math.round(Math.max(...originalTile.options.series[0].data))]: `${Math.round(Math.max(...originalTile.options.series[0].data))}`,
          [Math.round(Math.min(...originalTile.options.series[0].data))]: `${Math.round(Math.min(...originalTile.options.series[0].data))}`,
        },
      })
    }
    this.setState({ edit: true, slider: slider, update: false })
  }
  onChange = (event, key) => {
    var slider = this.state.slider;
    slider[key].value = event;
    this.setState({ slider: slider })
  }
  handleOk = () => {
    const { originalTile, slider } = this.state
    var tile = this.state.tile;
    var options = tile.options;
    if (tile.graph === 'circleBar') {
      for (const j in tile.options.radiusAxis.data) {
        for (const i in slider) {
          options.series[i].data[j] = this.inRange(originalTile.options.series[i].data[j], slider[i])
        }
      }

    } else if (tile.graph === 'multiBar') {
      for (const j in originalTile.options.xAxis[0].data) {
        for (const i in slider) {
          options.series[i].data[j] = this.inRange(originalTile.options.series[i].data[j], slider[i])
        }
      }
    } else if (tile.graph === 'line' || tile.graph === 'fillLine') {
      for (const j in options.xAxis.data) {
        options.series[0].data[j] = this.inRange(originalTile.options.series[0].data[j], slider[0])
      }
      for (let i = options.xAxis.data.length; i >= 0; i--) {
        if (options.series[0].data[i] === null) {
          options.series[0].data.splice(i, 1)
          options.xAxis.data.splice(i, 1)
        }
      }
    } else if (tile.graph === 'pie') {
      for (const j in originalTile.options.series[0].data) {
        options.series[0].data[j].value = this.inRange(originalTile.options.series[0].data[j].value, slider[0])
      }
      for (let i = options.series[0].data; i >= 0; i--) {
        if (options.series[0].data[i].value === null) {
          options.series[0].data.splice(i, 1)
        }
      }
    }
    this.setState({ tile: tile, edit: false, update: true })
  }
  inRange = (value, slider) => {
    if (value < slider.value[0] || value > slider.value[1]) {
      return null;
    } else {
      return value;
    }
  }
  componentWillUpdate(prevProp) {
    if (prevProp.tile !== this.props.tile) {
      this.props.setUpdate(false)
    }
  }
  render() {

    const { tile, slider } = this.state
    return (
      <div>
        {tile &&
          <Row style={{ justifyContent: 'center', alignContent: 'center' }}>
            <p style={{ paddingLeft: '20px', paddingTop: '10px', paddingBottom: '10px' }}><font size="5">{tile.title}</font></p>
            <div style={{ marginLeft: 'auto', marginRight: '20px', marginTop: '5px' }}>
              <Buttons size='small' onClick={this.setEditValues}>Edit</Buttons>
            </div>
            <div style={{ borderStyle: 'solid', padding: '15px', alignContent: 'center', justifyContent: 'center' }}>
              <Chart table={tile} eChartStyle={{ width: window.innerWidth - 600, height: (window.innerHeight / 2) + 100 }} />
            </div>
            <Modal
              title="Edit Data"
              visible={this.state.edit}
              onOk={this.handleOk}
              onCancel={() => this.setState({ edit: false })}
            >
              {
                slider.map((x, key) => (
                  <Col key={key}>
                    <p>{x.name}</p>
                    <Slider marks={x.marks} key={key} min={x.min} max={x.max} range defaultValue={[x.value[0], x.value[1]]} onChange={(e) => this.onChange(e, key)} />
                  </Col>
                ))
              }
            </Modal>
          </Row>
        }
        {this.state.tile !== null &&
          <div style={{ marginLeft: '20px', marginRight: '20px', marginTop: '15px' }}>
            <Export tile={this.state.tile} update={this.state.update} />
          </div>
        }
      </div>
    );
  }
}
export default connect(
)(Display);