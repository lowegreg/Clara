import React, { Component } from 'react';
import { connect } from 'react-redux';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import { Row } from 'react-flexbox-grid';
import Buttons from '../../../components/uielements/button';
import { Button } from 'antd';
import SuperSelectField from 'material-ui-superselectfield';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Display from './display';
import * as func from '../../pageFunctions';

const ButtonGroup = Button.Group;
const categories = [
  { from: 'Stories', type: [{ label: 'Live', value: 1 }, { label: 'Open', value: 2 }, { label: 'Third Party', value: 3 }, { label: 'Imported', value: 4 }] },
  { from: 'Dashboards' },
  { from: 'Created Stories', type: [{ label: 'Clara Stories', value: 1 }, { label: 'User Stories', value: 2 }] },
];

export class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: -1,
      type: null,
      tile: null,
      table: null,
      update: false,
      showTiles: false,
      message: '',
      typeArray: [],
      tableArray: [],
      tileArray: [],
      tileDataArray: [],
      loading: 0,
      time: Date.now(),
    };
  }
  selectCategory = (event) => {
    this.setState({
      activeCategory: event,
      props: null,
      type: null,
      tile: null,
      table: null,
      graph: null,
      showTiles: false,
      typeArray: [],
      tableArray: [],
      tileArray: [],
      tileDataArray: [],
      message: '',
    })
    event === 1 ? this.setState({ tableArray: this.props.profile.dashboards }) : this.setState({ typeArray: categories[event].type })
  }
  selectType = (event) => {
    if (event && typeof event.value === 'number') {
      fetch('http://35.182.224.114:3000/tableLookUp?statusId=accepted&getNames=true&sourceType=' + this.state.typeArray[event.value - 1].label, { method: 'GET', mode: 'cors' })
        .then((response) => response.json())
        .then(responseJson => {
          this.setState({
            type: { value: responseJson.tableId.map(a => a.name), label: this.state.typeArray[event.value - 1].label },
            tableArray: responseJson.tableId,
            table: null,
            tile: null,
            tileArray: [],
            tileDataArray: [],
            showTiles: false,
            loading: 0
          })
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.setState({
        tileArray: [],
        tileDataArray: [],
        tableArray: [],
        table: null,
        showTiles: false,
        loading: 0,
      })
    }
  }

  fetchData(url, i, title, props) {
    fetch(url, { method: 'GET', mode: 'cors' })
      .then((response) => response.json())
      .then(responseJson => {
        var results = responseJson.id
        results = func.removeNull(results)
        this.setState({ loading: this.state.loading + 1 })
        if (results.length > 1) {
          // this.setState({graphFull:this.state.graphFull+1})
          var x = results.map(data => data.x);
          var y = results.map(data => data.y);
          var z = results.map(data => data.z) || null;
          if (y.filter((v, i, a) => a.indexOf(v) === i).length > 1) {
            var dataOut = func.formatData(props[i], x, y, z)
            var tempTileArray = this.state.tileArray
            tempTileArray.push(title)
            var tempTileDataArray = this.state.tileDataArray
            tempTileDataArray.push(dataOut)
            var show = false
            var message = 'loading...'
            if (this.state.loading === props.length) {
              show = true
              message = ''
            }

            this.setState({
              tileArray: tempTileArray,
              showTiles: show,
              message: message,
              tileDataArray: tempTileDataArray
            })
          } else if (this.state.loading === props.length && this.state.tileArray.length === 0) {
            this.setState({ message: 'No tiles for this data set.' })
          } else if (this.state.loading === props.length) {
            this.setState({ showTiles: true })
          }
        } else if (this.state.loading === props.length && this.state.tileArray.length === 0) {
          this.setState({ message: 'No tiles for this data set.' })
        } else if (this.state.loading === props.length) {
          this.setState({ showTiles: true })
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  generateTitles(graphObject) {
    var titles = []
    // titles.push({name:`${graphObject[i].x} Vs.  ${graphObject[i].y}`, value:i})
    for (var i = 0; i < graphObject.length; i++) {
      titles.splice(i, 1, { name: `${graphObject[i].x} Vs.  ${graphObject[i].y}`, value: i })
    }
    return titles
  }
  selectTable = (event) => {
    if (event) {
      if (this.state.activeCategory === 1 && event.value !== event.label) {
        const dash = this.state.tableArray.filter(data => data._id === event.value);
        if (dash && typeof dash[0].content === 'string') {
          dash[0].content = JSON.parse(dash[0].content)
        }
        var tiles;
        if (dash[0].content) {
          tiles = dash[0].content.filter(data => data.contentType !== 'card')
        } else {
          tiles = []
        }
        this.setState({ table: { value: dash[0].title, label: dash[0].title }, tileArray: tiles, tile: null, showTiles: true })
      } else if (this.state.activeCategory !== 1) {
        this.setState({
          tileArray: [],
          tileDataArray: [],
          showTiles: false,
          loading: 0
        })
        var url = 'http://35.182.224.114:3000/dataManagement/getProps?tableName=' + event.value
        fetch(url, { method: 'GET', mode: 'cors' })
          .then((response) => response.json())
          .then(responseJson => {
            var props = func.catPropsFunction(responseJson.id)
            var possibleTiles = this.generateTitles(props)

            for (var i = 0; i < props.length; i++) {
              var url = 'http://35.182.224.114:3000/selectGraphData?tableName=' + event.value + '&x=' + props[i].x + '&y=' + props[i].y + '&xType=' + props[i].xType + '&yType=' + props[i].yType
              this.fetchData(url, i, possibleTiles[i], props)
            }
            this.setState({
              table: { value: event.value, label: event.label },
              tile: null
            })
          })
          .catch((error) => {
            console.error(error);
          })
      } else {
        this.setState({
          tileArray: [],
          tileDataArray: [],
          showTiles: false,
          loading: 0,
          tile: null,
          table: null
        })
      }
    } else {
      this.setState({
        tileArray: [],
        tileDataArray: [],
        showTiles: false,
        loading: 0,
        tile: null,
        table: null
      })
    }
  }

  selectTile = (event) => {
    if (event && event.value !== undefined) {
      if (this.state.activeCategory === 1) {
        const tile = this.state.tileArray[event.value]
        this.setState({ tile: { value: tile.value, label: tile.title }, graph: tile, update: true })
      }
      else {
        this.setState({ tile: { value: event.value, label: event.label }, graph: this.state.tileDataArray[event.value], update: true })
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
    if (this.state.tableArray.length === 0) { return this.state.tableArray }
    var value = 'name'
    var label = 'name'
    if (this.state.activeCategory === 1) {
      value = '_id'
      label = 'title'
    }
    return (
      this.state.tableArray.map((data, index) => {
        return <div key={index} value={data[value]} label={data[label]}>{data[label]}</div>
      }))

  }
  renderTileSelectField = () => {
    if (this.state.tileArray.length === 0) {
      return this.state.tileArray
    }
    var label = 'name'
    if (this.state.activeCategory === 1) {
      label = 'title'
    }
    return (
      this.state.tileArray.map((data, index) => {
        return <div key={index} value={index} label={data[label]}>{data[label]}</div>
      }))

  }
  setUpdate = (update) => {
    this.setState({ update: update })
    this.interval = setTimeout(() => this.setState({ update: true }), 10);
  }
  componentWillUnmount() {
    clearInterval();
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
                  name={'Type'}
                  hintText={activeCategory > -1 ? `Select Type` : ``}
                  value={this.state.type}
                  onChange={this.selectType}
                  style={{ minWidth: 250, margin: 10 }}
                >
                  {this.state.typeArray.map((data, index) => {
                    return <div key={index} value={data.value} label={data.label}>{data.label}</div>
                  })}
                </SuperSelectField>
              </MuiThemeProvider>
            </Row>
          }

          <Row style={{ paddingLeft: '20px' }}>
            <p style={{ paddingRight: '16px', paddingTop: '12px' }} >Table:</p>
            <MuiThemeProvider>
              <SuperSelectField
                name={'Table'}
                hintText={this.hintText()}
                value={this.state.table}
                onChange={this.selectTable}
                style={{ minWidth: 250, margin: 10 }}
              >
                {this.renderTableSelectField()}
              </SuperSelectField>
            </MuiThemeProvider>
          </Row>

          <Row style={{ paddingLeft: '20px' }}>
            <p style={{ paddingRight: '28px', paddingTop: '12px' }} >Tile:</p>
            <MuiThemeProvider>
              <SuperSelectField
                name={'Tile'}
                hintText={this.state.showTiles !== false ? `Select Tile` : ''}
                value={this.state.tile}
                onChange={this.selectTile}
                style={{ minWidth: 250, margin: 10 }}
              >
                {this.renderTileSelectField()}
              </SuperSelectField>
            </MuiThemeProvider>
            <p style={{ paddingRight: '20px', paddingTop: '12px' }} >{this.state.message}</p>

          </Row>
          {this.state.update === true &&
            <Display
              tile={this.state.graph} setUpdate={this.setUpdate} />
          }

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