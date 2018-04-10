import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Input from '../../components/uielements/input';
import Checkbox from '../../components/uielements/checkbox';
import Button from '../../components/uielements/button';
import authAction from '../../redux/auth/actions';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';

const { login } = authAction;

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      credentials: {identifier: '', password: ''}
    };
    this.onChange=this.onChange.bind(this);
    this.onClick=this.onClick.bind(this);
  }
  onChange(event) {  
    const field = event.target.name;
    const credentials = this.state.credentials;
    credentials[field] = event.target.value;
    return this.setState({credentials: credentials});
  }
  onClick(){
    const { login } = this.props;
    login(this.state.credentials);
    this.props.history.push('/dashboard');
  }
  componentDidMount() {
    if (this.props.isLoggedIn === true) {
      this.setState({ redirectToReferrer: true });
    }
  }
  render() {
    const from = { pathname: '/dashboard' };
    if (this.state.redirectToReferrer) {
      return <Redirect to={from} onChange={this.handleLogin} history={this.props.history}/>;
    }
    return (
      <SignInStyleWrapper className="isoSignInPage">
        <div className="isoLoginContentWrapper">
          <div className="isoLoginContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <IntlMessages id="page.signInTitle" />
              </Link>
            </div>
            <div style={{color: 'red'}}>
             {this.props.errorMesssage} 
            </div>
            <div className="isoSignInForm">
              <div className="isoInputWrapper">
                <Input size="large" placeholder="Username"
                  name="identifier"
                  label="identifier"
                  value={this.state.credentials.identifier}
                  onChange={this.onChange} 
                />
              </div>

              <div className="isoInputWrapper">
                <Input size="large" type="password" placeholder="Password" 
                  name="password" 
                  label="password"
                  value={this.state.credentials.password}
                  onChange={this.onChange} 
                  />
              </div>

              <div className="isoInputWrapper isoLeftRightComponent">
                <Checkbox>
                  <IntlMessages id="page.signInRememberMe" />
                </Checkbox>
                <Button type="primary" onClick={this.onClick}>
                  <IntlMessages id="page.signInButton" />
                </Button>
              </div>


{/*               
              <div className="isoCenterComponent isoHelperWrapper">
                <Link to="/forgotpassword" className="isoForgotPass">
                  <IntlMessages id="page.signInForgotPass" />
                </Link>
                <Link to="/signup">
                  <IntlMessages id="page.signInCreateAccount" />
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </SignInStyleWrapper>
    );
  }
}
export default connect(
  state => ({
    isLoggedIn: state.Auth.get('idToken') !== null ? true : false,
    errorMesssage: state.Auth.get('errorMessage'),
    profile: state.Auth.get('profile'),
  }),
  { login }
)(SignIn);
