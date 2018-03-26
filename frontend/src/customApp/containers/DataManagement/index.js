import React, { Component } from 'react';
import Button, { ButtonGroup } from '../../../components/uielements/button';
// import basicStyle from '../../../config/basicStyle';
import { Row, Col } from 'react-flexbox-grid';
import Box from '../../../components/utility/box';
// import { Input } from 'antd';
// import image from '../../../image/claraCats02.svg';
// import { TableViews } from '../../../containers/Tables/antTables';
// import DataCard from '../../components/dataCard';
import SuperSelectField from 'material-ui-superselectfield'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// const { TextArea } = Input;
import Input from '../../../components/uielements/input';
import Form from '../../../components/uielements/form';
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
  
export default class extends Component {
    
    constructor(props){
        super(props);
        this.state={
            table:[],
            category: ['Number','Text','Date', 'Location'],
            number: [],
            date: [],
            text: [],
            location:[],
            typeDropdown:[],
            tag:'',
            test:{},
            tableName:'Addresses',
            submited:false,
            pointError:''
            
        }    
    };
    setTable(props){
       if (!props){return []}
        var tableArray=[]
        for (var i=0;i< props.length;i++){
            var object={
                property:props[i].propId,
                category:{
                    value: null,
                    name:'cat-'+i
                },
                type:{
                    value:null,
                    name:'type-'+i
                }
            }
            
            
            tableArray.push(object)
        }
         this.setState({table:tableArray})
    }
    setData(data){
        var number=[]
        var date=[]
        var text=[]
        var location=[]
        data.map((props,index)=>{

            if(props.category==='Text'){
                text.push(props.dataType)
            }else if(props.category==='Number'){
                number.push(props.dataType)
            }else if (props.category==='Date'){
                date.push(props.dataType)
            }else if (props.category==='Location'){
                location.push(props.dataType)
            }
        })
 
        
        this.setState({
            number: number,
            text: text,
            date:date,
            location:location,

        });
    }
    componentDidMount (){
        var query= 'http://35.182.224.114:3000/dataManagement/getProps?tableName='+this.state.tableName
        fetch(query, {method: 'GET', mode: 'cors'})
       .then((response) =>  response.json())
       .then(responseJson=> this.setTable(responseJson.id ))
       .catch((error) => {
         console.error(error);
       }); 
       
       fetch('http://35.182.224.114:3000/dataManagement/getDataTypes', {method: 'GET', mode: 'cors'})
       .then((response) =>  response.json())
       .then(responseJson=> this.setData(responseJson.id ))
       .catch((error) => {
         console.error(error);
       });
     }
    inputText(event){
        
        this.setState({tag: event.target.value});
    }
    submit(){
        this.setState({pointError:''});
        var formBody;
        var  headersValue= {
            'Accept': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded',
        }

       for (var i=0; i < this.state.table.length; i++){
            
            if(this.state.table[i].type.value===null){
                this.setState({pointError:'Please map all fields'});
                
                return;
            }
            
        }
      
        if (this.state.tag===''){ this.setState({pointError:'Please enter a default tag for this data set'});     return}
        this.state.table.map((input,index)=>{
            formBody ='propId='+ input.property+'&dataType='+input.type.value.value+'&tableName='+this.state.tableName;
            
            fetch('http://35.182.224.114:3000/dataManagement/postPropsDataTypes', {method: 'POST', headers:headersValue,  mode: 'cors', body:formBody})
            .then((response) =>  response.json())
            .then(responseJson=> this.setState({submited:true }))
            .catch((error) => {
                    console.error(error);
            });
        })
      
        formBody='tagName=' +this.state.tag+'&tableName='+this.state.tableName;
        fetch('http://35.182.224.114:3000/dataManagement/postDefaultTags', {method: 'POST', headers:headersValue,  mode: 'cors', body:formBody})
            .then((response) =>  response.json())
            .then(responseJson=> this.setState({submited:true }))
            .catch((error) => {
                    console.error(error);
        });
        

    }
    handleSelection = (values, name) =>   {
        var [stage, num] = name.split('-');
        var number=parseInt(num,10)
        var tempTable= this.state.table;
        var tempRow= this.state.table[number];
        if (stage==='cat'){
            tempRow.category.value=values
            tempRow.type.value=null
            var tempDropDown= this.state.typeDropdown;
            if (values){
                tempDropDown[number]=values.value
            }
            this.setState({ typeDropdown: tempDropDown });
        }else{
            tempRow.type.value=values
        }
        tempTable[number]= tempRow;
        this.setState({ table: tempTable });
    }    
    
