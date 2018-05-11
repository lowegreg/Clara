import React, { Component } from 'react';
import SuperSelectField from 'material-ui-superselectfield';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Row, Col } from 'react-flexbox-grid';
import Input from '../../../components/uielements/input';
import Form from '../../../components/uielements/form';
import Button from '../../../components/uielements/button';
import Box from '../../../components/utility/box';
import Tile from '../../components/insightTile/index2';

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


const option = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data:['利润', '支出', '收入']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'value'
        }
    ],
    yAxis : [
        {
            type : 'category',
            axisTick : {show: false},
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    series : [
        {
            name:'利润',
            type:'bar',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            data:[200, 170, 240, 244, 200, 220, 210]
        },
        {
            name:'收入',
            type:'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true
                }
            },
            data:[320, 302, 341, 374, 390, 450, 420]
        },
        {
            name:'支出',
            type:'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'left'
                }
            },
            data:[-120, -132, -101, -134, -190, -230, -210]
        }
    ]
};

export default class extends Component {
    constructor(props){
        super(props);

        this.state={
            form:{
                d1:{
                    typeData:null,
                    dataSet:null,
                    property:null,
                },
                d2:{
                    typeData:null,
                    dataSet:null,
                    property:null
                },
                title:null,
                description:null,
                tag:null,
                graphType:null,
            },
            typeDataArray:['Live','Open', 'Third Party', 'Imported'],
            dataSet1Array:[],
            dataSet2Array:[],
            property1Array:[],
            property2Array:[],
            graphTypeArray: ['Line Graph', 'Bar Graph', 'Pie, Graph'],
            showGraph:false
        }
    }    
    getOpenData(data){
        var url='http://localhost:3001/tableLookUp?getNames=true'
        fetch(url, {method: 'GET', mode: 'cors'})
        .then((response) =>  response.json())
        .then(responseJson=> 
            this.setState({
                [data]: responseJson.tableId// this will be loaded from api
            }))
        .catch((error) => {
            console.error(error);
        })
    }
    getDataSetArray(type,data){
        if (type==='Open'){
            this.getOpenData(data);   
        }else{
            return []
        }   
    }
    getProps( title,prop){
        var url='http://localhost:3001/dataManagement/getProps?tableName='+title
        fetch(url, {method: 'GET', mode: 'cors'})
       .then((response) =>  response.json())
       .then(responseJson=> 
           this.setState({
               [prop]: responseJson.id// this will be loaded from api
           }))
       .catch((error) => {
           console.error(error);
       })
    }
    inputText(event){
        var form= this.state.form
        form[event.target.id]=event.target.value
        this.setState({
            form:form
        })
    }
    typeOfDataSelected= (values, name) =>   {
        var form= this.state.form;
        var data='dataSet1Array'
        if (name==='typeData1'){
            form.d1.typeData=values
            form.d1.dataSet=null
            form.d1.property=null
            this.setState({
                property1Array:[],
                dataSet1Array:[],
            })
        }else{
            data='dataSet2Array'
            form.d2.typeData=values
            form.d2.dataSet=null
            form.d2.property=null
            this.setState({
                property2Array:[], 
                dataSet2Array:[]
            })
        }

        this.setState({
            form: form,
        })
        
        // // get data set that are of type ===value
        if (values!==null){
            this.getDataSetArray(values.value,data)
        }

    } 
    dataSetSelected= (values, name) =>   {
        var form= this.state.form
        var prop= 'property1Array'
        if (name==='dataSet1'){
            form.d1.dataSet=values
            form.d1.property=null
            this.setState({
                property1Array:[]
            })     
        }else{
            prop='property2Array'
            form.d2.dataSet=values   
            form.d2.property=null
            this.setState({
                property2Array:[]
            })
        }    
        this.setState({
            form:form
        })
        // // get props for values table
        if (values!==null){
            this.getProps(values.value,prop)
        }
        
        
        // this.setState({
        //     [prop]:['id', 'addresses', 'name']// this will be loaded from api
        // })
        // set prop array
    }
    selected = (values, name) =>   {
        var form=this.state.form
        if (name==='property1'){
            form.d1.property=values
        }else if (name==='property2'){ 
            form.d2.property=values
        } 
        if (name==='property1'||name==='property2'){
            this.setState({
               form:form 
            })
            return
        }
        form[name]= values
        this.setState({
            form:form
        })
        // save it
    } 
    submit(){
        if (this.state.form.graphType===null||this.state.form.d1.property===null||this.state.form.d2.property===null||this.state.form.title===''||this.state.form.description===''||this.state.form.tag===''){
            console.log('errror fiil it all', this.state.form)
            return;
        }
        // get data for x and y via api call
        var graph={
            title:this.state.form.title,
            description:this.state.form.description,
            tags:this.state.form.tag,
            // x:,
            // y:,
            // z:,
            xName: this.state.form.d1.property.value.propId,
            yName: this.state.form.d2.property.value.propId,
            xType: this.state.form.d1.property.value.dataTypes,
            yType: this.state.form.d2.property.value.dataTypes,  
        }

        this.setState({
            showGraph:true
        })   
    }
  render() {

    return (
      <div style={{alignContent:'center', alignItems:'ceter',justifyContent: 'center', flex:1, marginLeft: '16px', marginTop: '16px', marginBottom:'16px', marginRight:'16px', width:'66%'}}>
        <h2>Create a New Story</h2>
        <h4>Select two datasets and one property for each dataset</h4>
        <Box>
        <Row style={{ alignItems: 'center',justifyContent: 'center', flex:1}}>
            <Col xs={3} style={{marginRight:'16px'}} >
                <MuiThemeProvider> 
                    <SuperSelectField
                        name= {'typeData1'}
                        hintText={'Type of Data'}
                        value={this.state.form.d1.typeData}
                        onChange={this.typeOfDataSelected}
                        style={{ minWidth: 150, margin: 10 }}
                    >
                        {this.state.typeDataArray.map((data,index)=>{
                            return <div key={index} value={data}>{data}</div> 
                        })}

                    </SuperSelectField>
                </MuiThemeProvider>
            </Col>
            <Col xs={4}  style={{marginRight:'16px'}}>
                <MuiThemeProvider> 
                    <SuperSelectField
                        name= {'dataSet1'}
                        hintText={'Dataset'}
                        value={this.state.form.d1.dataSet}
                        onChange={this.dataSetSelected}
                        style={{ minWidth: 150, margin: 10 }}
                    >
                        {this.state.dataSet1Array.map((data,index)=>{
                            return <div key={index} value={data.name}>{data.name}</div> 
                        })}

                    </SuperSelectField>
                </MuiThemeProvider>
            </Col>
             
            <Col xs={4} style={{marginRight:'16px'}}>
                <MuiThemeProvider> 
                    <SuperSelectField
                        name= {'property1'}
                        hintText={'Property'}
                        value={this.state.form.d1.property}
                        onChange={this.selected}
                        style={{ minWidth: 150, margin: 10 }}
                    >
                        {this.state.property1Array.map((data,index)=>{
                            return <div key={index} value={data} label={data.propId}>{data.propId}</div> 
                        })}

                    </SuperSelectField>
                </MuiThemeProvider>   
            </Col>
        </Row>
        <Row style={{ alignItems: 'center',justifyContent: 'center', flex:1}}>vs.</Row>
        <Row style={{ alignItems: 'center',justifyContent: 'center', flex:1}}>
            <Col xs={3}  style={{ marginRight:'16px'}}>
                <MuiThemeProvider> 
                    <SuperSelectField
                        name= {'typeData2'}
                        hintText={'Type of Data'}
                        value={this.state.form.d2.typeData}
                        onChange={this.typeOfDataSelected}
                        style={{ minWidth: 150, margin: 10 }}
                    >
                        {this.state.typeDataArray.map((data,index)=>{
                            return <div key={index} value={data}>{data}</div> 
                        })}

                    </SuperSelectField>
                </MuiThemeProvider>
            </Col>
            
            <Col xs={4}  style={{marginRight:'16px'}}>
                <MuiThemeProvider> 
                    <SuperSelectField
                        name= {'dataSet2'}
                        hintText={'Dataset'}
                        value={this.state.form.d2.dataSet}
                        onChange={this.dataSetSelected}
                        style={{ minWidth: 150, margin: 10 }}
                    >
                        {this.state.dataSet2Array.map((data,index)=>{
                            return <div key={index} value={data.name}>{data.name}</div> 
                        })}

                    </SuperSelectField>
                </MuiThemeProvider>
            </Col> 

            <Col xs={4}  style={{marginRight:'16px'}}>
                <MuiThemeProvider> 
                    <SuperSelectField
                        name= {'property2'}
                        hintText={'Property'}
                        value={this.state.form.d2.property}
                        onChange={this.selected}
                        style={{ minWidth: 150, margin: 10 }}
                    >
                        {this.state.property2Array.map((data,index)=>{
                            return <div key={index} value={data} label={data.propId}>{data.propId}</div> 
                        })}

                    </SuperSelectField>
                </MuiThemeProvider>   
            </Col>

        </Row>
        <Row style={{marginTop:'16px',alignContent:'center', alignItems:'ceter',justifyContent: 'center', flex:1,}}>
            <Col xs={8}>
                <FormItem
                    {...formItemLayout}
                    label='Story Details'
                    hasFeedback
                    >
                    <Input placeholder="Enter title" id="title" defaultValue='title' value={this.state.form.title} onChange={event => this.inputText(event)} />
                    <Input placeholder="Enter description" id="description" defaultValue='title' value={this.state.form.description} onChange={event => this.inputText(event)} />
                    <Input placeholder="Enter tag" id="tag" defaultValue='title' value={this.state.form.tag} onChange={event => this.inputText(event)} />
                     
                </FormItem>
            </Col>
        </Row>    
        <Row>
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
                        name= {'graphType'}
                        hintText={'Graph type'}
                        value={this.state.form.graphType}
                        onChange={this.selected}
                        style={{ minWidth: 150, margin: 10 }}
                    >
                        {this.state.graphTypeArray.map((data,index)=>{
                            return <div key={index} value={data}>{data}</div> 
                        })}

                    </SuperSelectField>
                </MuiThemeProvider> 
            </Col>
        </Row>
        </Box>
        {this.state.showGraph&&
            <Tile  table={{title:"her i am" , tags:[{name:'test', value:'test'}, {name:'test1', value:'test'}], options:option, description:'testd' }}  />
        }
        
      </div>
    );
  }
}