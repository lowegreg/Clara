import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../components/uielements/button';
import actions from '../../redux/languageSwitcher/actions';
import config from './config';

const { switchActivation, changeLanguage } = actions;

class LanguageSwitcher extends Component {
  render() {
    const {
      isActivated,
      language,
      switchActivation,
      changeLanguage
    } = this.props;
    return (
      <div className="isoButtonWrapper">
        <Button type="primary" className="" onClick={switchActivation}>
          Switch Language
        </Button>

      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.LanguageSwitcher.toJS()
  }),
  { switchActivation, changeLanguage }
)(LanguageSwitcher);
