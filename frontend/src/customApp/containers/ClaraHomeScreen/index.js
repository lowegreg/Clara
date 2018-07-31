import React, { Component } from 'react';
import Button from '../../../components/uielements/button';
import { connect } from 'react-redux';
import WelcomeCard from '../../components/welcomeCard/welcomeCard'
import Tabs, { TabPane } from '../../../components/uielements/tabs';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import TableStyle from './tableStyle';
import Input from '../../../components/uielements/input';
import Form from '../../../components/uielements/form';
import { Modal, Checkbox, Icon } from 'antd';
import authAction from '../../../redux/auth/actions';
import InsightPage from '../insightPages';
import Weather from '../../components/weatherCard';
import Dropdown from '../../../components/uielements/dropdown';
import Menu from '../../../components/uielements/menu';
import Fullscreen from "react-full-screen";
 

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
  { validateStatus: '', help: '' },
  { validateStatus: 'error', help: 'Please enter title' },
  { validateStatus: 'warning', help: 'The server is down, please try again later' },
]

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWelcome: JSON.parse(localStorage.getItem('welcomeCard')),
      visible: false,
      isFull: false,
      confirmLoading: false,
      departDash: false,
      title: '',
      error: 0,
      dashboards: this.props.profile.dashboards,
      activeKey: (this.props.profile.dashboards[0] ? this.props.profile.dashboards[0]._id : ''),
    };
    this.clickHandler = this.clickHandler.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  // removes the welcome card from the screen
  clickHandler() {
    this.setState({
      showWelcome: false
    })
    localStorage.setItem('welcomeCard', JSON.parse(false))
  }

  add = () => {
    this.setState({
      visible: true, departDash: false
    });
  }
  // Creates and addes a new dashboard to a the current user
  handleOk = () => {
    const { title, departDash } = this.state;
    const { jwt, profile } = this.props;
    this.setState({
      confirmLoading: true,
    });
    //Checks if the user entered a title for their new dashboard
    if (title && !departDash) {
      fetch('http://localhost:1337/dashboard', {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${jwt}`
        },
        method: "POST",
        body: `user=${profile.userId}&title=${title}`,
      })
        .then((response) => response.json())
        .then(responseJson => {
          //if a new dashboard is created correctly it will add it to the user's dashboard list
          if (!responseJson.message) {
            var dashboards = this.state.dashboards;
            dashboards.push(responseJson)
            if (dashboards.length === 1) {
              this.setState({ activeKey: dashboards[0]._id })
            }
            this.setState({ error: 0, title: '', confirmLoading: false, visible: false, dashboards: dashboards })
            this.props.updateUser()
          } else {
            // displays server error
            this.setState({ error: 2, confirmLoading: false })
            console.error(responseJson.message)
          }
        })
        .catch((error) => {
          // displays server error
          this.setState({ error: 2, confirmLoading: false })
          console.error(error);
        });

    } else if (title && departDash) {
      fetch('http://localhost:1337/sharedDash', {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${jwt}`
        },
        method: "POST",
        body: `department=${profile.departmentId}&title=${title}`,
      })
        .then((response) => response.json())
        .then(responseJson => {
          //if a new dashboard is created correctly it will add it to the user's dashboard list
          if (!responseJson.message) {
            var dashboards = this.state.dashboards;
            const index = dashboards.findIndex((dash) => { return dash.user })
            responseJson.department = this.props.profile.department;
            console.log(index)
            dashboards.splice(index, 0, responseJson)
            if (dashboards.length === 1) {
              this.setState({ activeKey: dashboards[0]._id })
            }
            this.setState({ error: 0, title: '', confirmLoading: false, visible: false, dashboards: dashboards })
            this.props.updateUser()
          } else {
            // displays server error
            this.setState({ error: 2, confirmLoading: false })
            console.error(responseJson.message)
          }
        })
        .catch((error) => {
          // displays server error
          this.setState({ error: 2, confirmLoading: false })
          console.error(error);
        });
    } else {
      this.setState({
        error: 1,
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
    this.setState({ title: event.target.value });
  }
  onTabClick = (activeKey) => {
    this.setState({ activeKey: activeKey });
  }

  // deletes dashboard from user's dashboard list
  remove = (targetKey) => {
    var dashboards = this.state.dashboards;
    const dash = dashboards.find((dashboard) => {
      return dashboard._id === targetKey
    })
    if (!dash.department) {
      fetch(`http://localhost:1337/dashboard/${targetKey}`, {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${this.props.jwt}`
        },
        method: "DELETE",
      })
        .then(response => response.json())
        .then(responseJson => {
          if (!responseJson.message) {
            var dashboards = this.state.dashboards.filter(dashboard => dashboard._id !== targetKey)
            //Determines the next active key if the user deletes the current dashboard
            if (targetKey === this.state.activeKey) {
              var index = this.state.dashboards.findIndex(x => x._id === targetKey);
              if (index === 0) {
                dashboards.length === 0 ? this.setState({ activeKey: '' }) : this.setState({ activeKey: dashboards[0]._id })
              } else {
                this.setState({ activeKey: this.state.dashboards[index - 1]._id })
              }
            }
            this.setState({ dashboards: dashboards });
            this.props.updateUser();
            var updatedProfile = this.props.profile;
            updatedProfile.dashboards = dashboards;
            localStorage.setItem('profile', JSON.stringify(updatedProfile))
          } else {
            //displays server errors
            console.error(responseJson.message)
          }
        })
        .catch(error => {
          //displays server error
          console.error(error)
        })
    } else {
      fetch(`http://localhost:1337/sharedDash/${targetKey}`, {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${this.props.jwt}`
        },
        method: "DELETE",
      })
        .then(response => response.json())
        .then(responseJson => {
          if (!responseJson.message) {
            var dashboards = this.state.dashboards.filter(dashboard => dashboard._id !== targetKey)
            //Determines the next active key if the user deletes the current dashboard
            if (targetKey === this.state.activeKey) {
              var index = this.state.dashboards.findIndex(x => x._id === targetKey);
              if (index === 0) {
                dashboards.length === 0 ? this.setState({ activeKey: '' }) : this.setState({ activeKey: dashboards[0]._id })
              } else {
                this.setState({ activeKey: this.state.dashboards[index - 1]._id })
              }
            }
            this.setState({ dashboards: dashboards });
            this.props.updateUser();
            var updatedProfile = this.props.profile;
            updatedProfile.dashboards = dashboards;
            localStorage.setItem('profile', JSON.stringify(updatedProfile))
          } else {
            //displays server errors
            console.error(responseJson.message)
          }
        })
        .catch(error => {
          //displays server error
          console.error(error)
        })
    }

  }

  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  // displays the content of the active dashboard
  renderDashboard = (dashboard) => {
    if ((typeof dashboard.tiles) === 'string') {
      dashboard.tiles = JSON.parse(dashboard.tiles);
    }
    if (dashboard.tiles && dashboard.tiles.length !== 0) {
      return (
        <div>
          <Fullscreen enabled={this.state.isFull}  onChange={isFull => this.setState({isFull})} >
          <InsightPage allData={dashboard.tiles} dashboard={dashboard} />
          </Fullscreen>
        </div>)
    }
    return (<p style={{ textAlign: 'center' }}>You have no pins saved to this dashboard</p>)

  }
  renderTabPlane = (dashboard, profile) => {
    if (dashboard.department && profile.role === 'Administrator') {
      return (<TabPane tab={<span><Icon type="team" />{dashboard.title}</span>} key={dashboard._id} >
        {//display pin
          this.renderDashboard(dashboard)
        }
      </TabPane>)
    } else if (dashboard.department) {
      return (<TabPane tab={dashboard.title} key={dashboard._id} closable={false}>
        {//display pin
          this.renderDashboard(dashboard)
        }
      </TabPane>)

    } else {
      return (<TabPane tab={dashboard.title} key={dashboard._id}>
        {//display pin
          this.renderDashboard(dashboard)
        }
      </TabPane>)
    }
  }
  onClick = (event) => {
    if (event.key === 'expand') {
      this.setState({isFull: true})
    } else {
      console.log(event.key)
    }
  }
  render() {
    const { showWelcome, dashboards } = this.state;
    const { profile } = this.props;
    console.log(dashboards)
    return (
      <div >
        {showWelcome &&
          <WelcomeCard clickHandler={this.clickHandler} />
        }
        <Weather />
        <LayoutContentWrapper style={{ paddingTop: '20px' }} >
          <h1 style={{ paddingBottom: '5px' }} >My Dashboards</h1>
          <div style={{ marginLeft: 'auto', marginRight: '0', marginTop: '5px' }}>
            <Dropdown trigger={['click']} overlay={
              <Menu onClick={this.onClick}>
                <Menu.Item key='expand'> Expand </Menu.Item>
                <Menu.Item key='addCard'> Add Card </Menu.Item>
                <Menu.Item key='edeit'> Edit </Menu.Item>
              </Menu>
            }>
              <Button type='primary' size='small'>More</Button>
            </Dropdown>
            <Modal
              wrapClassName="vertical-center-modal"
              title="Create New Dashboard"
              visible={this.state.visible}
              onOk={this.handleOk}
              confirmLoading={this.state.confirmLoading}
              onCancel={this.handleCancel}
            >
              <Form>
                <FormItem {...formItemLayout} label="Title" validateStatus={error[this.state.error].validateStatus} help={error[this.state.error].help} >
                  <Input id="title" onChange={this.onChange} value={this.state.title} />
                  <Checkbox onChange={() => { this.setState({ departDash: true }) }}>Set as Department Dashboard</Checkbox>
                </FormItem>
              </Form>
            </Modal>
          </div>
          <TableStyle className="isoLayoutContent">
            <Tabs className="isoTableDisplayTab"
              onChange={this.onTabClick}
              activeKey={this.state.activeKey}
              type="editable-card"
              onEdit={this.onEdit}>
              {this.state.dashboards.map(dashboard => (
                this.renderTabPlane(dashboard, profile)
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