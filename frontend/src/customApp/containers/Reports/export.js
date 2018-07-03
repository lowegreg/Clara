import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Chart from '../../components/insightTile/chart';
import { Row, Col } from 'react-flexbox-grid';
import { Modal } from 'antd';
import Dropdown from '../../../components/uielements/dropdown';
import Menu from '../../../components/uielements/menu';
import Buttons from '../../../components/uielements/button';
import Table from '../../../components/uielements/table';

export default class ExportPDF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: false,
      excel: false,
      pdfTable: null
    };
  }

  printDocument = () => {
    const input = document.getElementById('divToPrint');
    // const table = this.state.pdfTable;
    console.log(this.state)
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        // pdf.autoTable(table.columns, table.data);
        pdf.save("download.pdf");
      })
      ;
  }

  onClick = (event) => {
    if(event.key === 'pdf'){
     this.setState({pdf: true})
    }
  }

  setTable = () => {
    const { tile } = this.props
    var columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    }];
    var dataSource = [];

    this.props.tile.options.series.map(x => {
      columns.push({
        title: x.name,
        dataIndex: x.name.toLowerCase(),
        key: x.name.toLowerCase(),
      })
    });

    // columns.map(x => {
    //   data[x.dataIndex] = null
    // })

    if (this.props.tile.graph === 'circleBar') {
      tile.options.radiusAxis.data.map((x, key) => {
        const data = new Object()
        data.name = x;
        data.key = key;
        dataSource.push(data)
        
      });
      tile.options.series.map(x => {
        for (let i = 0; i < dataSource.length; i++) {
          x.data[i] ?
          dataSource[i][`${x.name.toLowerCase()}`] = x.data[i] : dataSource[i][`${x.name.toLowerCase()}`] = null;
        }
      })
    }
    this.setState({pdfTable: {columns: columns, data: dataSource}})
  }

  componentDidMount(){
    if (this.props.tile.graph && !this.state.pdfTable) {
      this.setTable()
      console.log(this.props.tile)
    }
  }
  
  render() {
    console.log(this.state.pdfTable)
    const { pdfTable } = this.state;
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
          <div id="divToPrint" style={{
             borderStyle: 'solid',
             borderColor: '#f5f5f5',
            width: '210mm',
            minHeight: '297mm',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {this.props.tile &&
              <Row style={{ padding: '30px' }}>
                <p style={{ paddingLeft: '20px', paddingBottom: '10px' }}><font size="3"><b>{this.props.tile.title}</b></font></p>
                <div style={{ borderStyle: 'solid', padding: '15px', alignContent: 'left', justifyContent: 'left' }}>
                  <Chart table={this.props.tile} eChartStyle={{ width: 700, height: 380 }} />
                </div>
              </Row>
            }
            {this.state.pdfTable &&
            <Row style={{ padding: '30px' }}>
            <Table columns={pdfTable.columns} dataSource={pdfTable.data} pagination={false} style={{width: '100%'}} />
            </Row>
          }
          </div>
        </Modal>
      </div>);
  }
}