import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Input from '../../components/uielements/input';
import Checkbox from '../../components/uielements/checkbox';
import Button from '../../components/uielements/button';
import authAction from '../../redux/auth/actions';
import IntlMessages from '../../components/utility/intlMessages';
import SignUpStyleWrapper from './signup.style';

const { login } = authAction;

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      credentials: {name: '', email: '', password: '', confirmPassword: ''}
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
    fetch('http://35.182.224.114:3000/api/register', {
    headers: {
      'Accept': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    
    method: "POST",
    body: `email=${this.state.credentials.email}&name=${this.state.credentials.name}&password=${this.state.credentials.password}&confirmPassword=${this.state.credentials.confirmPassword}`,
})
    .then(response => response.json())
    .then(contents =>{
      console.log(contents.message)
      if (contents.status){
        const { login } = this.props;
        login();
        this.props.history.push('/dashboard')}})
    .catch(() => console.log("Can’t access clara's /api/register endpoint."))
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true
    ) {
      this.setState({ redirectToReferrer: true });
    }
  }
  handleLogin = () => {
    const { login } = this.props;
    login();
    this.props.history.push('/dashboard');
  };
  render() {
    return (
      <SignUpStyleWrapper className="isoSignUpPage">
        <div className="isoSignUpContentWrapper">
          <div className="isoSignUpContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <IntlMessages id="page.signUpTitle" />
              </Link>
            </div>

            <div className="isoSignUpForm">
              <div className="isoInputWrapper isoLeftRightComponent">
                <Input size="large"
                name="name"
                placeholder="Full name"
                value={this.state.credentials.name}
                onChange={this.onChange}
                />
              </div>

              <div className="isoInputWrapper">
                <Input size="large"
                name="email"
                placeholder="Email" 
                value={this.state.credentials.email}
                onChange={this.onChange}
                />
              </div>

              <div className="isoInputWrapper">
                <Input size="large"
                name="password"
                type="password"
                placeholder="Password"
                value={this.state.credentials.password}
                onChange={this.onChange}
                />
              </div>

              <div className="isoInputWrapper">
                <Input
                  size="large"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={this.state.credentials.confirmPassword}
                  onChange={this.onChange}
                />
              </div>

              <div className="isoInputWrapper" style={{ marginBottom: '50px' }}>
                <Checkbox>
                  <IntlMessages id="page.signUpTermsConditions" />
                </Checkbox>
              </div>

              <div className="isoInputWrapper">
                <Button type="primary" onClick={this.onSave}>
                  <IntlMessages id="page.signUpButton" />
                </Button>
              </div>
              
              <div className="isoInputWrapper isoCenterComponent isoHelperWrapper">
                <Link to="/signin">
                  <IntlMessages id="page.signUpAlreadyAccount" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SignUpStyleWrapper>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: state.Auth.get('idToken') !== null ? true : false,
  }),
  { login }
)(SignUp);
