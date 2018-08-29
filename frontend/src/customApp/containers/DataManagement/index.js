import React, { Component } from 'react';
import Button from '../../../components/uielements/button';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Box from '../../../components/utility/box';
import SuperSelectField from 'material-ui-superselectfield'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { connect } from 'react-redux';
import Input from '../../../components/uielements/input';
import Form from '../../../components/uielements/form';
import { Modal } from 'antd';
import './styles.css';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 16 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 13 },
        sm: { span: 13 },
    },
};
var headersValue = {
    'Accept': 'application/x-www-form-urlencoded',
    'Content-Type': 'application/x-www-form-urlencoded',
}
class DataManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            table: [], // the list of all the properties and thier values
            category: ['Number', 'Text', 'Date', 'Location'],// the categories that appear in the category dropdown
            number: [],//array of data types for number category dropdown
            date: [], // array of data type for date categoyry dropdown
            text: [], // array of data type for text categoyry dropdown
            location: [], // array of data type for location categoyry dropdown
            typeDropdown: [], // array that is used to popluate the last dropdown data type depending on what was selected in the category dropdown
            tag: '', // the value of the default tag text box
            tableName: '', // the name of the data set being worked on
            submited: false, // status if it was succefuly added to the database
            pointError: '', // error message
            visible: false, // if the new data type module popup is open or not
            newTypeCat: null, // the value of category drop down from module popup
            dataTypeInput: '', // the value of datatype text box from module popup
            feedback: '', // the reason the data maping was rejected by an admin  
            preview: false, // the status if the preview module is open or not
            previewData: [], // object full of 4 rows of the dataset
            previewHeaders:[]
        }
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    showPreview = () => {
        var query = 'http://35.182.224.114:3000/getPreview?tableName=' + this.state.tableName
        fetch(query, { method: 'GET', mode: 'cors' })
            .then((response) => response.json())
            .then(responseJson => {
                this.setState({ preview: true, previewData: responseJson.rows, previewHeaders: Object.keys(responseJson.rows[0]) })
            })
            .catch((error) => {
                console.error(error);
            });

    }
    handleOk = (e) => {
        var temp = []
        if (this.state.newTypeCat === null || this.state.dataTypeInput === '') {
            // create error message
            return;
        }
        if (this.state.newTypeCat.value === 'Number') {
            temp = this.state.number
            temp.push(this.state.dataTypeInput)
            this.setState({ number: temp })
        } else if (this.state.newTypeCat.value === 'Text') {
            temp = this.state.text
            temp.push(this.state.dataTypeInput)
            this.setState({ text: temp })
        } else if (this.state.newTypeCat.value === 'Date') {
            temp = this.state.date
            temp.push(this.state.dataTypeInput)
            this.setState({ date: temp })
        } else if (this.state.newTypeCat.value === 'Location') {
            temp = this.state.location
            temp.push(this.state.dataTypeInput)
            this.setState({ location: temp })
        }
        this.setState({
            visible: false,
        });
        return true
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    setTable(props) {
        if (!props) { return [] }
        var tableArray = []
        for (var i = 0; i < props.length; i++) {
            var values = [];
            if (props[i].dataTypes) {
                values = props[i].dataTypes.replace(/ +$/, "").split('-')
            }

            var object = {
                property: props[i].propId,
                category: {
                    value: { value: values[0], label: undefined },
                    name: 'cat-' + i
                },
                type: {
                    value: { value: values[1], label: undefined },
                    name: 'type-' + i
                }
            }
            tableArray.push(object)
        }
        this.setState({ table: tableArray })
    }
    setData(data) {
        var number = []
        var date = []
        var text = []
        var location = []
        data.map((props, index) => {
            if (props.category === 'Text') {
                text.push(props.dataType)
            } else if (props.category === 'Number') {
                number.push(props.dataType)
            } else if (props.category === 'Date') {
                date.push(props.dataType)
            } else if (props.category === 'Location') {
                location.push(props.dataType)
            }
            return [];
        })

        this.setState({
            number: number,
            text: text,
            date: date,
            location: location,

        });
    }
    componentDidMount() {
        var query = 'http://35.182.224.114:3000/dataManagement/getProps?tableName=' + this.state.tableName
        fetch(query, { method: 'GET', mode: 'cors' })
            .then((response) => response.json())
            .then(responseJson => this.setTable(responseJson.id))
            .catch((error) => {
                console.error(error);
            });
        query = 'http://35.182.224.114:3000/tableLookUp?tableName=' + this.state.tableName + '&sourceType=open'
        fetch(query, { method: 'GET', mode: 'cors' })
            .then((response) => response.json())
            .then(responseJson =>{
                var feedback= ''
                if (responseJson.tableId[0]) feedback= responseJson.tableId[0].feedback
                this.setState({ feedback: feedback })
            } )
            .catch((error) => {
                console.error(error);
            });

        fetch('http://35.182.224.114:3000/dataManagement/getDataTypes', { method: 'GET', mode: 'cors' })
            .then((response) => response.json())
            .then(responseJson => this.setData(responseJson.id))
            .catch((error) => {
                console.error(error);
            });
    }
    componentWillMount() {
        if (this.state.tableName === '') {
            this.setState({ tableName: this.props.match.params.tableName })
        }
    }
    inputTag(event) {
        this.setState({ tag: event.target.value });
    }
    inputType(event) {
        this.setState({ dataTypeInput: event.target.value });
    }
    newDataTypeSelection = (values, name) => {
        this.setState({ newTypeCat: values })
    }
    submit() {
        this.setState({ pointError: '' });
        var formBody;
        for (var i = 0; i < this.state.table.length; i++) {
            if (this.state.table[i].type.value.value === null||this.state.table[i].type.value.value === undefined) {
                this.setState({ pointError: 'Please map all fields' });
                return;
            }
        }
        
        if (this.state.tag === '') { this.setState({ pointError: 'Please enter a default tag for this data set' }); return }
        this.state.table.map((input, index) => {
            formBody = 'propId=' + input.property + '&dataType=' + input.category.value.value + '-' + input.type.value.value + '&tableName=' + this.state.tableName;

            fetch('http://35.182.224.114:3000/dataManagement/postPropsDataTypes', { method: 'POST', headers: headersValue, mode: 'cors', body: formBody })
                .then((response) => response.json())
                .then(responseJson => this.setState({ submited: true }))
                .catch((error) => {
                    console.error(error);
                });
            return [];
        })

        formBody = 'tagName=' + this.state.tag + '&tableName=' + this.state.tableName + '&user=' + this.props.profile.email;
        fetch('http://35.182.224.114:3000/dataManagement/postDefaultTags', { method: 'POST', headers: headersValue, mode: 'cors', body: formBody })
            .then((response) => response.json())
            .then(responseJson => this.setState({ submited: true }))
            .catch((error) => {
                console.error(error);
            });

    }
    handleSelection = (values, name) => {
        var [stage, num] = name.split('-');
        var number = parseInt(num, 10)
        var tempTable = this.state.table;
        var tempRow = this.state.table[number];
        if (stage === 'cat') {
            tempRow.category.value = values
            tempRow.type.value = null
            var tempDropDown = this.state.typeDropdown;
            if (values) {
                tempDropDown[number] = values.value
            }
            this.setState({ typeDropdown: tempDropDown });
        } else {
            tempRow.type.value = values
        }
        tempTable[number] = tempRow;
        this.setState({ table: tempTable });
    }
    dropDown(handleSelection, state, name, hintText, stateIndex, dropDown) {
        var dataArray = []
        if (dropDown === 'cat') {
            dataArray = this.state.category
        } else {
            if (this.state.typeDropdown[stateIndex] === 'Date') {
                dataArray = this.state.date
            } else if (this.state.typeDropdown[stateIndex] === 'Text') {
                dataArray = this.state.text
            } else if (this.state.typeDropdown[stateIndex] === 'Number') {
                dataArray = this.state.number
            } else if (this.state.typeDropdown[stateIndex] === 'Location') {
                dataArray = this.state.location
            } else {
                dataArray = []
            }
        }

        return (
            <MuiThemeProvider>
                <SuperSelectField
                    name={name}
                    hintText={hintText}
                    value={state}
                    onChange={handleSelection}
                    style={{ minWidth: 150, margin: 10 }}
                >
                    {dataArray.map((data, index) => {
                        return <div key={index} value={data}>{data}</div>
                    })}
                </SuperSelectField>
            </MuiThemeProvider>
        )
    }
    header() {
        return (
            <Row style={{ backgroundColor: "#fff", borderBottom: '1px solid #adb2ba', }}>
                <Col xs={3}>
                    <h4 style={{ color: '#646466' }}>
                        Propterties
                </h4>
                </Col>
                <Col xs={3}>
                    <h4 style={{ color: '#646466' }}>
                        Category
                </h4>
                </Col>
                <Col xs={6}>
                    <h4 style={{ color: '#646466' }}>
                        Data type
                </h4>
                </Col>
            </Row>
        )
    }
    tableRow(handleSelection, data, index, catLabels) {
        return (
            <Row style={{ backgroundColor: "#fff", borderBottom: '1px solid #adb2ba', alignItems: 'center', justifyContent: 'center', flex: 1 }} key={index} >
                <Col xs={3}>
                    <div>
                        {data.property}
                    </div>
                </Col>
                <Col xs={3}>
                    {this.dropDown(handleSelection, data.category.value, data.category.name, 'select a category', index, 'cat')}
                </Col>
                <Col xs={6}>
                    {this.dropDown(handleSelection, data.type.value, data.type.name, 'select a data type', index, 'type')}
                </Col>
            </Row>
        )
    }
    previewRow(i) {
        if (this.state.previewData.length === 0) return []
        var row = Object.values(this.state.previewData[i])
        return (
            row.map((data, index) => {
                return <Col key={index} style={{ display: 'inline-block', width: '150px', borderBottom: '1px solid #adb2ba', wordWrap: 'break-word' }} xs ><p style={{ whiteSpace: 'normal' }}>{data}</p></Col>
            })
        )

    }
    handleOkPreview = (e) => {
        this.setState({
            preview: false,
        });
    }

    previewTable() {
        return (
            <Modal
                title="Preview"
                visible={this.state.preview}
                onCancel={this.handleOkPreview}
                width={1000}
                footer={<div><Button type="primary" onClick={this.handleOkPreview}>Close</Button></div>}
            >
                <Grid fluid style={{ overflowX: 'scroll', display: 'block', width: '900px', whiteSpace: 'nowrap' }} className="scrollbar" id="style-2">
                    <div style={{ display: 'block' }}>
                        <Row style={{ borderBottom: '1px solid #adb2ba', display: 'inline-block', backgroundColor: '#fafafa' }}>
                            {this.state.previewHeaders.map((name, index) => {
                                return <Col key={index} style={{ display: 'inline-block', width: '150px', wordWrap: 'break-word' }} xs ><h4 style={{ whiteSpace: 'normal' }}>{name}</h4></Col>
                            })}
                        </Row>
                    </div>
                    {this.state.previewData.map((data, index) => {
                        return (
                            <div key={index}style={{ display: 'block' }}>.
                            <Row key={index} style={{ display: 'inline-block' }}>
                                    {this.previewRow(index)}
                                </Row>
                            </div>
                        )
                    })}
                </Grid>
            </Modal>
        )
    }
    render() {
        return (
            <div  >
                {this.state.submited === false &&
                    <div style={{ marginLeft: '16px', marginRight: '16px', marginBottom: '16px', marginTop: '16px', width: '96%' }} >
                        <Row >
                            <Col >
                                <h2 style={{ marginLeft: '16px' }}>Maping Data Fields</h2>
                            </Col>
                            <Col >
                                <Button style={{ position: 'absolute', right: '175px' }} type="default" onClick={this.showPreview}>Show Preview</Button>
                            </Col>
                            <Col >
                                <Button style={{ position: 'absolute', right: '32px' }} type="default" icon="plus" onClick={this.showModal}>Data Type</Button>
                            </Col>
                        </Row>
                        <h4 style={{ marginLeft: '16px' }}>Help Clara make the meaningless meaningful.</h4>

                        <Box >
                            {this.state.feedback &&
                                <div style={{ width: '80%' }}>
                                    <h4 style={{ color: 'red', fontWeight: 'bold', display: 'inline' }}>Reason for rejection:{this.state.feedback}</h4>
                                </div>
                            }
                            {this.header()}
                            {this.state.table.length > 0 &&
                                this.state.table.map((data, index) => {
                                    return this.tableRow(this.handleSelection, data, index);
                                })
                            }
                            <Row xs={24} style={{ marginRight: '16px' }}>
                                <FormItem
                                    {...formItemLayout}
                                    label='Default tag'
                                    hasFeedback
                                >
                                    <Input placeholder="Enter tag" id="tag" defaultValue='title' value={this.state.tag} onChange={event => this.inputTag(event)} />
                                </FormItem>
                            </Row>

                            <div style={{ alignContent: 'center', alignItems: 'ceter', marginLeft: '16px', marginRight: '16px' }}>
                                <Row>
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

                                    <Modal
                                        title="Create a new data type"
                                        visible={this.state.visible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                    >
                                        <Row>
                                            <Col xs={6}>
                                                <MuiThemeProvider>
                                                    <SuperSelectField
                                                        name={'Category'}
                                                        hintText='select a category'
                                                        value={this.state.newTypeCat}
                                                        onChange={this.newDataTypeSelection}
                                                        style={{ minWidth: 150, margin: 10 }}
                                                    >
                                                        {this.state.category.map((data, index) => {
                                                            return <div key={index} value={data}>{data}</div>
                                                        })}

                                                    </SuperSelectField>
                                                </MuiThemeProvider>
                                            </Col>
                                            <Col xs={6}>
                                                <FormItem
                                                    {...formItemLayout}
                                                    label='Data Type'
                                                    hasFeedback
                                                >
                                                    <Input placeholder="Enter data type" id="dtype" defaultValue='title' value={this.state.dataTypeInput} onChange={event => this.inputType(event)} />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Modal>
                                    {this.previewTable()}
                                    <p style={{ color: 'red', fontWeight: 'bold', marginLeft: '16px' }}>{this.state.pointError}</p>
                                </Row>
                            </div>
                        </Box>
                    </div>
                }
                {this.state.submited === true &&
                    <div style={{ alignContent: 'center', alignItems: 'ceter', flex: 1, marginLeft: '16px', marginRight: '16px', marginBottom: '16px', marginTop: '16px', width: 400 }}>
                        <Box
                            title="Submited"
                            subtitle="The data set will apprear when it has been approved."
                        />
                    </div>
                }
            </div>
        );
    }
}
export default connect(
    state => ({
        profile: state.Auth.get('profile'),
    }),
)(DataManagement);