    dropDown(handleSelection, state, name, hintText, stateIndex, dropDown){
        var dataArray=[]
        if (dropDown==='cat'){
            dataArray=this.state.category
        }else{
            if (this.state.typeDropdown[stateIndex]==='Date'){
                dataArray = this.state.date
            }else  if (this.state.typeDropdown[stateIndex]==='Text'){
                dataArray = this.state.text
            }else if (this.state.typeDropdown[stateIndex]==='Number'){
                dataArray = this.state.number
            }else if (this.state.typeDropdown[stateIndex]==='Location'){
                dataArray = this.state.location
            }else{
                dataArray=[]
            }  
        }
        
        return (
            
            <MuiThemeProvider>
                
                <SuperSelectField
                    name= {name}
                    hintText={hintText}
                    value={state}
                    onChange={handleSelection}
                    style={{ minWidth: 150, margin: 10 }}
                >
                
                    {dataArray.map((data,index)=>{
                        return <div key={index} value={data}>{data}</div>
                    })}
                    
                    
                </SuperSelectField>
            </MuiThemeProvider>
        
        )
    }


  
    header(){
        return (
         <Row  style={{backgroundColor: "#92add1"}}>
             <Col xs={3}>
                <div >
                        Propterties
                </div>
            </Col>
            <Col xs={3}>
                <div >
                        Category
                </div>
            </Col>
            <Col xs={6}>
                <div>
                        Data type
                </div>
            </Col>
        
        </Row>
        )
    }
    tableRow( handleSelection,data, index, catLabels ){
        return(
            <Row  style={{backgroundColor: "#edeeef", border:'1px solid #adb2ba'}} key={index} >  
                <Col xs={3}>
                    <div>
                        {data.property}
                    </div>
                </Col>

                <Col xs={3}>
                   
                        {/* {cat} */}
                       {this.dropDown(handleSelection, data.category.value,data.category.name, 'select a category', index, 'cat')}
                    
                </Col>
                <Col xs={6}>
                    {this.dropDown(handleSelection, data.type.value, data.type.name, 'select a data type', index, 'type')}    
                    
                </Col>
               
                
            </Row>
        )
    }
    

  render() {
    // const { stateCat1, stateType1, stateCat2, stateType2 } = this.state
    // const {  colStyle } = basicStyle;
    return (

      <div  style={{alignContent:'center', alignItems:'ceter', marginLeft: '16px', marginRight: '16px', marginBottom: '16px', marginTop: '16px'}}>
        <h1 style={{alignContent:'center', alignItems:'ceter', marginLeft: '16px', marginTop: '16px',marginRight: '16px'}}>Maping Data Fields</h1>
        
        
        <Box
                title="Help Clara make the meaningless meaningful."
                subtitle=""
                
            >
            {this.header()}
            

            {this.state.table.length>0 &&
                this.state.table.map((data,index)=>{
                        return this.tableRow( this.handleSelection, data, index) ;
                })
            }
         
                <Row xs={24}>   
                    <FormItem
                        {...formItemLayout}
                        label='Default tag'
                        hasFeedback
                        >
                        <Input placeholder="Enter tag" id="tag" defaultValue='title' value={this.state.tag} onChange={event => this.inputText(event)} />
                    </FormItem>
                </Row>    
                
            <div style={{alignContent:'center', alignItems:'ceter', marginLeft: '16px',marginRight: '16px'}}>
                <Row>
                <Button
                type="primary"
                onClick={() => {
                    this.submit();
                }}
                className="nextPage"
                >
                Submit
                </Button>
                <p style={{color:'red', fontWeight: 'bold',marginLeft: '16px'}}>{this.state.pointError}</p>
                </Row>
            </div>
        </Box>


      
    </div>

    );
  }
}
