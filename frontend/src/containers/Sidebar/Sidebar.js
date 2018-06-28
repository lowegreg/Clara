import React, { Component } from 'react';
import { connect } from 'react-redux';
import clone from 'clone';
import { Link } from 'react-router-dom';
import { Layout, Carousel } from 'antd';
import Menu from '../../components/uielements/menu';
import IntlMessages from '../../components/utility/intlMessages';
import getDevSidebar from '../../customApp/sidebar';
import SidebarWrapper from './sidebar.style';
import appActions from '../../redux/app/actions';
import Logo from '../../components/utility/logo';
import { rtl } from '../../config/withDirection';
import Knob from '../../customApp/components/react/react-canvas-knob';
import { Row } from 'react-flexbox-grid';
import './styles.css';

const SubMenu = Menu.SubMenu;
//const MenuItemGroup = Menu.ItemGroup;
const { Sider } = Layout;

const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed
} = appActions;
const stripTrailingSlash = str => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
};
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
    this.state = {
      statsArray: [
        {
          title: 'Total number of data sets being used',
          value: 20,
          total: 300
        },
        {
          title: 'Total number of open data sets being used',
          value: 80,
          total: 100
        },
        {
          title: 'Total number of third party data sets being use',
          value: 120,
          total: 200
        },
      ]
    }
  }
  setArray(data) {
    var totalOpen = data.filter(value => value.statusId === 'accepted').length
    var totalAll = totalOpen + 3
    var totalThird = totalOpen + 1
    var statsArray = this.state.statsArray
    statsArray[0].value = totalAll
    statsArray[0].total = data.length
    statsArray[1].value = totalOpen
    statsArray[1].total = data.length
    statsArray[2].value = totalThird
    statsArray[2].total = data.length - 23
    this.setState({
      statsArray: statsArray
    })
  }
  componentDidMount() {
    fetch('http://35.182.224.114:3000/tableLookUp', { method: 'GET', mode: 'cors' })
      .then((response) => response.json())
      .then(responseJson => {
        responseJson.tableId.forEach(function (obj) { obj.key = responseJson.tableId });
        this.setArray(responseJson.tableId)
      })
      .catch((error) => {
        console.error(error);
      });
  }
  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === 'MobileView') {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }
  onOpenChange(newOpenKeys) {
    const { app, changeOpenKeys } = this.props;
    const latestOpenKey = newOpenKeys.find(
      key => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      key => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }
  getAncestorKeys = key => {
    const map = {
      sub3: ['sub2']
    };
    return map[key] || [];
  };

  renderView({ style, ...props }) {
    const viewStyle = {
      marginRight: rtl === 'rtl' ? '0' : '-17px',
      paddingRight: rtl === 'rtl' ? '0' : '9px',
      marginLeft: rtl === 'rtl' ? '-17px' : '0',
      paddingLeft: rtl === 'rtl' ? '9px' : '0'
    };
    return (
      <div className="box" style={{ ...style, ...viewStyle }} {...props} />
    );
  }

  handleChange = (newValue) => {
    this.setState({ value: newValue });
  };
  render() {
    // const { url, app, toggleOpenDrawer, bgcolor } = this.props;
    const { app, toggleOpenDrawer, customizedTheme } = this.props;
    const url = stripTrailingSlash(this.props.url);
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const { openDrawer } = app;
    const mode = collapsed === true ? 'vertical' : 'inline';
    const onMouseEnter = event => {
      if (openDrawer === false) {
        toggleOpenDrawer();
      }
      return;
    };
    const onMouseLeave = () => {
      if (openDrawer === true) {
        toggleOpenDrawer();
      }
      return;
    };
    const scrollheight = app.height;
    const styling = {
      backgroundColor: customizedTheme.backgroundColor,
      height: scrollheight, overflow: 'auto', overflowX: 'hidden'
    };
    const styling2 = {
      backgroundColor: customizedTheme.backgroundColor,
      height: scrollheight, overflow: 'hidden'
    };
    const submenuStyle = {
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: customizedTheme.textColor
    };
    const submenuColor = {
      color: customizedTheme.textColor
    };
    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          width="240"
          className="isomorphicSidebar"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={styling2}
        >
          <Logo collapsed={collapsed} />
          <div style={styling} className="scrollbar" id="style-1">
            {!collapsed &&
              <div style={{ width: '225px', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Carousel autoplay autoplaySpeed={6000}>
                  {this.state.statsArray.map((stat, key) => (
                    <div style={{ height: '180px' }} key={key}>
                      <Row style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: '30px', marginBottom: '20px' }}>
                        <Knob
                          value={stat.value}
                          onChange={this.handleChange}
                          width={100}
                          height={50}
                          max={stat.total}
                          angleArc={180}
                          angleOffset={-90}
                          title={stat.title}
                          fgColor={'#4dc3ce'}
                          disableMouseWheel
                        />
                      </Row>
                      <Row style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: '0px', }}>
                        <div style={{ width: '150px', textAlign: 'center' }}><p style={{ color: 'white' }}>{stat.title}</p></div>
                      </Row>
                    </div>
                  ))}
                </Carousel >
              </div>
            }

            <Menu
              onClick={this.handleClick}
              theme="dark"
              mode={mode}
              openKeys={collapsed ? [] : app.openKeys}
              selectedKeys={app.current}
              onOpenChange={this.onOpenChange}
              className="isoDashboardMenu"

            >
              <Menu.Item key=" " >
                <Link to={`${url}`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-ios-home-outline" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.dashboard" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <SubMenu
                key="stories"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-stats-bars" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.stories" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="Live" >
                  <Link style={submenuColor} to={`${url}/open_data/live`}>
                    <IntlMessages id="sidebar.live" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="Open Data" >
                  <Link style={submenuColor} to={`${url}/open_data/open`}>
                    <IntlMessages id="sidebar.open" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="Third Party" >
                  <Link style={submenuColor} to={`${url}/open_data/third party`}>
                    <IntlMessages id="sidebar.thirdParty" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="Imported" >
                  <Link style={submenuColor} to={`${url}/open_data/imported`}>
                    <IntlMessages id="sidebar.imported" />
                  </Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu
                key="builder"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-map" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.builder" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="Clara Stories" >
                  <Link style={submenuColor} to={`${url}/comingSoon`}>
                    <IntlMessages id="sidebar.claraStories" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="User Stories" >
                  <Link style={submenuColor} to={`${url}/comingSoon`}>
                    <IntlMessages id="sidebar.userStories" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="New Stories" >
                  <Link style={submenuColor} to={`${url}/create`}>
                    <IntlMessages id="sidebar.createdStories" />
                  </Link>
                </Menu.Item>
              </SubMenu>

              <Menu.Item key="Reports" >
                <Link to={`${url}/comingSoon`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-ios-list-outline" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.reports" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="Clara Suggestions" >
                <Link to={`${url}/ideas`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-bulb" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.suggestions" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              {this.props.profile.role === 'Administrator' &&
                <SubMenu
                  key="Admin"
                  title={
                    <span className="isoMenuHolder" style={submenuColor}>
                      <i className="ion-ios-people-outline" />
                      <span className="nav-text">
                        <IntlMessages id="sidebar.admin" />
                      </span>
                    </span>
                  }
                >
                  <Menu.Item style={submenuStyle} key="Data Managment -Admin" >
                    <Link style={submenuColor} to={`${url}/dataManagementAdmin`}>
                      <IntlMessages id="sidebar.dataManage" />
                    </Link>
                  </Menu.Item>
                  <Menu.Item style={submenuStyle} key="Suggestion Manager" >
                    <Link style={submenuColor} to={`${url}/adminSuggestions`}>
                      <IntlMessages id="sidebar.suggestionManage" />
                    </Link>
                  </Menu.Item>
                  <Menu.Item style={submenuStyle} key="User Settings" >
                    <a target="_blank" href={`http://ec2-35-182-255-76.ca-central-1.compute.amazonaws.com/admin/`}>
                      <IntlMessages id="sidebar.userSettings" />
                    </a>
                  </Menu.Item>

                </SubMenu>
              }

              {getDevSidebar(url, submenuColor)}
            </Menu>
          </div>
        </Sider>
      </SidebarWrapper>
    );
  }
}

export default connect(
  state => ({
    app: state.App.toJS(),
    profile: state.Auth.get('profile'),
    customizedTheme: state.ThemeSwitcher.toJS().sidebarTheme
  }),
  { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed }
)(Sidebar);
