import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '../components/uielements/menu';
import IntlMessages from '../components/utility/intlMessages';

export default function(url, submenuColor) {
  const sidebars = [];
  sidebars.push(
    <Menu.Item key="settings">
      <Link to={`${url}/blank_page`}>
        <span className="isoMenuHolder" style={submenuColor}>
          <i className="ion-gear-b" />
          <span className="nav-text">
            <IntlMessages id="sidebar.settings" />
          </span>
        </span>
      </Link>
    </Menu.Item>
  );
  sidebars.push(
    <Menu.Item key="blank_page">
      <Link to={`${url}/blank_page`}>
        <span className="isoMenuHolder" style={submenuColor}>
          <i className="ion-document" />
          <span className="nav-text">
            <IntlMessages id="sidebar.blankPage" />
          </span>
        </span>
      </Link>
    </Menu.Item>
  );
  return sidebars;
}
