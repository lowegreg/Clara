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
      credentials: {email: '', password: ''}
    };
    this.onChange=this.onChange.bind(this)
    this.onSave=this.onSave.bind(this)
  }
  onChange(event) {  
    const field = event.target.name;
    const credentials = this.state.credentials;
    credentials[field] = event.target.value;
    return this.setState({credentials: credentials});
  }
  onSave(event) {
    event.preventDefault();
    fetch('http://35.182.224.114:3000/api/authenticate', {
    headers: {
      'Accept': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    
    method: "POST",
    body: `email=${this.state.credentials.email}&password=${this.state.credentials.password}`,
})
    .then(response => response.json())
    .then(contents =>{
      if (contents.status){
       const { login } = this.props;
      login();
      this.props.history.push('/dashboard')}})
    .catch(() => console.log("Can’t access clara's /api/authenticate response."))
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true
    ) {
      this.setState({ redirectToReferrer: true });
      console.log('in componentWillReciveProps')
    }
    console.log('in componentWillReciveProps')
  }
  handleLogin = () => {
    const { login } = this.props;
    login();
    this.props.history.push('/dashboard');
  };
  render() {
    const from = { pathname: '/dashboard' };
    
    if (this.state.redirectToReferrer) {
      console.log(`redirect is true`)
      return <Redirect to={from} onChange={this.handleLogin}/>;
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

            <div className="isoSignInForm">
              <div className="isoInputWrapper">
                <Input size="large" placeholder="Username"
                  name="email"
                  label="email"
                  value={this.state.credentials.email}
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
                <Button type="primary" onClick={this.onSave}>
                  <IntlMessages id="page.signInButton" />
                </Button>
              </div>

              <p className="isoHelperText">
                <IntlMessages id="page.signInPreview" />
              </p>

              
              <div className="isoCenterComponent isoHelperWrapper">
                <Link to="/forgotpassword" className="isoForgotPass">
                  <IntlMessages id="page.signInForgotPass" />
                </Link>
                <Link to="/signup">
                  <IntlMessages id="page.signInCreateAccount" />
                </Link>
              </div>
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
  }),
  { login }
)(SignIn);
