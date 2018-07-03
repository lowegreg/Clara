import React, { Component } from 'react';
import Button from '../../../components/uielements/button';
import Dropdown from '../../../components/uielements/dropdown';
import Menu from '../../../components/uielements/menu';
import Input from '../../../components/uielements/input';
import Form from '../../../components/uielements/form';
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';
import { Modal } from 'antd';

const { updateUser } = authAction;
const error = [
  { validateStatus: '', help: '' },
  { validateStatus: 'error', help: 'Please enter title' },
  { validateStatus: 'warning', help: 'The server is down, please try again later' },
]
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
export class PinButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dashboards: this.props.profile.dashboards,
      visible: false,
      confirmLoading: false,
      title: '',
      error: 0,
      savePinPopup: false,
      dashboardIndex: 0,
      type: this.props.type,
      tileVisibility: true

    };

    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this);
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  //Creates and addes a new dashboard to the current user
  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    //Checks if the user entered a title for their new dashboard
    if (this.state.title) {
      var tileList = [];
      var tile = Object.assign(this.props.table);
      tile.type = this.props.type;
      tileList.push(tile);

      fetch('http://35.182.255.76/dashboard', {
        headers: {
          'Accept': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${this.props.jwt}`
        },
        method: "POST",
        body: `user=${this.props.profile.userId}&title=${this.state.title}&tiles=${JSON.stringify(tileList)}`,
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
            this.props.updateDash()
            this.props.updateUser()
          } else {
            // displays server error
            this.setState({ error: 2, confirmLoading: false })
            console.log(responseJson.message)
          }
        })
        .catch((error) => {
          // displays server error
          this.setState({ error: 2, confirmLoading: false })
          console.log(error);
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
  // on click action for the list on dashboards when pinning, you can create a new dashboard or add pin to exsiting dashboard
  onClick(event) {
    if (event.key === 'new') {
      this.setState({ visible: true })
    } else if (event.key === 'all') {
      this.setState({ savePinPopup: true, dashboardIndex: -1 })
    } else {
      var dashboard = this.state.dashboards.filter(function (object) {
        return object._id === event.key;
      })
      var index = this.state.dashboards.indexOf(dashboard[0]);
      this.setState({ savePinPopup: true, dashboardIndex: index })
    }
  }

  addPin = (dashboard, tileList, index) => {
    fetch(`http://35.182.255.76/dashboard/${dashboard._id}`, {
      headers: {
        'Accept': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${this.props.jwt}`
      },
      method: "PUT",
      body: `tiles=${JSON.stringify(tileList)}`,
    })
      .then((response) => response.json())
      .then(responseJson => {
        if (responseJson.n === 1 && responseJson.nModified === 1 && responseJson.ok === 1) {
          var newDashboards = this.state.dashboards
          newDashboards[index].tiles = tileList;
          this.setState({ dashboards: newDashboards, savePinPopup: false })
          this.props.updateUser()
        }
      })
      .catch((error) => {
        // displays server error
        console.log(error);
      })
  }

  // saves pins to dashboard, by editing the tile section
  handleSavePinOk = (event) => {
    var tileList;
    var tile = Object.assign(this.props.table);
    tile.type = this.props.type;
    if (this.state.dashboardIndex !== -1) {
      const dashboardIndex = this.state.dashboardIndex;
      var dashboard = this.state.dashboards[dashboardIndex];

      if (dashboard.tiles) {
        tileList = (typeof dashboard.tiles === 'string') ? JSON.parse(dashboard.tiles) : dashboard.tiles;
      } else {
        tileList = [];
      }
      tileList.push(tile);
      this.addPin(dashboard, tileList, this.state.dashboardIndex)
    } else {
      for (let i = 0; i < this.state.dashboards.length; i++) {
        const dashboard = this.state.dashboards[i];
        if (dashboard.tiles) {
          tileList = (typeof dashboard.tiles === 'string') ? JSON.parse(dashboard.tiles) : dashboard.tiles;
        } else {
          tileList = [];
        }
        tileList.push(tile);
        this.addPin(dashboard, tileList, i);
      }

    }
  }
  handleSavePinCancel = () => {
    this.setState({ savePinPopup: false })
  }

  // determines which type of button (and functionality) to an insight tile based on where it is being rendered
  renderType = () => {
    if (this.props.type !== 'dash') {
      return (
        <Dropdown overlay={
          <Menu onClick={this.onClick}>
            {this.state.dashboards.map(dashboard => (
              <Menu.Item key={dashboard._id}> {dashboard.title} </Menu.Item>
            ))}
            {this.state.dashboards.length > 1 &&
              <Menu.Item key='all'> All Dashboards </Menu.Item>}
            <Menu.Item key='new'> Create New Dashboard </Menu.Item>
          </Menu>
        } >
          <Button icon="pushpin" type="button" ghost />
        </Dropdown>
      )
    } else {
      return (
        <Button icon="close" type="button" onClick={this.removePin} ghost />
      )
    }
  }
  componentWillUnmount() {
    this.setState({
      visible: false,
      confirmLoading: false,
      title: '',
      error: 0,
      savePinPopup: false,
      dashboardIndex: 0,
      type: this.props.type,
      tileVisibility: true
    })
  }
  render() {
    return (
      <div>
        <Dropdown overlay={
          <Menu onClick={this.onClick}>
            {this.state.dashboards.map(dashboard => (
              <Menu.Item key={dashboard._id}> {dashboard.title} </Menu.Item>
            ))}
            {this.state.dashboards.length > 1 &&
              <Menu.Item key='all'> All Dashboards </Menu.Item>}
            <Menu.Item key='new'> Create New Dashboard </Menu.Item>
          </Menu>
        } >
          <Button icon="pushpin" type="button" ghost />
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
            </FormItem>
          </Form>
        </Modal>

        <Modal
          wrapClassName="vertical-center-modal"
          title="Confirm Pinning"
          visible={this.state.savePinPopup}
          onOk={this.handleSavePinOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleSavePinCancel}
        >
          {this.state.dashboards[0] &&
            <p> Would you like to add <b>{this.props.table.title}</b> to <b>{this.state.dashboardIndex !== -1 ? this.state.dashboards[this.state.dashboardIndex].title : 'All Dashboards'}</b> </p>
          }
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
)(PinButton);