import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { Debounce } from 'react-throttle';
import WindowResizeListener from 'react-window-size-listener';
import { ThemeProvider } from 'styled-components';
import authAction from '../../redux/auth/actions';
import appActions from '../../redux/app/actions';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import AppRouter from './AppRouter';
import { siteConfig } from '../../config.js';
import { AppLocale } from '../../dashApp';
import themes from '../../config/themes';
import AppHolder from './commonStyle';
import './global.css';

const { Content, Footer } = Layout;
const { logout } = authAction;
const { toggleAll } = appActions;

export class App extends Component {
 
  render() {
    const { url } = this.props.match;
    const { locale } = this.props;
    const currentAppLocale = AppLocale[locale];
    const to = { pathname: '/signin' };
    if(!this.props.isLoggedIn){
      return <Redirect to={to}/>;
    }
    return (
      <LocaleProvider locale={currentAppLocale.antd}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}>
          <ThemeProvider theme={themes['themedefault']}>
            <AppHolder>
              <Layout style={{ height: '100vh' }}>
                <Debounce time="1000" handler="onResize">
                  <WindowResizeListener
                    onResize={windowSize =>
                      this.props.toggleAll(
                        windowSize.windowWidth,
                        windowSize.windowHeight
                      )}
                  />
                </Debounce>
                <Topbar url={url} profile={this.props.profile} pathname={this.props.location.pathname} />
                <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
                  <Sidebar url={url} />
                  <Layout
                    className="isoContentMainLayout"
                    style={{
                      height: '100vh',
                    }}>
                    <Content
                      className="isomorphicContent"
                      style={{
                        padding: '70px 0 0',
                        flexShrink: '0',
                        background: '#f1f3f6',
                      }}>
                      <AppRouter url={url} />
                    </Content>
                    <Footer
                      style={{
                        background: '#ffffff',
                        textAlign: 'center',
                        borderTop: '1px solid #ededed',
                      }}>
                      {siteConfig.footerText}
                    </Footer>
                  </Layout>
                </Layout>      
              </Layout>
            </AppHolder>
          </ThemeProvider>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

export default connect(
  state => ({
    auth: state.Auth,
    locale: state.LanguageSwitcher.toJS().language.locale,
    profile: state.Auth.get('profile'),
    isLoggedIn: state.Auth.get('profile')!==null && state.Auth.get('idToken') !== null ? true : false,
  }),
  { logout, toggleAll }
)(App);
