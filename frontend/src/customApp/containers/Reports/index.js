import React, { Component } from 'react';
import { connect } from 'react-redux';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import { Row } from 'react-flexbox-grid';
import Buttons from '../../../components/uielements/button';
import { Button } from 'antd';
import SuperSelectField from 'material-ui-superselectfield';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Chart from '../../components/insightTile/chart';
import ExportPDF from './export';

const ButtonGroup = Button.Group;
const categories = [
  { from: 'Stories', filter: 'Type', type: [{ label: 'Live', value: 1 }, { label: 'Open', value: 2 }, { label: 'Third Party', value: 3 }, { label: 'Imported', value: 4 }] },
  { from: 'Dashboards', filter: 'Title' },
  { from: 'Created Stories', filter: 'Type', type: [{ label: 'Clara Stories', value: 1 }, { label: 'User Stories', value: 2 }] },
];
const tempTile = {
  description: "Comparing STATUS to top 5 of STREET (or less then top 5)",
  graph: "multiBar",
  options: {
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    legend: { data: ["ACTIVE"], position: "bottom", type: "scroll" },
    series: [{ name: "ACTIVE", type: "bar", stack: "top", data: [1255, 1097, 1060, 1051, 1012, 978, 948, 871, 813, 755] }],
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: [{ type: "category", data: ["KING ST E", "BELMONT AVE W", "GREEN VALLEY DR", "KING ST W", "MARGARET AVE", "VICTORIA ST S", "QUEEN ST S", "FALLOWFIELD DR", "WILSON AVE", "COUNTRY HILL DR"], axisLabel: { interval: 0, rotate: -25 } }],
    yAxis: [{ type: "value" }]
  },
  tableName: "Addresses",
  tags: [{ name: "STATUS", route: "" }, { name: "STREET", route: "" }, { name: "multiBar", route: "" }],
  title: "STATUS Vs. STREET",
  widthOfCard: "100%",
  xName: "STATUS",
  yName: "STREET",
}
export class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: -1,
      type: null,
      tile: null,
      table: null,
      filter: null,
    };
  }
  selectCategory = (event) => {
    this.setState({
      activeCategory: event,
      type: null,
      tile: null,
      table: null
    })
    event === 1 ? this.setState({ filter: this.props.profile.dashboards }) : this.setState({ filter: categories[event].type })
  }
  selectType = (event) => {
    if (event) {
      this.setState({
        type: { value: this.state.filter, label: this.state.filter[event.value - 1].label },
        table: null,
        tile: null,
      })
    }
  }
  selectTable = (event) => {
    if (event) {
      if (this.state.activeCategory === 1) {
        const dash = this.state.filter.filter(data => data._id === event.value);
        if (dash && typeof dash[0].tiles === 'string') {
          dash[0].tiles = JSON.parse(dash[0].tiles)
        }
        this.setState({ table: { value: dash[0], label: dash[0].title }, activeTile: -1, tile: null })
      } else {
        this.setState({ table: { label: this.state.filter[event.value - 1].label, value: this.state.filter }, tile: null })
      }
    }
  }
  selectTile = (event) => {
    if (event) {
      if (this.state.activeCategory === 1) {
        const tile = this.state.table.value.tiles[event.value - 1]
        this.setState({ tile: { value: tile, label: tile.title } })
      }
      else {
        this.setState({ tile: { value: tempTile, label: tempTile.title } })
      }
    }
  }
  hintText = () => {
    const state = this.state;
    if (state.activeCategory % 2 === 0 && state.type === null) {
      return ``;
    } else if (state.activeCategory === -1) {
      return ``
    } else {
      return `Select Table`
    }
  }
  renderTableSelectField = () => {
    if (this.state.activeCategory === 1) {
      return (
        this.state.filter.map((data, index) => {
          return <div key={index} value={data._id}>{data.title}</div>
        }))
    } else if (this.state.type) {
      return (
        this.state.type.value.map((data, index) => {
          return <div key={index} value={data.value}>{data.label}</div>
        }))
    }
  }
  //this function may be removed in the future
  renderTileSelectField = () => {
    if (this.state.activeCategory === 1) {
      return (
        this.state.table.value.tiles.map((data, index) => {
          return <div key={index} value={index + 1}>{data.title}</div>
        }))
    } else if (this.state.type) {
      return (
        this.state.table.value.map((data, index) => {
          return <div key={index} value={data.value}>{data.label}</div>
        }))
    }
  }

  render() {
    const { activeCategory } = this.state;
    return (
      <LayoutContentWrapper style={{ paddingTop: '20px' }}>
        <h3 style={{ paddingBottom: '5px', paddingLeft: '3px' }}>Reports</h3>
        <LayoutContent>
          Please select category.
          <Row style={{ paddingLeft: '20px', paddingTop: '10px' }} >
            <p style={{ paddingRight: '20px', paddingTop: '3px' }} >From:</p>
            <ButtonGroup> {
              categories.map((category, key) => (
                <Buttons key={key} size='small' onClick={() => this.selectCategory(key)}>{category.from}</Buttons>
              ))
            }
            </ButtonGroup>
          </Row>

          {activeCategory % 2 === 0 &&
            <Row style={{ paddingLeft: '20px' }}>
              <p style={{ paddingRight: '20px', paddingTop: '12px' }} >Type:</p>
              <MuiThemeProvider>
                <SuperSelectField
                  name={'filter'}
                  hintText={activeCategory > -1 ? `Select Type` : ``}
                  value={this.state.type}
                  onChange={this.selectType}
                  style={{ minWidth: 150, margin: 10 }}
                >
                  {this.state.filter.map((data, index) => {
                    return <div key={index} value={data.value}>{data.label}</div>
                  })}
                </SuperSelectField>
              </MuiThemeProvider>
            </Row>
          }

          <Row style={{ paddingLeft: '20px' }}>
            <p style={{ paddingRight: '20px', paddingTop: '12px' }} >Table:</p>
            <MuiThemeProvider>
              <SuperSelectField
                name={'filter'}
                hintText={this.hintText()}
                value={this.state.table}
                onChange={this.selectTable}
                style={{ minWidth: 150, margin: 10 }}
              >
                {this.renderTableSelectField()}
              </SuperSelectField>
            </MuiThemeProvider>
          </Row>

          <Row style={{ paddingLeft: '20px' }}>
            <p style={{ paddingRight: '23px', paddingTop: '12px' }} >Tile:</p>
            <MuiThemeProvider>
              <SuperSelectField
                name={'filter'}
                hintText={this.state.table !== null ? `Select Tile` : ''}
                value={this.state.tile}
                onChange={this.selectTile}
                style={{ minWidth: 150, margin: 10 }}
              >
                {this.state.table !== null &&
                  this.renderTileSelectField()
                }
              </SuperSelectField>
            </MuiThemeProvider>
          </Row>
          {this.state.tile &&
            <Row style={{ justifyContent: 'center', alignContent: 'center' }} >
              <p style={{ paddingLeft: '20px', paddingTop: '10px', paddingBottom: '10px' }}><font size="5">{this.state.tile.value.title}</font></p>
              <div style={{ marginLeft: 'auto', marginRight: '20px', marginTop: '5px' }}>
                <Buttons size='small'>Edit</Buttons>
              </div>
              <div style={{ borderStyle: 'solid', padding: '15px', alignContent: 'center', justifyContent: 'center' }}>
                <Chart table={this.state.tile.value} eChartStyle={{ width: window.innerWidth - 600, height: (window.innerHeight / 2) + 100 }} />
              </div>
            </Row>
          }
          <div style={{ marginLeft: 'auto', marginRight: '20px', marginTop: '10px' }}>
            {this.state.tile ?
              <ExportPDF tile={this.state.tile.value} />
              : <Buttons size='small' icon='download' disabled >Download</Buttons>}
          </div>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}
export default connect(
  state => ({
    profile: state.Auth.get('profile'),
    jwt: state.Auth.get('idToken')
  }),
)(Reports);