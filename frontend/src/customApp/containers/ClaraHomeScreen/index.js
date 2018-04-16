import React, { Component } from 'react';
import { connect } from 'react-redux';
import WelcomeCard from '../../components/welcomeCard'
import Tabs, { TabPane } from '../../../components/uielements/tabs';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import TableDemoStyle from './tableStyle';

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWelcome: true,
    };
    this.clickHandler = this.clickHandler.bind(this)
  }

  clickHandler(event) {
    this.setState({
      showWelcome: false
    })
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
        <TableDemoStyle className="isoLayoutContent">
          <Tabs className="isoTableDisplayTab">
            {this.props.profile.dashboards.map(dashboard => (
              <TabPane tab={dashboard.title} key={dashboard._id}>
                {
                }
              </TabPane>
            ))}
          </Tabs>
        </TableDemoStyle>
      </LayoutContentWrapper>
      </div>      
    );
  }
}

export default connect(
  state => ({
    profile: state.Auth.get('profile'),
  }),
)(Dashboard);