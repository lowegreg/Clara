import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import Chart from '../../components/insightTile/chart';
import { Row } from 'react-flexbox-grid';
import { Modal } from 'antd';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Dropdown from '../../../components/uielements/dropdown';
import Menu from '../../../components/uielements/menu';
import Buttons from '../../../components/uielements/button';
import Table from '../../../components/uielements/table';

export default class Export extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: false,
      excel: false,
      table: this.setTable(),
      update: this.props.update
    };
  }

  printDocument = () => {
    const { table } = this.state
    var firstPage = table.data.splice(0, 14);
    const input = document.getElementById('divToPrint');
    if (table.data.length > 14) {
      table.data.unshift(firstPage[13])
    }

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt');
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.autoTable(table.columns, firstPage,
          {
            margin: { top: 480 },
          }
        );
        if (table.data.length > 14) {
          pdf.autoTable(table.columns, table.data);
        }
        pdf.save(`${this.props.tile.title}.pdf`);
      })
      ;
  }

  onClick = (event) => {
    if (event.key === 'pdf') {
      this.setState({ pdf: true })
    } else if (event.key === 'excel') {
      this.setState({ excel: true })
    }
  }

  // parses tile and reformats the information to be compatible with the csv and pdf components
  setTable = () => {
    const { tile } = this.props
    var columns = [];
    var dataSource = [];
    var header = [];
    var content = [];
    var count = 0;
    var data;
    // Sets the title for the columns
    if (tile.graph.indexOf('Bar') > 0) {
      columns.push({
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      });
      for (let i = 0; i < tile.options.series.length; i++) {
        const x = tile.options.series[i];
        columns.push({
          title: x.name,
          dataIndex: x.name.toLowerCase(),
          key: x.name.toLowerCase(),
        });
      }
    } else {
      columns.push({
        title: tile.xName,
        dataIndex: tile.xName,
        key: tile.xName,
      }, {
          title: tile.yName,
          dataIndex: tile.yName,
          key: tile.yName,
        })
    }

    for (let i = 0; i < columns.length; i++) {
      header.push(
        columns[i].title,
      )
    }
    content.push(header);

    // parses data into the right category based on the type of graph
    if (tile.graph === 'circleBar') {
      for (let i = 0; i < tile.options.radiusAxis.data.length; i++) {
        const x = tile.options.radiusAxis.data[i];
        dataSource.push({
          name: x,
          key: i
        });
      }
      for (let i = 0; i < tile.options.series.length; i++) {
        const x = tile.options.series[i];
        for (let i = 0; i < dataSource.length; i++) {
          x.data[i] ?
            dataSource[i][`${x.name.toLowerCase()}`] = x.data[i] : dataSource[i][`${x.name.toLowerCase()}`] = null;
        }
      }
    } else if (tile.graph === 'multiBar') {
      for (let i = 0; i < tile.options.xAxis[0].data.length; i++) {
        data = {
          name: tile.options.xAxis[0].data[i],
          key: i + 1,
        }
        for (let j = 0; j < tile.options.series.length; j++) {
          const x = tile.options.series[j];
          data[x.name.toLowerCase()] = x.data[i]
        }
        dataSource.push(data)
      }
    } else if (tile.graph.toLowerCase().indexOf('line') > -1) {
      for (let i = 0; i < tile.options.xAxis.data.length; i++) {
        dataSource.push({
          [columns[0].title]: tile.options.xAxis.data[i],
          [columns[1].title]: tile.options.series[0].data[i],
          key: i + 1
        }
        )
      }
    } else if (tile.graph === 'pie') {
      for (let i = 0; i < tile.options.series[0].data.length; i++) {
        dataSource.push({
          [columns[0].title]: tile.options.series[0].data[i].name,
          [columns[1].title]: tile.options.series[0].data[i].value,
          key: i + 1,
        });
      }
    }

    // converts the data into csv format
    if (dataSource) {
      for (let i = 0; i < dataSource.length; i++) {
        const x = dataSource[i];
        data = []
        const key = Object.keys(x)
        for (let i = 0; i < key.length; i++) {
          if (key[i] !== 'key') {
            data[count] = x[key[i]]
            count++;
          }
        }
        count = 0;
        content.push(data);
      }
    }
    return { columns: columns, data: dataSource, csv: content }
  }

  componentWillUpdate(prevProp) {
    if (prevProp.update && !this.props.update) {
      this.setState({ table: this.setTable() })
    }
  }
  render() {
    const { table } = this.state;
    return (
      <div>
        <Dropdown overlay={
          <Menu onClick={this.onClick}>
            <Menu.Item key='excel'> Excel </Menu.Item>
            <Menu.Item key='pdf'> PDF </Menu.Item>
          </Menu>
        } >
          <Buttons size='small' icon='download' type='primary' >Download</Buttons>
        </Dropdown>
        <Modal
          title="Sample of a PDF"
          visible={this.state.pdf}
          onOk={this.printDocument}
          onCancel={() => this.setState({ pdf: false })}
          width={900}
        >
          <div style={{
            borderStyle: 'solid',
            borderColor: '#f5f5f5',
            width: '210mm',
            height: '297mm',
            marginLeft: 'auto',
            marginRight: 'auto',
            overflow: 'hidden'
          }}>
            {this.props.tile &&
              <Row id="divToPrint" style={{ padding: '30px' }}>
                <p style={{ paddingLeft: '20px', paddingBottom: '10px' }}><font size="3"><b>{this.props.tile.title}</b></font></p>
                <div style={{ borderStyle: 'solid', padding: '15px', alignContent: 'left', justifyContent: 'left' }}>
                  <Chart table={this.props.tile} eChartStyle={{ width: 700, height: 400 }} />
                </div>
              </Row>
            }
            {this.state.table &&
              <Row style={{ padding: '30px', height: '130' }}>
                <Table columns={table.columns} dataSource={table.data} pagination={false} style={{ width: '100%' }} />
              </Row>
            }
          </div>
        </Modal>
        <Modal
          title="Sample of data"
          visible={this.state.excel}
          onCancel={() => this.setState({ excel: false })}
          width={900}
          footer={[
            <Buttons key="back" onClick={() => this.setState({ excel: false })}>Cancel</Buttons>,
            <Buttons key="print" type='primary'>
              <CSVLink data={table.csv} filename={`${this.props.tile.title}.csv`}>Print</CSVLink>
            </Buttons>
          ]}
        >
          <Table columns={table.columns} dataSource={table.data} />
        </Modal>
      </div>);
  }
}