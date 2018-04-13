import React from 'react';
import { connect } from 'react-redux';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import  'bootstrap/dist/css/bootstrap.css';
import Box from '../../../components/utility/box';
import { Row, Col } from 'react-flexbox-grid';
import { Input, Tag, List, Modal } from 'antd';
import Button from '../../../components/uielements/button';
import dateformat from 'dateformat';
const { TextArea } = Input;
let order = 'desc';
var  headersValue= {
    'Accept': 'application/x-www-form-urlencoded',
    'Content-Type': 'application/x-www-form-urlencoded',
}
class AdminDataManagement extends React.Component {
    
    constructor(props){
        super(props);
    
        this.state={
          table: [],//name, statusId, submittedBy, SubmittedOn from the tablelookup 
          visible: false,  // if the pop up is open
          entry:[], // the lis tof  all the data types mapped 
          selected:{},// selected row from table 
          submitted: false, // if it was succesfuly added to the database
          text:'',  // value of text box for feedback
          error:'', // value of error text
          dataTypes:[]  // current values of the datatypes database table
        }
      } 
    handleBtnClick = () => {
        if (order === 'desc') {
            this.refs.table.handleSort('asc', 'name');
            order = 'asc';
        } else {
            this.refs.table.handleSort('desc', 'name');
            order = 'desc';
        }
    }
    refactorData(){
        var current= [];
        for(var i=0; i< this.state.table.length;i++){
            if (this.state.table[i].statusId!=null){
                var row={
                    name:this.state.table[i].name,
                    status:this.state.table[i].statusId,
                    tag: this.state.table[i].defaultTag,
                    submittedBy:this.state.table[i].submittedBy||'no user',
                    date:dateformat(this.state.table[i].submittedOn,'yyyy/mm/dd') ||'no date' ,
                    feedback:this.state.table[i].feedback
                }
                current.push(row)
            }    
        }
        this.setState({table: current});  
    }
    setData(data){
        var all=[]
        data.map((props,index)=>{
            var temp
            if(props.category==='Text'){
                temp= 'Text-'
            }else if(props.category==='Number'){
                temp='Number-'
            }else if (props.category==='Date'){
                temp='Date-'
            }else if (props.category==='Location'){
                temp='Location-'
            }
            temp=temp+props.dataType
            all.push(temp)
            return []
        })
        this.setState({dataTypes:all})
    }
    componentDidMount(){
        fetch('http://35.182.224.114:3000/tableLookUp', {method: 'GET', mode: 'cors'})
        .then((response) =>  response.json())
        .then(responseJson=> {
        responseJson.tableId.forEach(function(obj) { obj.key = responseJson.tableId });
        this.setState({ table:responseJson.tableId })
        this.refactorData()
        })
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
    changeStatus(status){
        var updatedTable = this.state.table;
        for( var i=0; i< updatedTable.length; i++){
            if (updatedTable[i].name===this.state.selected.name){
                updatedTable[i].status=status
            }
        }
        this.setState({
            table: updatedTable
        })  
    }
    setStatus(formBody){
        fetch('http://35.182.224.114:3000/dataManagement/postTableStatus', {method: 'POST', headers:headersValue,  mode: 'cors', body:formBody})
        .then((response) =>  response.json())
        .then(responseJson=> this.setState({submited:true }))
        .catch((error) => {
                console.error(error);
        });
    }
    setNotifcaiton(formBody){
        fetch('http://35.182.224.114:3000/postNotifications', {method: 'POST', headers:headersValue,  mode: 'cors', body:formBody})
        .then((response) =>  response.json())
        .then(responseJson=> this.setState({submited:true }))
        .catch((error) => {
                console.error(error);
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
            error:'',
        });
         
        var formBody='status=accepted&tableName='+this.state.selected.name;
        this.setStatus(formBody);//db table
        this.changeStatus('accepted')// ui
        // check if any new datatypes were created
        for (var i=0; i<this.state.entry.length; i++ ){      
            if(!this.state.dataTypes.includes(this.state.entry[i].dataTypes.replace(/ +$/, ""))){
                // insert data type in to datatypes table  postNewDatatype
                var input =this.state.entry[i].dataTypes.replace(/ +$/, "").split('-')
                var formBody2='category='+input[0]+'&datatype='+input[1];
                fetch('http://35.182.224.114:3000/dataManagement/postNewDatatype', {method: 'POST', headers:headersValue,  mode: 'cors', body:formBody2})
                .then((response) =>  response.json())
                .then(responseJson=> this.setState({submited:true }))
                .catch((error) => {
                        console.error(error);
                });
                var formBody3= 'email='+this.state.selected.submittedBy+'&subTitle=accepted-'+this.state.selected.name+'&title='+this.state.selected.name+' has been approved.'
                this.setNotifcaiton(formBody3)
            }      
        }    
    }
    handleReject = (e) => {
        if (this.state.text===''){
            this.setState({
                error: 'Please enter a explination for the reason you reject'
            })
            return;
        }
        this.setState({
            visible: false,
            error:''
        })
        
        var formBody='status=rejected&tableName='+this.state.selected.name+'&feedback='+this.state.text;
        this.setStatus(formBody);
        var formBody2= 'email='+this.state.selected.submittedBy+'&subTitle=rejected-'+this.state.selected.name+'- '+this.state.text+'&title='+this.state.selected.name+' has been rejected.'
        this.setNotifcaiton(formBody2)
        this.changeStatus('rejected')
    }
    handleCancel= ()=>{
        this.setState({
            visible:false,
            error:'',    
        })
    }
    onRow=(row)=>{
        var feedback= this.getFeedbackText(row.name)
        this.setState({
            visible: true,
            selected: row,    
            text: feedback
        })
        
        var query= 'http://35.182.224.114:3000/dataManagement/getProps?tableName='+row.name  
        fetch(query, {method: 'GET', mode: 'cors'})
        .then((response) =>  response.json())
        .then(responseJson=> this.setState({entry:responseJson.id} ))
        .catch((error) => {
        console.error(error);
        });      
    }
    inputText(event) { 
        this.setState({text: event.target.value});
    }
    getFeedbackText(selected){
        var feedback;
        for( var i=0; i< this.state.table.length; i++){
            if (this.state.table[i].name===selected){
                feedback=this.state.table[i].feedback
                break;
            }
        }
        return feedback;
    }
  render() {
    var options = {
        onRowClick: this.onRow

    }
      
    return (
    <div style={{marginTop:'16px', marginRight:'16px', marginBottom:'16px', marginleft:'16px',  width:'96%'}}>
      <Box >
        
        <link rel="stylesheet" href="https://npmcdn.com/react-bootstrap-table/dist/react-bootstrap-table-all.min.css"></link>
        <Modal
            title="Review the data mapping"
            visible={this.state.visible}
            onOk={this.handleOk}
            okText="Accept"
            cancelText="Reject"
            onCancel={this.handleCancel}
            maskClosable={true}
            width={'80%'}
            closable={true}
            bodyStyle={{height:300}}
            footer={[
                <Button key="back" onClick={this.handleReject}>Reject</Button>,
                <Button key="submit" type="primary" onClick={this.handleOk}>
                  Accept
                </Button>,
                
              ]}
        >
            <Row style={{ marginBottom: '16px'}}>
                <Col xs={6}>
                    <div style={{maxHeight: 275, overflow: 'auto',overflowX: "hidden"}}>
                        <List
                            size="small"
                            bordered
                            dataSource={this.state.entry}
                            renderItem={item => (<List.Item><Col xs={8}>{item.propId}</Col><Col xs={6}><Tag >{item.dataTypes}</Tag></Col></List.Item>)}
                        />
                    </div>
                </Col>
                <Col xs={6}>
                    <div style={{ marginBottom: '16px'}} >
                    <Row><Col xs={4}>   <h4 >Data Set:</h4>       </Col><Col xs={3}> <h5 >{this.state.selected.name}</h5>        </Col></Row>
                    <Row><Col xs={4}>   <h4 >Submited By: </h4>   </Col><Col xs={3}> <h5 >{this.state.selected.submittedBy}</h5> </Col></Row>
                    <Row><Col xs={4}>   <h4 >Submited On:</h4>    </Col><Col xs={3}> <h5 >{this.state.selected.date}</h5>        </Col></Row>
                    <Row><Col xs={4}>   <h4 >Tag: </h4>           </Col><Col xs={3}> <h5 >{this.state.selected.tag}</h5>         </Col></Row>
                    <Row><Col xs={4}>   <h4 >Current Status:</h4> </Col><Col xs={3}> <h5 >{this.state.selected.status}</h5>      </Col></Row>    
                           
                    </div>   
                    <TextArea 
                        value={this.state.text}
                        placeholder='If you are rejecting, please explain why'
                        onChange={event => this.inputText(event)}
                        autoFocus 
                        rows={4} 
                    />
                    <p style={{color:'red', fontWeight: 'bold',marginLeft: '16px'}}>{this.state.error}</p>
         
                </Col>
            </Row>
        </Modal>
        <BootstrapTable ref='table' data={ this.state.table } pagination={true} options={options}>
            <TableHeaderColumn dataField='name' isKey={ true } dataSort={ true }>Data Set</TableHeaderColumn>
            <TableHeaderColumn dataField='submittedBy'         dataSort={ true }>Submited by</TableHeaderColumn>
            <TableHeaderColumn dataField='date'                dataSort={ true }>Submited on</TableHeaderColumn>
            <TableHeaderColumn dataField='status'              dataSort={ true }>Status</TableHeaderColumn>
        </BootstrapTable>
      </Box>
    </div>
    );
  }
}

export default connect(state => ({
    profile: state.Auth.get('profile'),
}))(AdminDataManagement);