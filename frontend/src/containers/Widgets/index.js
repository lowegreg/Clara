import React, { Component } from 'react';
import clone from 'clone';
import { Row, Col } from 'antd';
import basicStyle from '../../config/basicStyle';
// import IsoWidgetsWrapper from './widgets-wrapper';
// import IsoWidgetBox from './widget-box';
// import CardWidget from './card/card-widgets';
// import ProgressWidget from './progress/progress-widget';
// import SingleProgressWidget from './progress/progress-single';
// import ReportsWidget from './report/report-widget';
// import StickerWidget from './sticker/sticker-widget';
// import SaleWidget from './sale/sale-widget';
// import VCardWidget from './vCard/vCard-widget';
// import SocialWidget from './social-widget/social-widget';
// import SocialProfile from './social-widget/social-profile-icon';
import userpic from '../../image/user1.png';
// import { TableViews, tableinfos, dataList } from '../Tables/antTables';
import IntlMessages from '../../components/utility/intlMessages';

// const tableDataList = clone(dataList);
// tableDataList.size = 5;

export default class IsoWidgets extends Component {
  render() {
    const { rowStyle, colStyle } = basicStyle;
    const wisgetPageStyle = {
      display: 'flex',
      flexFlow: 'row wrap',
      alignItems: 'flex-start',
      padding: '15px',
      overflow: 'hidden'
    };

    const chartEvents = [
      {
        eventName: 'select',
        callback(Chart) {}
      }
    ];

    return (
      <div style={wisgetPageStyle}>
        <Row style={rowStyle} gutter={0} justify="start">
          <Col md={8} sm={24} xs={24} style={colStyle}>
           
          </Col>

          
        </Row>

        <Row style={rowStyle} gutter={0} justify="start">
          

          <Col md={8} sm={12} xs={24} style={colStyle}>
            
          </Col>
        </Row>
      </div>
    );
  }
}
