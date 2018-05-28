import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Popover from '../../components/uielements/popover';
import IntlMessages from '../../components/utility/intlMessages';
import userpic from '../../image/user1.png';
import authAction from '../../redux/auth/actions';
import TopbarDropdownWrapper from './topbarDropdown.style';

const { logout } = authAction;

class TopbarUser extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false,
      redirect: ''
    };
  }
  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }
  componentDidUpdate(prevProps, prevState){
    if(!prevProps.redirect && this.state.redirect){
      this.setState({redirect: ''})
  }
}

  render() {
    if (this.state.redirect) {
      var path = { pathname:`${this.props.url}/user/${this.state.redirect}`}
      return <Redirect to={path}/>;
    }
    return (
      <Popover
        content={
          <TopbarDropdownWrapper className="isoUserDropdown">
          {/* hides setting tab when on setting page */}
          {(this.props.pathname !== `${this.props.url}/user/settings`) && (
              <a className="isoDropdownLink" onClick={() => {
               this.setState({redirect: 'settings'})
              }}>
                <IntlMessages id="themeSwitcher.settings" />
              </a>
            )}
            <a className="isoDropdownLink">
              <IntlMessages id="sidebar.feedback" />
            </a>
            <a className="isoDropdownLink">
              <IntlMessages id="topbar.help" />
            </a>
            <a className="isoDropdownLink" onClick={this.props.logout}>
              <IntlMessages id="topbar.logout" />
            </a>
          </TopbarDropdownWrapper>
        }
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <div className="isoImgWrapper">
          <img alt="user" src={userpic} />
          <span className="userActivity online" />
        </div>
      </Popover>
    );
  }
}
export default connect(null, { logout })(TopbarUser);
