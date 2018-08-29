import React, { Component } from 'react';
import SuperSelectField from 'material-ui-superselectfield';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Row, Col } from 'react-flexbox-grid';
import Input from '../../../components/uielements/input';
import Form from '../../../components/uielements/form';
import Button from '../../../components/uielements/button';
import Box from '../../../components/utility/box';
import Tile from '../../components/insightTile/index2';
import { Modal } from 'antd';
import { getOptions } from './options'
import TagsInput from 'react-tagsinput'
import './styles.css'


const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 16 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
    },
};

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                d1: {
                    typeData: null,
                    dataSet: null,
                    property: null,
                },
                d2: {
                    typeData: null,
                    dataSet: null,
                    property: null
                },
                title: null,
                description: null,
                tag: [],
                graphType: null,
            },
            typeDataArray: ['Live', 'Open', 'Third Party', 'Imported'],
            dataSet1Array: [],
            dataSet2Array: [],
            property1Array: [],
            property2Array: [],
            graphTypeArray: ['Line Graph', 'Bar Graph', 'Pie Graph', 'Circle Bar Graph'],
            showGraph: false,
            tags: [],
            error: ''
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(tags) {
        var temp = this.state.form;
        temp.tag = tags
        this.setState({ form: temp })
    }
    getOpenData(data) {
        var url = 'http://35.182.224.114:3000/tableLookUp?getNames=true&sourceType=open'
        fetch(url, { method: 'GET', mode: 'cors' })
            .then((response) => response.json())
            .then(responseJson => {
                this.setState({
                    [data]: responseJson.tableId// this will be loaded from api
                })
            })
            .catch((error) => {
                console.error(error);
            })
    }
    getDataSetArray(type, data) {
        if (type === 'Open') {
            this.getOpenData(data);
        } else if (type === 'Live') {
            this.setState({
                [data]: [{ name: 'Weather' }, { name: 'StormPath' }, { name: 'Traffic' }]
            })

        } else if (type === 'Third Party') {
            this.setState({
                [data]: [{ name: 'Facebook' }, { name: 'Twitter' }]
            })
        } else if (type === 'Imported') {
            this.setState({
                [data]: [{ name: 'Google Analytics' }, { name: 'Tradeworks' }]
            })
        } else {
            this.setState({
                [data]: [{ name: 'test' }, { name: 'test2' }]
            })
        }
        return
    }

    getProps(title, prop) {
        var url = 'http://35.182.224.114:3000/dataManagement/getProps?tableName=' + title
        fetch(url, { method: 'GET', mode: 'cors' })
            .then((response) => response.json())
            .then(responseJson => {
                this.setState({
                    [prop]: responseJson.id// this will be loaded from api
                })
            })
            .catch((error) => {
                console.error(error);
            })
    }
    inputText(event) {
        var form = this.state.form
        form[event.target.id] = event.target.value
        this.setState({
            form: form
        })
    }
    typeOfDataSelected = (values, name) => {
        var form = this.state.form;
        var data = 'dataSet1Array'
        if (name === 'typeData1') {
            form.d1.typeData = values
            if (form.d1.property){
                this.state.form.tag.splice(this.state.form.tag.indexOf(form.d1.property.label), 1);
            }
            form.d1.dataSet = null
            form.d1.property = null
            this.setState({
                property1Array: [],
                dataSet1Array: [],
            })
        } else {
            data = 'dataSet2Array'
            form.d2.typeData = values
            if (form.d2.property){
                this.state.form.tag.splice(this.state.form.tag.indexOf(form.d2.property.label), 1);
            }
            form.d2.dataSet = null
            form.d2.property = null
            this.setState({
                property2Array: [],
                dataSet2Array: []
            })
        }

        this.setState({
            form: form,
        })

        // // get data set that are of type ===value
        if (values !== null) {
            this.getDataSetArray(values.value, data)
        }
    }
    dataSetSelected = (values, name) => {
        var form = this.state.form
        var prop = 'property1Array'
        var hardCode = false
        if (name === 'dataSet1') {
            form.d1.dataSet = values
            if (form.d1.property){
                this.state.form.tag.splice(this.state.form.tag.indexOf(form.d1.property.label), 1);
            }
            form.d1.property = null
            this.setState({
                property1Array: []
            })
            if (form.d1.typeData.value === 'Live' || form.d1.typeData.value === 'Third Party' || form.d1.typeData.value === 'Imported') {
                hardCode = true
            }
        } else {
            prop = 'property2Array'
            form.d2.dataSet = values
            if (form.d2.property){
                this.state.form.tag.splice(this.state.form.tag.indexOf(form.d2.property.label), 1);
            }
            form.d2.property = null
            this.setState({
                property2Array: []
            })
            if (form.d2.typeData.value === 'Live' || form.d2.typeData.value === 'Third Party' || form.d2.typeData.value === 'Imported') {
                hardCode = true
            }
        }
        this.setState({
            form: form
        })
        // // get props for values table
        if (hardCode) {
            this.setState({
                [prop]: [{ propId: 'Date' }, { propId: 'level' }]
            })

        } else if (values !== null) {
            this.getProps(values.value, prop)
        }


        // this.setState({
        //     [prop]:['id', 'addresses', 'name']// this will be loaded from api
        // })
        // set prop array
    }
    selected = (values, name) => {
        var form = this.state.form

        if (name === 'property1') {
            if (form.d1.property != null) {
                var index = form.tag.indexOf(form.d1.property.label);
                if (index !== -1) form.tag.splice(index, 1);
            }
            form.d1.property = values
        } else if (name === 'property2') {
            if (form.d2.property != null) {
                var index2 = form.tag.indexOf(form.d2.property.label);
                if (index2 !== -1) form.tag.splice(index2, 1);
            }
            form.d2.property = values
        }
        if (name === 'property1' || name === 'property2') {
            if (values != null) form.tag.push(values.label)

            this.setState({
                form: form,
            })
            return
        }
        if (form[name] != null) {
            var index3 = form.tag.indexOf(form[name].value);
            if (index3 !== -1) form.tag.splice(index3, 1);
        }
        form[name] = values
        if (values != null) form.tag.push(values.value)
        this.setState({
            form: form,
        })

        // save it
    }
    error() {
        var errorMessage = 'Error'
        if (this.state.form.d1.property === null || this.state.form.d2.property === null) {
            errorMessage = 'Error: Please select two properties'
        } else if (this.state.form.title === null) {
            errorMessage = 'Error: Please enter a title'
        } else if (this.state.form.description === null) {
            errorMessage = 'Error: Please enter a description'
        } else if (this.state.form.tag.length === 0) {
            errorMessage = 'Error: Please enter a some tags'
        } else if (this.state.form.graphType === null) {
            errorMessage = 'Error: Please select a graph type'
        }
        this.setState({
            error: errorMessage
        })



    }
    submit() {
        if (this.state.form.graphType === null || this.state.form.d1.property === null || this.state.form.d2.property === null || this.state.form.title === null || this.state.form.description === null || this.state.form.tag.length === 0) {

            this.error()
            return;
        }
        this.setState({
            error: ''
        })
        // get data for x and y via api call

        // var graph = {
        //     title: this.state.form.title,
        //     description: this.state.form.description,
        //     tags: this.state.form.tag,
        //     // x:,
        //     // y:,
        //     // z:,
        //     xName: this.state.form.d1.property.value.propId,
        //     yName: this.state.form.d2.property.value.propId,
        //     xType: this.state.form.d1.property.value.dataTypes,
        //     yType: this.state.form.d2.property.value.dataTypes,
        // }

        this.setState({
            showGraph: true
        })
    }
    handleOk() {
        this.setState({
            showGraph: false
        })
    }
    handleCancel() {
        this.setState({
            showGraph: false
        })
    }


    render() {

        return (
            <div style={{ alignContent: 'center', alignItems: 'ceter', justifyContent: 'center', flex: 1, marginLeft: '16px', marginTop: '16px', marginBottom: '16px', marginRight: '16px', width: '94%' }}>
                <Modal
                    wrapClassName="vertical-center-modal"
                    title="Preview"
                    visible={this.state.showGraph}
                    onOk={this.handleOk}
                    //   confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                    width={900}
                    okText="Save"
                    destroyOnClose

                >
                    <Tile table={{ title: this.state.form.title, tags: this.state.form.tag, options: getOptions(this.state.form.graphType), description: this.state.form.description }} />
                </Modal>
                <h2>Create a New Story</h2>
                <h4>Select two datasets and one property for each dataset</h4>
                <Box>
                    <Row style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Col xs={3} style={{ marginRight: '16px' }} >
                            <MuiThemeProvider>
                                <SuperSelectField
                                    name={'typeData1'}
                                    hintText={'Type of Data'}
                                    value={this.state.form.d1.typeData}
                                    onChange={this.typeOfDataSelected}
                                    style={{ minWidth: 150, margin: 10 }}
                                >
                                    {this.state.typeDataArray.map((data, index) => {
                                        return <div key={index} value={data}>{data}</div>
                                    })}

                                </SuperSelectField>
                            </MuiThemeProvider>
                        </Col>
                        <Col xs={4} style={{ marginRight: '16px' }}>
                            <MuiThemeProvider>
                                <SuperSelectField
                                    name={'dataSet1'}
                                    hintText={'Dataset'}
                                    value={this.state.form.d1.dataSet}
                                    onChange={this.dataSetSelected}
                                    style={{ minWidth: 150, margin: 10 }}
                                >
                                    {this.state.dataSet1Array.map((data, index) => {
                                        return <div key={index} value={data.name}>{data.name}</div>
                                    })}
                                </SuperSelectField>
                            </MuiThemeProvider>
                        </Col>

                        <Col xs={4} style={{ marginRight: '16px' }}>
                            <MuiThemeProvider>
                                <SuperSelectField
                                    name={'property1'}
                                    hintText={'Property'}
                                    value={this.state.form.d1.property}
                                    onChange={this.selected}
                                    style={{ minWidth: 150, margin: 10 }}
                                >
                                    {this.state.property1Array.map((data, index) => {
                                        return <div key={index} value={data} label={data.propId}>{data.propId}</div>
                                    })}
                                </SuperSelectField>
                            </MuiThemeProvider>
                        </Col>
                    </Row>
                    <Row style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>vs.</Row>
                    <Row style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Col xs={3} style={{ marginRight: '16px' }}>
                            <MuiThemeProvider>
                                <SuperSelectField
                                    name={'typeData2'}
                                    hintText={'Type of Data'}
                                    value={this.state.form.d2.typeData}
                                    onChange={this.typeOfDataSelected}
                                    style={{ minWidth: 150, margin: 10 }}
                                >
                                    {this.state.typeDataArray.map((data, index) => {
                                        return <div key={index} value={data}>{data}</div>
                                    })}

                                </SuperSelectField>
                            </MuiThemeProvider>
                        </Col>

                        <Col xs={4} style={{ marginRight: '16px', alignItems: 'left' }}>
                            <MuiThemeProvider>
                                <SuperSelectField
                                    name={'dataSet2'}
                                    hintText={'Dataset'}
                                    value={this.state.form.d2.dataSet}
                                    onChange={this.dataSetSelected}
                                    style={{ minWidth: 150, margin: 10 }}
                                >
                                    {this.state.dataSet2Array.map((data, index) => {
                                        return <div key={index} value={data.name}>{data.name}</div>
                                    })}

                                </SuperSelectField>
                            </MuiThemeProvider>
                        </Col>

                        <Col xs={4} style={{ marginRight: '16px' }}>
                            <MuiThemeProvider>
                                <SuperSelectField
                                    name={'property2'}
                                    hintText={'Property'}
                                    value={this.state.form.d2.property}
                                    onChange={this.selected}
                                    style={{ minWidth: 150, margin: 10 }}
                                >
                                    {this.state.property2Array.map((data, index) => {
                                        return <div key={index} value={data} label={data.propId}>{data.propId}</div>
                                    })}

                                </SuperSelectField>
                            </MuiThemeProvider>
                        </Col>

                    </Row>
                    <Row style={{ marginTop: '16px', alignContent: 'center', alignItems: 'ceter', justifyContent: 'center', flex: 1, }}>
                        <Col xs={8}>
                            <FormItem
                                {...formItemLayout}
                                label='Story Details'
                                hasFeedback
                            >
                                <Input placeholder="Enter title" id="title" defaultValue='title' value={this.state.form.title} onChange={event => this.inputText(event)} />
                                <Input placeholder="Enter description" id="description" defaultValue='title' value={this.state.form.description} onChange={event => this.inputText(event)} />
                                {/* <Input placeholder="Enter tag" id="tag" defaultValue='title' value={this.state.form.tag} onChange={event => this.inputText(event)} /> */}
                                <TagsInput inputProps={{ className: 'react-tagsinput-input', placeholder: 'Enter tags' }} value={this.state.form.tag} onChange={this.handleChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={{ marginLeft: '16px', alignItems: 'left', justifyContent: 'left', flex: 1 }}>
                        <Col>
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.submit();
                                }}
                                className="nextPage"
                                color='#92add1'

                            >
                                Submit
                    </Button>
                        </Col>
                        <Col xs={3}>
                            <MuiThemeProvider>
                                <SuperSelectField
                                    name={'graphType'}
                                    hintText={'Graph type'}
                                    value={this.state.form.graphType}
                                    onChange={this.selected}
                                    style={{ minWidth: 150, margin: 10 }}
                                >
                                    {this.state.graphTypeArray.map((data, index) => {
                                        return <div key={index} value={data}>{data}</div>
                                    })}

                                </SuperSelectField>
                            </MuiThemeProvider>
                        </Col>
                        <Col>
                            <p style={{ color: 'red', fontWeight: 'bold', marginLeft: '16px' }}>{this.state.error}</p>
                        </Col>

                    </Row>

                </Box>



            </div>
        );
    }
}