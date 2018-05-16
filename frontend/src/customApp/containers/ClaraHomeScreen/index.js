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
import InsightPage from '../insightPages'

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
      dashboards: this.props.profile.dashboards,
      activeKey: (this.props.profile.dashboards[0] ? this.props.profile.dashboards[0]._id : '')
    };
    this.clickHandler = this.clickHandler.bind(this)
    this.onChange = this.onChange.bind(this)
    // this.setTile = this.setTile.bind(this)
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
  //Creates and addes a new dashboard to a the current user
  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    //Checks if the user entered a title for their new dashboard
    if (this.state.title) {
      // fetch('http://35.182.255.76/dashboard', {
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
        //if a new dashboard is created correctly it will add it to the user's dashboard list
        if(!responseJson.message){
          var dashboards = this.state.dashboards;      
          dashboards.push(responseJson)
          if(dashboards.length === 1){
            this.setState({activeKey: dashboards[0]._id})
          }
          this.setState({error: 0, title: '', confirmLoading:false, visible:false, dashboards: dashboards })        
          this.props.updateUser()
        } else {
          // displays server error
          this.setState({error: 2, confirmLoading: false})
          console.log(responseJson.message)
        }
      })
      .catch((error) => {
        // displays server error
        this.setState({error: 2, confirmLoading: false})
        console.log(error);
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

  onTabClick = (activeKey) => {
    this.setState({activeKey: activeKey});
  }
  // deletes dashboard from user's dashboard list
  onDelete = (targetKey) => {
    // fetch(`http://35.182.255.76/dashboard/${targetKey}`,{
      fetch(`http://localhost:1337/dashboard/${targetKey}`,{
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
          var index = this.state.dashboards.findIndex(x => x._id===targetKey);
          if (index === 0) {
            dashboards.length === 0 ? this.setState({activeKey: ''}) : this.setState({activeKey : dashboards[0]._id}) 
          } else {
            this.setState({activeKey: this.state.dashboards[index-1]._id})
          }
        }
        this.setState({dashboards: dashboards});
        this.props.updateUser();
        var updatedProfile = this.props.profile;
        updatedProfile.dashboards = dashboards;
        localStorage.setItem('profile', JSON.stringify(updatedProfile))
      } else {
        //displays server errors
        console.log(responseJson.message)
      }
    })
    .catch(error =>{
      //displays server error
      console.log(error)
    })
  }
  renderDashboard = (dashboard)=> {
    if (dashboard.tiles) {
      if((typeof dashboard.tiles) === 'string'){
        dashboard.tiles = JSON.parse(dashboard.tiles);
      }
      return(
        <div>
          <InsightPage allData={dashboard.tiles} dashboard={dashboard} updateDash={this.updateDash} />
        </div>)
    } else {
      return (<p style={{textAlign:'center'}}>You have no pins saved to this dashboard</p>)
    }  
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
            <Tabs className="isoTableDisplayTab" 
            hideAdd
            onChange={this.onTabClick}
            activeKey={this.state.activeKey}
            type="editable-card"
            onEdit={this.onDelete}>
              {this.state.dashboards.map(dashboard => (
                <TabPane tab={dashboard.title} key={dashboard._id}>
                  {//display pin
                    this.renderDashboard(dashboard)
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