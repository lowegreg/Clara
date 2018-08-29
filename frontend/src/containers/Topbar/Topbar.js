import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import appActions from '../../redux/app/actions';
import TopbarNotification from './topbarNotification';
import TopbarUser from './topbarUser';
import TopbarWrapper from './topbar.style';

const { Header } = Layout;
const { toggleCollapsed } = appActions;

class Topbar extends Component {
  render() {
    const { toggleCollapsed, locale } = this.props;
    const collapsed = this.props.collapsed && !this.props.openDrawer;
    const styling = {
      position: 'fixed',
      width: '100%',
      height: 70
    };
    
    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
          }
        >
          <div className="isoLeft">
            <button
              className={
                collapsed ? 'triggerBtn menuCollapsed' : 'triggerBtn menuOpen'
              }
              onClick={toggleCollapsed}
            />
          </div>
          <h3>{localStorage.getItem('header')}</h3>
          <ul className="isoRight">
            
            <li
              onClick={() => this.setState({ selectedItem: 'notification' })}
              className="isoNotify"
            >
              <TopbarNotification locale={locale} />
            </li>

            <li
              onClick={() => this.setState({ selectedItem: 'user' })}
              className="isoUser"
            >
              <TopbarUser locale={locale} url={this.props.url} pathname={this.props.pathname} profile={this.props.profile}/>
            </li>
          </ul>
        </Header>
      </TopbarWrapper>
    );
  }
}

export default connect(
  state => ({
    ...state.App.toJS(),
    locale: state.LanguageSwitcher.toJS().language.locale,
  }),
  { toggleCollapsed }
)(Topbar);
