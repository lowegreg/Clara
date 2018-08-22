import React, { Component } from 'react';
import Button from '../../../components/uielements/button';
import { connect } from 'react-redux';
import WelcomeCard from '../../components/welcomeCard/welcomeCard'
import Tabs, { TabPane } from '../../../components/uielements/tabs';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import TableStyle from './tableStyle';
import Input from '../../../components/uielements/input';
import Form from '../../../components/uielements/form';
import { Modal, Checkbox, Icon, Carousel } from 'antd';
import authAction from '../../../redux/auth/actions';
import InsightPage from '../insightPages';
// import FullScreenDashboard from '../../components/dashboards/fullScreen'
import Weather from '../../components/weatherCard';
import Dropdown from '../../../components/uielements/dropdown';
import Menu from '../../../components/uielements/menu';
import Fullscreen from "react-full-screen";
import { Col, Row } from 'react-flexbox-grid';
import { FullScreenDashboard } from '../../components/dashboards/fullScreen';


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
      fullScreenDash: [],
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
    if (title) {

      var api = 'http://35.182.255.76/' + (departDash ? 'sharedDash/' : 'dashboard/');
      var body = (departDash ? `department=${profile.departmentId}` : `user=${profile.userId}`) + '&title=' + title
      fetch(api, {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${jwt}`
        },
        method: "POST",
        body: body,
      })
        .then((response) => response.json())
        .then(responseJson => {
          //if a new dashboard is created correctly it will add it to the user's dashboard list
          if (!responseJson.message) {
            var dashboards = this.state.dashboards;
            if (departDash) {
              const index = dashboards.findIndex((dash) => { return dash.user })
              responseJson.department = this.props.profile.department;
              dashboards.splice(index, 0, responseJson)
            } else {
              dashboards.push(responseJson)
            }
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
    var api = 'http://35.182.255.76/' + (dash.department ? 'sharedDash/' : 'dashboard/') + targetKey;
    fetch(api, {
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

  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  // displays the content of the active dashboard
  renderDashboard = (dashboard, isFull) => {
    if ((typeof dashboard.content) === 'string') {
      dashboard.content = JSON.parse(dashboard.content);
    }
    if (dashboard.content && dashboard.content.length !== 0) {
      return (<div>
        <InsightPage allData={dashboard.content} dashboard={dashboard} isFull={isFull} />
      </div>)
    }
    return (<p style={{ textAlign: 'center' }}>You have no pins saved to this dashboard</p>)
  }
  getFullScreenDashboard = (dashboard) => {
    var fullScreenDash = [];
    for (let i = 0; i < Math.ceil(dashboard.content.length / 4); i++) {
      fullScreenDash.push(
        dashboard.content.slice((4 * i), (4 * i) + 4)
      )
    }
    return fullScreenDash;
  }
  renderTabPlane = (dashboard, profile) => {
    const { isFull } = this.state
    if (dashboard.department && profile.role === 'Administrator') {
      return (<TabPane tab={<span><Icon type="team" />{dashboard.title}</span>} key={dashboard._id} >
        {this.renderDashboard(dashboard, isFull)}
      </TabPane>)
    } else if (dashboard.department) {
      return (<TabPane tab={dashboard.title} key={dashboard._id} closable={false} >
        {//display pin
          this.renderDashboard(dashboard, isFull)
        }
      </TabPane>)
    } else {
      return (<TabPane tab={dashboard.title} key={dashboard._id}>
        {//display pin
          this.renderDashboard(dashboard, isFull)
        }
      </TabPane>)
    }
  }
  onClick = (event) => {
    if (event.key === 'expand') {
      const { dashboards, activeKey } = this.state;
      var index = dashboards.findIndex((dash) => { return activeKey === dash._id })
      var dash = dashboards[index]
      var fullScreenDash = this.getFullScreenDashboard(dash);
      this.setState({ isFull: true, fullScreenDash })
    } else {
      console.log(event.key)
    }
  }

  render() {
    const { showWelcome, isFull, fullScreenDash} = this.state;
    const { profile } = this.props;
    return (
      <div >
        {showWelcome &&
          <WelcomeCard clickHandler={this.clickHandler} />
        }
        <Weather />
        <LayoutContentWrapper style={{ paddingTop: '20px' }} >
          <Col style={{ padding: '20px', width: '100%' }}>
            <Row style={{}}>
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
              </div>
            </Row>
            <Fullscreen enabled={isFull} onChange={isFull => this.setState({ isFull })}>
              <Row >
                {isFull ?
                  <Col style={{ marginLeft: '15px', background: '#f3f3f3', width: window.innerWidth, height: window.innerHeight }}>
                    <div>
                      <Carousel 
                      autoplay={fullScreenDash.length>4? true : false}
                      >
                        {this.state.fullScreenDash.map((page,key) => ( 
                           <div key={key} style={{ background: '#f3f3f3', width: window.innerWidth, height: '99', marginLeft: '15px' }}>
                          <FullScreenDashboard style={{width: window.innerWidth, height: window.innerHeight }} allData={page} dashboard={fullScreenDash} isFull={isFull} />    
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  </Col>
                  :
                  <TableStyle className="isoLayoutContent" >
                    <Tabs className="isoTableDisplayTab"
                      onChange={this.onTabClick}
                      activeKey={this.state.activeKey}
                      type="editable-card"
                      style={{ width: '100%' }}
                      onEdit={this.onEdit}>
                      {this.state.dashboards.map(dashboard => (
                        this.renderTabPlane(dashboard, profile)
                      ))}
                    </Tabs>
                  </TableStyle>}
              </Row>
            </Fullscreen>
          </Col>
        </LayoutContentWrapper>
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