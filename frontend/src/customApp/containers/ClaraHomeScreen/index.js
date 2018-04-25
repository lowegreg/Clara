import React, { Component } from 'react';
import Button from '../../../components/uielements/button';
import { connect } from 'react-redux';
import WelcomeCard from '../../components/welcomeCard/welcomeCard'
import Tabs, { TabPane } from '../../../components/uielements/tabs';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import TableStyle from './tableStyle';
import Input from '../../../components/uielements/input';
import Form from '../../../components/uielements/form';
import { Modal } from 'antd';
import authAction from '../../../redux/auth/actions';

const { updateUser } = authAction;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
const error = [
  {validateStatus: '', help: ''},
  {validateStatus: 'error', help: 'Please enter title'},
  {validateStatus: 'warning', help: 'The server is down, please try again later'},
]
export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWelcome: true,
      visible: false,
      confirmLoading: false,
      title: '',
      error: 0,
      profile: this.props.profile,
    };
    this.clickHandler = this.clickHandler.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  //removes the welcome card from the screen
  clickHandler(event) {
    this.setState({
      showWelcome: false
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    if (this.state.title) {
      fetch('http://localhost:1337/dashboard', {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${this.props.jwt}`
        },
        method: "POST",
        body: `user=${this.props.profile.userId}&title=${this.state.title}`,
      })
      .then((response) =>  response.json())
      .then(responseJson=> {
        var profile = this.props.profile;      
        profile.dashboards.push(responseJson)
        this.setState({error: 0, title: '', confirmLoading:false, visible:false, profile: profile })        
        this.props.updateUser()
      })
      .catch((error) => {
        this.setState({error: 2, confirmLoading: false})
        console.error(error);
      });

    } else {
      this.setState({
        error : 1,
        visible: true,
        confirmLoading: false
      });
    }
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  onChange(event) {  
    this.setState({title: event.target.value});
  }

   render() {
    var welcomeCard = null
    if (this.state.showWelcome) {
      welcomeCard = <WelcomeCard clickHandler={this.clickHandler} />
    } else {
      welcomeCard = null
    }
    return (
      <div >
        {welcomeCard}
      <LayoutContentWrapper>
        <h1>My Dashboards</h1>
        <div style={{ marginLeft:'auto', marginRight:'0', marginTop:'5px'}}>
          <Button type='primary' size='small' onClick={this.showModal}>New Dashboard</Button>
          <Modal title="Create New Dashboard"
            visible={this.state.visible}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}
          >
            <Form>
              <FormItem {...formItemLayout} label="Title" validateStatus={error[this.state.error].validateStatus} help={error[this.state.error].help} > 
                <Input id="title" onChange={this.onChange} value={this.state.title} />
              </FormItem>
            </Form>
          </Modal>
        </div>
        <TableStyle className="isoLayoutContent">
          <Tabs className="isoTableDisplayTab">
            {this.state.profile.dashboards.map(dashboard => (
              <TabPane tab={dashboard.title} key={dashboard._id}>
                {//display pin
                }
              </TabPane>
            ))}
          </Tabs>
        </TableStyle>
      </LayoutContentWrapper>
      </div>      
    );
  }
}

export default connect(
  state => ({
    profile: state.Auth.get('profile'),
    jwt: state.Auth.get('idToken')
  }),
  { updateUser }
)(Dashboard);