import React, { Component } from 'react';
import Button, { ButtonGroup } from '../../components/uielements/button';
import Progress from '../../components/uielements/progress';
import basicStyle from '../../config/basicStyle';
import { Row, Col } from 'react-flexbox-grid';
import { rtl } from '../../config/withDirection';
import Box from '../../components/utility/box';
import { Input } from 'antd';
import { Icon } from 'antd';
import image from '../../image/claraCats02.svg';
import wilson from '../../image/theLifeOfWilson.gif';
const { TextArea } = Input;

export default class extends Component {
    constructor(props){
        super(props);
        this.state={
          costPercent: 20,
          efficiencyPercent: 20,
          insightsPercent: 20,
          uxPercent:20,
          totalPercent:20,
          text:'',
          pointError:'',
          textError:'',
          submited:false,
        }
    }    
    increase = (category) => {
        let percent;
        
        if (this.state.totalPercent>0){
            percent= this.state.totalPercent -5
            this.setState({ totalPercent: percent });
        
            switch(category){
                case 'cost':
                    percent = this.state.costPercent + 5;
                    if (percent > 100) {
                    percent = 100;
                    }
                    this.setState({ costPercent: percent });
                    break;
                case 'efficiency':
                    percent = this.state.efficiencyPercent + 5;
                    if (percent > 100) {
                    percent = 100;
                    }
                    this.setState({ efficiencyPercent: percent });
                    break;
                case 'insights':
                    percent = this.state.insightsPercent + 5;
                    if (percent > 100) {
                    percent = 100;
                    }
                    this.setState({ insightsPercent: percent });
                    break;
                case 'ux':
                    percent = this.state.uxPercent + 5;
                    if (percent > 100) {
                    percent = 100;
                    }
                    this.setState({ uxPercent: percent });
                    break;
                default:    
            }
        }
    }
    decline = (category) => {
        const total= this.state.totalPercent
        if (total < 100){
            
            let percent;
            switch(category){
                case 'cost':
                    percent = this.state.costPercent - 5;
                    if (percent < 0) {
                    percent = 0;
                    }else{
                        this.setState({ totalPercent: total+5 });
                    }
                    this.setState({ costPercent: percent });
                    break;
                case 'efficiency':
                    percent = this.state.efficiencyPercent - 5;
                    if (percent < 0) {
                    percent = 0;
                    }else{
                        this.setState({ totalPercent: total+5 });
                    }
                    this.setState({ efficiencyPercent: percent });
                    break;
                case 'insights':
                    percent = this.state.insightsPercent - 5;
                    if (percent < 0) {
                    percent = 0;
                    }else{
                        this.setState({ totalPercent: total+5 });
                    }
                    this.setState({ insightsPercent: percent });
                    break;
                case 'ux':
                    percent = this.state.uxPercent - 5;
                    if (percent < 0) {
                    percent = 0;
                    }else{
                        this.setState({ totalPercent: total+5 });
                    }
                    this.setState({ uxPercent: percent });
                    break; 
                default:    
            }
        }
    }  
    submit =() =>{
        this.setState({textError: ''});
        this.setState({pointError: ''});
        if (this.state.totalPercent===0 && this.state.text!==''){

            var formData= 'security=private&cost='+this.state.costPercent+'&efficiency='+ this.state.efficiencyPercent+'&insight='+this.state.insightsPercent+'&ux='+this.state.uxPercent+'&description='+ this.state.text;
            var  headersValue= {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
            fetch('http://35.182.224.114:3000/suggestions', {method: 'POST', headers:headersValue,  mode: 'cors', body:formData})
            .then((response) =>  response.json())
            .then(responseJson=> this.setState({submited:true }))
            .catch((error) => {
                    console.error(error);
            });
        }else if (this.state.totalPercent!==0){
            this.setState({pointError: 'Warning: Please use all the points.'});
        }else if (this.state.text===''){
            this.setState({textError: 'Warning: Please complete a comment.'});
        }   
    }
    inputText(event) { 
        // this.setState({ totalPercent: total+5 });
        this.setState({text: event.target.value});
    }
  
  render() {
    const {  colStyle } = basicStyle;
    const marginStyle = {
        margin: rtl === 'rtl' ? '0 0 10px 10px' : '0 10px 10px 0',
    };

    return (
      <div style={{alignContent:'center', alignItems:'ceter', marginLeft: '16px', marginRight: '16px',marginTop: '16px', width:600}}>
        <h1 style={{alignContent:'center', alignItems:'ceter', marginLeft: '16px', marginTop: '16px'}}>Ask Clara Suggestions</h1>
     
        
        <Col md={24} xs={24} style={colStyle }>
            {this.state.submited===false&&
            <Box
                title="Categorize the suggestion to the appropriate categories."
                subtitle="You get 100 point to destribute between the categories."
                
            >
           
            <Row>
                <div style={{ width:400, marginLeft: '16px'}}>
                    <Progress percent={this.state.totalPercent} status='active' />
                </div>
                <div>
                    <p style={{color:'red', fontWeight: 'bold',marginLeft: '16px'}}>{this.state.pointError}</p>
               </div>     
                
            </Row>    
            <Row>
                <Col  md={3} >
                    {/* <div> */}
                        <h3  style={{ marginBottom: '16px'}} >Cost  <i className="ion-social-usd" /></h3>
                        <Progress
                        type="circle"
                        percent={this.state.costPercent}
                        style={marginStyle}
                        status='active'
                        />
                        <ButtonGroup>
                            <Button onClick={()=>this.decline('cost')} icon="minus" />
                            <Button onClick={()=>this.increase('cost')} icon="plus" />
                        </ButtonGroup>
                    {/* </div>  */}
                </Col>
                <Col  md={3} >
                    {/* <div> */}
                        <h3  style={{ marginBottom: '16px'}}>Efficiency  <i className="ion-speedometer" /></h3>
                        <Progress
                        type="circle"
                        percent={this.state.efficiencyPercent}
                        style={marginStyle}
                        status='active'
                        />
                        <ButtonGroup>
                            <Button onClick={()=>this.decline('efficiency')} icon="minus" />
                            <Button onClick={()=>this.increase('efficiency')} icon="plus" />
                        </ButtonGroup>
                    {/* </div>  */}
                </Col>
                <Col  md={3} >
                    {/* <div> */}
                        <h3  style={{ marginBottom: '16px'}}>Insights  <i className="ion-android-bulb" /></h3>
                        <Progress
                        type="circle"
                        percent={this.state.insightsPercent}
                        style={marginStyle}
                        status='active'
                        />
                        <ButtonGroup>
                            <Button onClick={()=>this.decline('insights')} icon="minus" />
                            <Button onClick={()=>this.increase('insights')} icon="plus" />
                        </ButtonGroup>
                    {/* </div>  */}
                </Col>
                <Col  md={3} >
                    {/* <div> */}
                        <h3  style={{ marginBottom: '16px'}}>UX   <Icon type="user" /></h3>
                        <Progress
                        type="circle"
                        percent={this.state.uxPercent}
                        style={marginStyle}
                        status='active'
                        />
                        <ButtonGroup >
                            <Button onClick={()=>this.decline('ux')} icon="minus" />
                            <Button onClick={()=>this.increase('ux')} icon="plus" />
                        </ButtonGroup>
                    {/* </div>  */}
                </Col>
  
               
            </Row>
            <Row>
                <Col  md={24} style={{alignContent:'center', alignItems:'ceter', marginBottom: '16px', marginTop: '16px'}} >
                    <p style={{color:'red', fontWeight: 'bold',marginLeft: '16px'}}>{this.state.textError}</p>
                    <TextArea 
                    value={this.state.text}
                    placeholder='Enter your clara suggestion here...'
                    onChange={event => this.inputText(event)}
                    autoFocus 
                    rows={4} />
                      
                </Col >     
            </Row>
                <Button type="primary" onClick={()=>this.submit()}>Submit</Button>    
            
            </Box>
            }


            {this.state.submited === true &&
            <Box
                title="Thank you "
                subtitle="Submiting a suggestions to Clara helps the city grow."
                
            >

                
                <img
                    src={image } 
                    alt='claraCat'
                // width={100}
                    height={100} 
                />
                <img
                    src={wilson } 
                    alt='wilson'
                // width={100}
                    height={100}
                   
                />
               
            </Box>
            }
        </Col>
      
        </div>
    );
  }
}
