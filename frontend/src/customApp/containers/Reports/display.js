import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import Buttons from '../../../components/uielements/button';
import Chart from '../../components/insightTile/chart';
import { Modal, Slider } from 'antd';
import Export from './export';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import DateRangePicker from 'react-daterange-picker';
import 'react-daterange-picker/dist/css/react-calendar.css';
import moment from 'moment'

export class Display extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tile: JSON.parse(JSON.stringify(this.props.tile)),
      edit: false,
      slider: [],
      originalTile: this.props.tile !== null ? JSON.parse(JSON.stringify(this.props.tile)) : {},
      update: false,
      options: [],
      remove: [],
      range: {},
      dates: null,
      descrip: null,
    };
  }
  setSliders = () => {
    const { tile, originalTile } = this.state;
    var slider = []
    var options = []
    var range = {}
    if (tile.graph === 'circleBar' || tile.graph === 'multiBar') {
      for (let i = 0; i < tile.options.series.length; i++) {
        const x = tile.options.series[i];
        var data = x.data.filter(function (object) {
          return object !== null && object !== undefined;
        })

        slider.push({
          name: x.name,
          max: Math.round(Math.max(...originalTile.options.series[i].data)),
          min: Math.round(Math.min(...originalTile.options.series[i].data)),
          value: [
            Math.min(...data) === Infinity ? Math.round(Math.min(...originalTile.options.series[i].data)) : Math.min(...data),
            Math.max(...data) === -Infinity ? Math.round(Math.max(...originalTile.options.series[i].data)) : Math.max(...data),
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
      const filteredData = data.filter(value => value !== null)
      slider.push({
        name: originalTile.yName,
        max: Math.round(Math.max(...originalData)),
        min: Math.round(Math.min(...originalData)),
        value: [
          Math.min(...filteredData),
          Math.max(...filteredData)
        ],
        marks: {
          [Math.round(Math.max(...originalData))]: `${Math.round(Math.max(...originalData))}`,
          [Math.round(Math.min(...originalData))]: `${Math.round(Math.min(...originalData))}`,
        }
      })
    } else if (tile.graph === 'fillLine' || tile.graph === 'line') {
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

    if (tile.graph === 'pie') {
      for (const i in tile.options.series[0].data) {
        if (originalTile.options.series[0].data[i]) {
          options.push(originalTile.options.series[0].data[i]);
        } else {
          options.push('null');
        }
      }
    } else if (tile.graph === 'fillLine') {
      for (const i in originalTile.options.xAxis.data) {
        if (originalTile.options.xAxis.data[i]) {
          options.push(originalTile.options.xAxis.data[i]);
        } else {
          options.push('null');
        }
      }
    } else if (tile.graph === 'circleBar' || tile.graph === 'multiBar') {
      for (const i in slider) {
        if (slider[i]) {
          options.push(slider[i].name);
        } else {
          options.push('null');
        }
      }
    } else {
      if (tile.xName.toLowerCase() !== 'date') {
        for (const i in originalTile.options.xAxis.data) {
          if (originalTile.options.xAxis.data[i]) {
            options.push(originalTile.options.xAxis.data[i]);
          } else {
            options.push('null');
          }
        }
      } else {
        var startDate = originalTile.options.xAxis.data[0].split(" ");
        range.date = originalTile.options.xAxis.data[0];
        range.month = (moment().month(startDate[0]).format("M"))-1;
        range.year = parseInt(startDate[2], 10);
      }
    }
    this.setState({ edit: true, slider: slider, update: false, options: options, descrip: null, range, dates: null })
  }
  onChange = (event, key) => {
    var slider = this.state.slider;
    slider[key].value = event;
    this.setState({ slider: slider })
  }
  handleOk = () => {
    const { originalTile, slider, remove, dates } = this.state
    var tile = this.state.tile;
    var options = tile.options;
    var descrip = [];
    var editCount = 0;
    if (tile.graph === 'circleBar') {
      for (const i in slider) {
        options.series[i].data = this.inRange(slider[i].name, originalTile.options.series[i].data, slider[i]);
      }
    } else if (tile.graph === 'multiBar') {
      for (const i in slider) {
        options.series[i].data = this.inRange(slider[i].name, originalTile.options.series[i].data, slider[i])
      }
    } else if (tile.graph === 'line' || tile.graph === 'fillLine') {
      for (const i in options.xAxis.data) {
        options.series[0].data[i] = this.inRange(originalTile.options.xAxis.data[i], originalTile.options.series[0].data[i], slider[0])
      }
      if (dates) {
        const end = String(dates.end._d.toISOString()).substring(0,10)
        const start = String(dates.start._d.toISOString()).substring(0,10);
        for (const i in originalTile.options.xAxis.data) {
          if(!moment(originalTile.options.xAxis.data[i]).isBetween(start,end,null,[])){
            options.series[0].data[i] = null;
          }
        }
      }
      for (let i = options.xAxis.data.length; i >= 0; i--) {
        if (options.series[0].data[i] === null) {
          options.series[0].data.splice(i, 1)
          options.xAxis.data.splice(i, 1)
        }
      }
    } else if (tile.graph === 'pie') {
      for (const j in originalTile.options.series[0].data) {
        options.series[0].data[j].value = this.inRange(originalTile.options.series[0].data[j].name, originalTile.options.series[0].data[j].value, slider[0])
      }
      for (let i = options.series[0].data; i >= 0; i--) {
        if (options.series[0].data[i].value === null) {
          options.series[0].data.splice(i, 1)
        }
      }
    }

    if (slider.length > 0) {
      for (const i in slider) {
        if (slider[i].min !== slider[i].value[0] || slider[i].max !== slider[i].value[1]) {
          descrip[editCount] = `${slider[i].name}'s range: ${slider[i].value[0]} - ${slider[i].value[1]}`
          editCount++;
        }
      }
    }
    if (remove.length > 0) {
      descrip[editCount] = `Removed: `
      for (const i in remove) {
        descrip[editCount] = descrip[editCount].concat(`${remove[i]}, `)
      }
      editCount++;
    }
    if (dates) {
      descrip[editCount] = `Date Range: ${String(dates.start._d).substring(4, 15)} to ${String(dates.end._d).substring(4, 15)}`
    }
    tile.edit = descrip;
    this.setState({ tile, edit: false, update: true, descrip, })
  }
  inRange = (name, data, slider) => {
    const { originalTile } = this.state;
    var newData;
    if (originalTile.graph === 'pie' || originalTile.graph === 'line' || originalTile.graph === 'fillLine') {
      if (this.isRemoved(name)) {
        return null
      } else if (data < slider.value[0] || data > slider.value[1]) {
        return null;
      } else {
        return data;
      }
    } else {
      newData = []
      if (this.isRemoved(name)) {
        for (const i in data) {
          newData[i] = null
        }
      } else {
        for (const i in data) {
          if (data[i] < slider.value[0] || data[i] > slider.value[1]) {
            newData[i] = null;
          } else {
            newData[i] = data[i];
          }
        }
      }
    }
    return newData;
  }
  selectCheckbox = (event) => {
    this.setState({ remove: event })
  }
  isRemoved = (name) => {
    const { remove } = this.state
    for (const i in remove) {
      if (remove[i] === name) {
        return true;
      } else if (remove[i] === 'null' && !name) {
        return true;
      }
    }
    return false;
  }
  componentWillUpdate(prevProp) {
    if (prevProp.tile !== this.props.tile) {
      this.props.setUpdate(false)
    }
  }
  onSelect = (dates) => {
    this.setState({ dates })
  }

  render() {
    const { tile, slider, options, range } = this.state;
    return (
      <div>
        {tile &&
          <Row style={{ justifyContent: 'center', alignContent: 'center' }}>
            <p style={{ paddingLeft: '20px', paddingTop: '10px', paddingBottom: '10px' }}><font size="5">{tile.title}</font></p>
            <div style={{ marginLeft: 'auto', marginRight: '20px', marginTop: '5px' }}>
              <Buttons size='small' onClick={this.setSliders}>Edit</Buttons>
            </div>
            <div style={{ borderStyle: 'solid', padding: '15px', alignContent: 'center', justifyContent: 'center' }}>
              <Chart table={tile} eChartStyle={{ width: window.innerWidth - 600, height: (window.innerHeight / 2) + 100 }} />
            </div>
            <Modal
              title="Edit Data"
              visible={this.state.edit}
              onOk={this.handleOk}
              onCancel={() => this.setState({ edit: false })}
              width={700}
            >
              {slider.map((x, key) => (
                <Col key={key}>
                  <p>{x.name}</p>
                  <Slider marks={x.marks} key={key} min={x.min} max={x.max} range defaultValue={[x.value[0], x.value[1]]} onChange={(e) => this.onChange(e, key)} />
                </Col>
              ))}
              <hr />
              {(options.length > 1) &&
                <div>
                  Remove: <br />
                  <CheckboxGroup options={this.state.options} onChange={this.selectCheckbox} />
                </div>
              }
              {(options.length === 0) &&
                <div>
                  Range: <br />
                  <div>
                    <DateRangePicker
                      onSelect={this.onSelect}
                      value={this.state.dates}
                      numberOfCalendars={2}
                      minimumDate={(moment(range.date, 'MMM DD YYYY')._d)}
                      initialMonth={range.month}
                      initialYear={range.year}
                    />
                  </div>
                </div>
              }
            </Modal>
          </Row>
        }
        {tile &&
          <div style={{ marginLeft: '20px', marginRight: '20px', marginTop: '15px' }}>
            <Export tile={this.state.tile} update={this.state.update} descrip={this.state.descrip} />
          </div>}
      </div>
    );
  }
}
export default connect(
)(Display);