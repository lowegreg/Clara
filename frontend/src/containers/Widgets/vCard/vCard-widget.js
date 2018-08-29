import React, { Component } from 'react';
import { VCardWidgetWrapper } from './style';

export default class VCardWidget extends Component {
  render() {
    const { src, alt, name, title, description, children, style } = this.props;
    return (
      <VCardWidgetWrapper className="isoVCardWidgetWrapper" style={style}>
        <div className="isoVCardImage">
          <img src={src} alt={alt} />
        </div>

        <div className="isoVCardBody">
          <h3 className="isoName">
            {name}
          </h3>
          <span className="isoDesgTitle">
            {title}
          </span>

          <div className="isoDescription">
            {description}
          </div>

          <div className="isoWidgetSocial">
            {children}
          </div>
        </div>
      </VCardWidgetWrapper>
    );
  }
}
