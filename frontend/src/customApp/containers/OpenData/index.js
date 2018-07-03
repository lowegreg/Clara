import React from 'react';
import DataCard from '../../components/dataCard';
import OpenDataPageWrapper from './style';
import { Input } from 'antd';
import SuperSelectField from 'material-ui-superselectfield'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Row, Col } from 'react-flexbox-grid';
import Box from '../../../components/utility/box';
const Search = Input.Search;

export default class OpenDataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tables: [{ key: 0, name: '', description: '', id: 0 }],
      filterTables: [{ key: 0, name: '', description: '', id: 0 }],
      search: '',
      filter: null,
      pageType: '',

    }
  }

  componentWillMount() {
    if (this.state.pageType.length === 0) {
      this.setState({ pageType: this.props.match.params.pageType })
    }
  }
  componentDidMount() {
    fetch('http://35.182.224.114:3000/tableLookUp?sourceType=' + this.state.pageType, { method: 'GET', mode: 'cors' })
      .then((response) => response.json())
      .then(responseJson => {
        responseJson.tableId.forEach(function (obj) { obj.key = responseJson.tableId });
        this.setState({ tables: responseJson.tableId, filterTables: responseJson.tableId })

      })
      .catch((error) => {
        console.error(error);
      });
  }

  select = (values, name) => {
    var filter = this.state.tables
    if (values == null) {
      filter = this.state.tables.filter(value => value.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0)
      this.setState({
        filter: null,
        filterTables: filter
      })
      return;
    }

    if (values.value === 'Rejected') {
      filter = this.state.tables.filter(value => value.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0 && value.statusId === 'rejected')
    } else if (values.value === 'Accepted') {
      filter = this.state.tables.filter(value => value.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0 && value.statusId === 'accepted')
    } else if (values.value === 'Not Submitted') {
      filter = this.state.tables.filter(value => value.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0 && value.statusId === null)
    } else {
      filter = this.state.tables.filter(value => value.name.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0 && value.statusId === "submitted")
    }

    // var filter=this.state.tables.filter(value=> value.status.indexOf(event.target.value.toLowerCase())>=0)
    this.setState({
      filter: values,
      filterTables: filter
    })
  }
  searchText(event) {

    var filter;
    if (this.state.filter === null) {
      filter = this.state.tables.filter(value => value.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0)
    } else {
      var filterWord
      if (this.state.filter.value === 'Rejected') {
        filter = this.state.tables.filter(value => value.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0 && value.statusId === 'rejected')
      } else if (this.state.filter.value === 'Accepted') {
        filterWord = 'accepted'
        filter = this.state.tables.filter(value => value.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0 && value.statusId === filterWord)
      } else if (this.state.filter.value === 'Not Submitted') {
        filter = this.state.tables.filter(value => value.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0 && value.statusId === null)
      } else {
        filterWord = 'submitted'
        filter = this.state.tables.filter(value => value.name.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0 && value.statusId === filterWord)
      }
    }

    this.setState({
      search: event.target.value,
      filterTables: filter
    })

  }
  render() {
    var stats = [
      {
        title: 'Total',
        number: this.state.tables.length,
        description: 'Number of total ' + this.state.pageType + ' data sets',
        colour: '#151596'
      },
      {
        title: 'Accepted',
        number: this.state.tables.filter(value => value.statusId === 'accepted').length,
        description: 'Number of accepted ' + this.state.pageType + ' data sets ready to be used by clara.',
        colour: 'green'
      },
      {
        title: 'Not Mapped',
        number: this.state.tables.filter(value => value.statusId === null).length,
        description: 'Number of unmapped ' + this.state.pageType + ' data sets',
        colour: '#bf0505'
      },
      {
        title: 'Under Review',
        number: this.state.tables.filter(value => value.statusId === 'submitted').length,
        description: 'Number of ' + this.state.pageType + ' data sets currently under review by clara',
        colour: 'orange'
      },
    ]
    console.log(this.state.filter)
    return (
      <div>
        <Row style={{ marginTop: '18px', width: '100%' }}>
          {stats.map((stat, key) => (
            <Col xs={3} key={key}>
              <Box>
                <h4>{stat.title}</h4>
                <h1 style={{ marginTop: '10px', color: stat.colour }}>{stat.number}</h1>
                <h5 style={{ color: 'grey' }}>{stat.description}</h5>
              </Box>
            </Col>
          ))
          }
        </Row>
        <OpenDataPageWrapper className='isoInvoicePageWrapper'>

          <Row>
            <Col xs={2}></Col>

            <Col xs={7} style={{ marginRight: '0px' }}>
              <Search
                placeholder="input search text"
                value={this.state.search}
                onChange={value => this.searchText(value)}
                style={{ width: '80%' }}
              />
            </Col><Col xs={1} style={{ marginLeft: '0px' }}>

              <MuiThemeProvider>
                <SuperSelectField
                  name={'Filter'}
                  hintText='Filter'
                  value={this.state.filter}
                  onChange={this.select}
                  style={{ minWidth: 150, margin: 10 }}
                >
                  <div value={'Accepted'}>Accepted</div>
                  <div value={'Submitted'}>Submitted</div>
                  <div value={'Rejected'}>Rejected</div>
                  <div value={'Not Submitted'}>Not Submitted</div>


                </SuperSelectField>
              </MuiThemeProvider>
            </Col>
          </Row>
          {this.state.filterTables.map((table, key) => (
            <div key={key} className='isoSimpleTable'>
              <DataCard data={table} />
            </div>
          ))
          }
        </OpenDataPageWrapper>
      </div>
    );
  }
}
