import React, { Component } from 'react';
import { connect } from 'react-redux';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import LayoutContent from '../../../components/utility/layoutContent';
import { Row, Col } from 'react-flexbox-grid';
import IsoWidgetsWrapper from '../../../containers/Widgets/widgets-wrapper';
import VCardWidget from '../../../containers/Widgets/vCard/vCard-widget';
// import userpic from '../../../image/profilePicture/default.png';
import Form from '../../../components/uielements/form';
import { Modal, message } from 'antd';
import Button from '../../../components/uielements/button';
import Input from '../../../components/uielements/input';

const error = [
  {colour: '', help: ''},
  {colour: 'red', help: 'Please fill in each section'},
  {colour: 'red', help: 'New password cannot be current password'},
  {colour: 'red', help: 'Passwords do not match'},
  {colour: 'red', help: 'New password is too short'},
  {colour: 'red', help: 'Incorrect password'},
  {colour: 'orange', help: 'The server is down, please try again later'},
]
export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.profile,
      passwordModal: false,
      pictureModal: false,
      error: 0,
      currentPassword:'',
      newPassword:'',
      confirmPassword:'',
    };
  }
  onChange = (event)=> {  
    this.setState({[event.target.id]: event.target.value});
  }
  //checks if all three passwords are vaild so it is able to change to the new password
  checkPassword = () => {
    var state = this.state;
    if (!state.newPassword || !state.currentPassword || !state.confirmPassword) {
      this.setState({error: 1});
    } else if(state.currentPassword === state.newPassword){
      this.setState({error: 2});
    } else if (state.newPassword !== state.confirmPassword){
      this.setState({error: 3});
    } else if (state.newPassword.length < 6){
      this.setState({error: 4});
    } else {
      fetch('http://35.182.255.76/auth/local',  {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: `identifier=${state.profile.username}&password=${state.currentPassword}`,
      })
      .then(response => response.json())
      .then(responseJSON => {
        if (responseJSON.statusCode){
          this.setState({error:5});
          return;
        }
        this.changePassword();
      })
      .catch(error => this.setState({error: 6}))
    }
  }
// changes the password in the database
  changePassword = () =>{
    const state = this.state;
    fetch(`http://35.182.255.76/user/${state.profile.userId}`,  {
      headers: {
        'Accept': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${this.props.jwt}`
      },
      method: "PUT",
      body: `password=${state.newPassword}`,
    })
    .then(response => response.json())
    .then(responseJSON => {
      if (responseJSON.statusCode){
        this.setState({error:6});
        return;
      }
      this.setState({passwordModal: false, currentPassword: '', newPassword: '', confirmPassword: '', error: 0});
      // displays the notification
      message.success('Password was successfully changed');
    })
    .catch(error => {
      this.setState({error: 6});
      console.log(error);
    })   
  }
  // setImage = () =>{
   
  // }
  render() {
    const profile = this.state.profile;
    var image;
    try{
      image = require(`../../../image/profilePicture/${profile.userId}.png`);
    } catch(e) {
      image = require(`../../../image/profilePicture/default.png`);
    }
    return (
      <LayoutContentWrapper style={{paddingTop:'20px'}}>
        <h3>Settings</h3>
        <LayoutContent style={{justifyContent:'center'}} >
          <Col style={{justifyContent:'center'}} >
            <IsoWidgetsWrapper>
              <VCardWidget
                style={{ height: '450px', width: '380px' }}
                src={image}
                name={`${profile.firstName} ${profile.lastName}`}
                title={profile.department}
                description={
                  <div>
                    <Col>
                      <Row> 
                        <Col style={{ textAlign:'right'}} xs={6}>
                          <b>Username</b>
                        </Col>
                        <Col style={{ textAlign:'left'}} xs={6}>
                          <p>{profile.username}</p>
                        </Col>
                      </Row>
                      <Row> 
                        <Col style={{ textAlign:'right'}} xs={6}>
                          <b>Email</b>
                        </Col>
                        <Col style={{ textAlign:'left'}} xs={6}>
                          <p>{profile.email}</p>
                        </Col>
                      </Row>
                      <Row> 
                        <Col style={{ textAlign:'right'}} xs={6}>
                          <b>Employee Id</b>
                        </Col>
                        <Col style={{ textAlign:'left'}} xs={6}>
                          <p>{profile.employeeId}</p>
                        </Col>
                      </Row>
                    </Col>
                    <Row style={{paddingTop: '10%'}}>
                      <Col xs={6}>
                        <Button size='small' type="primary" onClick={() => this.setState({passwordModal: true})}>Change Password</Button>
                      </Col>
                      <Col xs={6}>
                        <Button  size='small' type="primary" onClick={() => this.setState({pictureModal: true})}>Change Picture</Button>
                      </Col>
                    </Row>
                  </div>
                }
              >
              </VCardWidget>
            </IsoWidgetsWrapper>
          </Col>
          <Modal 
            wrapClassName="vertical-center-modal"
            title="Change password"
            visible={this.state.passwordModal}
            onOk={this.checkPassword}
            onCancel={() => this.setState({ passwordModal:false })}
          >
            <Form>
                <p style={{marginBottom:'10px'}}>Password much be at least 6 characters long</p>
                <b>Current Password</b>
                <Input type='password' id="currentPassword" onChange={this.onChange} value={this.state.currentPassword} />
                <b style={{paddingTop: '10px'}}>New Password</b>
                <Input type='password' id="newPassword" onChange={this.onChange} value={this.state.newPassword} />  
                <b style={{paddingTop: '10px'}}>Confirm New Password</b>             
                <Input type='password' id="confirmPassword" onChange={this.onChange} value={this.state.confirmPassword} />
                <p style={{color: error[this.state.error].colour}}>{error[this.state.error].help}</p>
            </Form>
          </Modal>
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
)(Settings);