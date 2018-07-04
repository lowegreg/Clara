import React, { Component } from 'react';
import { connect } from 'react-redux';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import { Row, Col } from 'react-flexbox-grid';
import VCardWidget from '../../../containers/Widgets/vCard/vCard-widget';
// import userpic from '../../../image/profilePicture/default.png';
import Form from '../../../components/uielements/form';
import { Modal, message } from 'antd';
import Button from '../../../components/uielements/button';
import Input from '../../../components/uielements/input';
import App from '../../containers/ideaCreation/App.js'
import './styles.css';

const error = [
  { colour: '', help: '' },
  { colour: 'red', help: 'Please fill in each section' },
  { colour: 'red', help: 'New password cannot be current password' },
  { colour: 'red', help: 'Passwords do not match' },
  { colour: 'red', help: 'New password is too short' },
  { colour: 'red', help: 'Incorrect password' },
  { colour: 'orange', help: 'The server is down, please try again later' },
]
export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: this.props.profile,
      passwordModal: false,
      pictureModal: false,
      error: 0,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      notifications: []
    };
  }
  setNote(notifications) {
    if (notifications === []) {
      this.setState({ notification: [] })
      return;
    }
    var noteArray = [];
    for (var i = 0; i < notifications.length; i++) {
      var properties = notifications[i].subTitle.split('-');
      var newNote = {
        id: notifications[i].id,
        name: 'Data Mapping',
        notification: notifications[i].title,
        title: properties[1],
        status: properties[0],
        reason: properties[2],
        receipt: notifications[i].receipt,
        date: notifications[i].noteDate
      }
      noteArray.push(newNote)
    }
    this.setState({ notifications: noteArray })
  }
  getNotifications() {
    var query = 'http://35.182.224.114:3000/getNotifications?email=' + this.props.profile.email
    fetch(query, { method: 'GET', mode: 'cors' })
      .then((response) => response.json())
      .then(responseJson => this.setNote(responseJson.id))
      .catch((error) => {
        console.error(error);
      });
  }
  componentDidMount() {
    this.getNotifications();
  }
  getTimeElapsed(date) {
    const postDate = new Date(date);
    const now = new Date();
    const timeElapsed = Math.abs(now.getTime() - postDate.getTime());

    let elapsed = timeElapsed / 1000;
    if (elapsed / 60 >= 1) {
      elapsed /= 60;
      if (elapsed / 60 >= 1) {
        elapsed /= 60;
        if (elapsed / 24 >= 1) {
          elapsed /= 24;
          if (elapsed / 7 >= 1) {
            elapsed /= 7;
            return Math.floor(elapsed) + "w";
          } else {
            return Math.floor(elapsed) + "d";
          }
        } else {
          return Math.floor(elapsed) + "h";
        }
      } else {
        return Math.floor(elapsed) + "m";
      }
    } else {
      return Math.floor(elapsed) + "s";
    }
  }
  colourPicker(status) {
    switch (status) {
      case 'read':
        return 'whitesmoke'
      case 'delivered':
        return '#aec8f2'
      default:
        return '#aec8f2'
    }
  }
  onChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }
  //checks if all three passwords are vaild so it is able to change to the new password
  checkPassword = () => {
    var state = this.state;
    if (!state.newPassword || !state.currentPassword || !state.confirmPassword) {
      this.setState({ error: 1 });
    } else if (state.currentPassword === state.newPassword) {
      this.setState({ error: 2 });
    } else if (state.newPassword !== state.confirmPassword) {
      this.setState({ error: 3 });
    } else if (state.newPassword.length < 6) {
      this.setState({ error: 4 });
    } else {
      fetch('http://35.182.255.76/auth/local', {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        body: `identifier=${state.profile.username}&password=${state.currentPassword}`,
      })
        .then(response => response.json())
        .then(responseJSON => {
          if (responseJSON.statusCode) {
            this.setState({ error: 5 });
            return;
          }
          this.changePassword();
        })
        .catch(error => this.setState({ error: 6 }))
    }
  }
  // changes the password in the database
  changePassword = () => {
    const state = this.state;
    fetch(`http://35.182.255.76/user/${state.profile.userId}`, {
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
        if (responseJSON.statusCode) {
          this.setState({ error: 6 });
          return;
        }
        this.setState({ passwordModal: false, currentPassword: '', newPassword: '', confirmPassword: '', error: 0 });
        // displays the notification
        message.success('Password was successfully changed');
      })
      .catch(error => {
        this.setState({ error: 6 });
        console.log(error);
      })
  }
  markAsRead(dataSet, status, reason, id) {
    // this.setState({ visible: false })
    var title = dataSet + ' has been ' + status;
    var content;
    if (status === 'rejected') {
      content = 'Reason: ' + reason
      Modal.error({
        title: title,
        content: content,
      });
    } else if (status === 'accepted') {
      content = dataSet + ' is now viewable under the stories tab.'
      Modal.success({
        title: title,
        content: content,
      });
    } else if (status === 'read') {
      content = dataSet
      Modal.info({
        title: title,
        content: content,
      });
    }
    var headersValue = {
      'Accept': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    var formBody = 'id=' + id
    fetch('http://35.182.224.114:3000/updateNotifications', { method: 'POST', headers: headersValue, mode: 'cors', body: formBody })
      .then((response) => response.json())
      .then(responseJson => { })//this.setState({ submited: true })
      .catch((error) => {
        console.error(error);
      });
    this.getNotifications()
  }
  render() {
    const profile = this.state.profile;
    var image;
    try {
      image = require(`../../../image/profilePicture/${profile.userId}.png`);
    } catch (e) {
      image = require(`../../../image/profilePicture/default.png`);
    }
    return (
      <Row><Col xs={5}>
        <LayoutContentWrapper style={{ paddingTop: '20px' }}>
          <h3>Settings</h3>
          <div style={{ paddingTop: '40px' }}>

            <VCardWidget
              style={{ height: '450px', width: '380px' }}
              src={image}
              name={`${profile.firstName} ${profile.lastName}`}
              title={profile.department}
              description={
                <div>
                  <Col>
                    <Row>
                      <Col style={{ textAlign: 'right' }} xs={6}>
                        <b>Username</b>
                      </Col>
                      <Col style={{ textAlign: 'left' }} xs={6}>
                        <p>{profile.username}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col style={{ textAlign: 'right' }} xs={6}>
                        <b>Email</b>
                      </Col>
                      <Col style={{ textAlign: 'left' }} xs={6}>
                        <p>{profile.email}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col style={{ textAlign: 'right' }} xs={6}>
                        <b>Employee Id</b>
                      </Col>
                      <Col style={{ textAlign: 'left' }} xs={6}>
                        <p>{profile.employeeId}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Row style={{ paddingTop: '10%' }}>
                    <Col xs={6}>
                      <Button size='small' type="primary" onClick={() => this.setState({ passwordModal: true })}>Change Password</Button>
                    </Col>
                    <Col xs={6}>
                      <Button size='small' type="primary" onClick={() => this.setState({ pictureModal: true })}>Change Picture</Button>
                    </Col>
                  </Row>
                </div>
              }
            >
            </VCardWidget>
            <div style={{ backgroundColor: 'white', marginTop: '16px', padding: '3px' }}>
              <h3 style={{ marginLeft: '7px', marginTop: '14px' }}>Notifications</h3>
              <div style={{ height: '200px', overflow: 'auto', overflowX: 'hidden' }} className="scrollbar" id="style-1">
                {this.state.notifications.map(notification => (// whitesmoke
                  <div style={{ backgroundColor: this.colourPicker(notification.receipt), margin: '10px', padding: '5px', borderRadius: '3px' }} onClick={() => { this.markAsRead(notification.title, notification.status, notification.reason, notification.id) }} key={notification.id} >
                    <Row style={{ marginLeft: '7px' }}>
                      <Col xs={9} ><h5 >{notification.name}</h5></Col>
                      <Col xs={3}><p text-align='right'>{this.getTimeElapsed(notification.date)}</p></Col>
                    </Row>
                    <Row style={{ marginLeft: '7px' }}>
                      <Col xs={9}><p>{notification.notification}</p></Col>
                    </Row>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Modal
            wrapClassName="vertical-center-modal"
            title="Change password"
            visible={this.state.passwordModal}
            onOk={this.checkPassword}
            onCancel={() => this.setState({ passwordModal: false })}
          >
            <Form>
              <p style={{ marginBottom: '10px' }}>Password much be at least 6 characters long</p>
              <b>Current Password</b>
              <Input type='password' id="currentPassword" onChange={this.onChange} value={this.state.currentPassword} />
              <b style={{ paddingTop: '10px' }}>New Password</b>
              <Input type='password' id="newPassword" onChange={this.onChange} value={this.state.newPassword} />
              <b style={{ paddingTop: '10px' }}>Confirm New Password</b>
              <Input type='password' id="confirmPassword" onChange={this.onChange} value={this.state.confirmPassword} />
              <p style={{ color: error[this.state.error].colour }}>{error[this.state.error].help}</p>
            </Form>
          </Modal>

        </LayoutContentWrapper>
      </Col>
        <Col>
          <App profilePage />
        </Col>
      </Row>
    );
  }
}
export default connect(
  state => ({
    profile: state.Auth.get('profile'),
    jwt: state.Auth.get('idToken')
  }),
)(Settings);