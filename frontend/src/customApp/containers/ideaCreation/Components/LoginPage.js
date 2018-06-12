// This file contains code for login page, sign up page and forgot password page
// It would be better to organize code by separating all the features into different files

import React, { Component } from 'react';
import Card, { CardActions, CardContent } from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper'
// import Button from 'material-ui/Button';
import Button from '../../../../components/uielements/button';

import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core/Menu';
import Input, { InputLabel } from '@material-ui/core/Input';
import Divider from 'material-ui/Divider';
import logo from './logo.png';
import UserProfile from '../UserProfile';
import './LoginPage.css';
import BackIcon from '@material-ui/icons/Reply';

class LoginPage extends Component {
    loggedIn = false;

    constructor(props) {
        super(props);
        this.state = { //set state value, email and password are set to whatever was last used to login *security risk*
            email: localStorage.getItem('Email') ? localStorage.getItem('Email') : '',
            password: localStorage.getItem('Password') ? localStorage.getItem('Password') : '',
            firstName: '',
            lastName: '',
            department: '',
            user: '',
            remember: false,
            displayLogin: true,
            displaySignup: false,
            displayForgot: false,
            displayResetCode: false,
            loginFailed: '',
            confirmPass: '',
            codeSubmitted: false,
            resetCodeAttempt: '',
            passChangeSuccess: false,
            fromSignup: false
        };
        this.checkRemembered();
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onForgotPress = this.onForgotPress.bind(this);
        this.onSendEmailPress = this.onSendEmailPress.bind(this);
        this.backToLogin = this.backToLogin.bind(this);
        this.onCodeSubmit = this.onCodeSubmit.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    async storeToken(id, dep, view, firstName, lastName) {
        UserProfile.setInfo(id, this.state.email, dep, view, firstName, lastName);
        localStorage.setItem('Email', this.state.email);
        localStorage.setItem('Password', this.state.password);
    }

    async removeToken() {
        //ACCESS_TOKEN="";
    }

    async onLoginPress() {
        // const { email, password } = this.state;
        // if (email.trim() === '') {
        //     this.setState({ loginFailed: "No email address entered." });
        //     //alert('no email');
        // } else if (password.trim() === '') {
        //     this.setState({ loginFailed: "No password entered." });
        //     //alert('no password');
        // } else {
        //     var url = UserProfile.getDatabase() + 'auth/' + email;
        //     try {
                
                // let response = await fetch(url);
                // let responseJson = await response.json();
                // if (response.status >= 200 && response.status < 300) {
                //     if ((responseJson.length < 1)) {
                //         this.setState({ loginFailed: "Incorrect email or password." });
                //         //alert("login information does not match user in database");
                //     } else if (!(!!+responseJson[0].registered)) {
                //         this.setState({ loginFailed: "Please verify your account before signing in." });
                //         //alert('Please verify your account before signing in.')
                //     }else {
                        // let salt;
                        // try {
                        //     let response3 = await fetch(UserProfile.getDatabase()+'auth/GetSalt', {
                        //         method: 'POST',
                        //         headers: {
                        //             'Accept': 'application/json',
                        //             'Content-Type': 'application/json',
                        //         },
                        //         body: JSON.stringify({
                        //             email: email,
                        //         })
                        //     })
                        //     let responseJson3 = await response3.json();
                        //     salt = responseJson3[0].salt;
                        // }catch(err) {
                        //     console.log(err);
                        // }
        //                 try {
        //                     let response2 = await fetch(UserProfile.getDatabase()+'auth/CheckPassword', {
        //                         method: 'POST',
        //                         headers: {
        //                             'Accept': 'application/json',
        //                             'Content-Type': 'application/json',
        //                         },
        //                         body: JSON.stringify({
        //                             email: email,
        //                             password: this.state.password,
        //                             salt: salt
        //                         })
        //                     });
        //                     let responseJson2 = await response2.json();
        //                     if(!!+responseJson2[0].boolean){
        //                         console.log(responseJson);
        //                         let userID = responseJson[0].empID;
        //                         let userDep = responseJson[0].dep;
        //                         let view = responseJson[0].view;
        //                         let userFirstName = responseJson[0].firstName;
        //                         let userLastName = responseJson[0].lastName;
        //                         this.storeToken(userID, userDep, view, userFirstName, userLastName);
                                this.loggedIn = true;
                                this.props.checkLogin(this.loggedIn);
        //                         var localDate = new Date();
        //                         localDate.setSeconds(localDate.getSeconds() - 1);
        //                         try {
        //                             fetch(UserProfile.getDatabase() + 'auth/UpdateLastLogin', {
        //                                 method: 'POST',
        //                                 headers: {
        //                                     'Accept': 'application/json',
        //                                     'Content-Type': 'application/json',
        //                                 },
        //                                 body: JSON.stringify({
        //                                     date: localDate,
        //                                     empID: userID
        //                                 })
        //                             });
        //                         }catch(err) {
        //                             console.log(err);
        //                         }
        //                     }else {
        //                         this.setState({ loginFailed: "Incorrect email or password." });
        //                     }
        //                 }catch(err){
        //                     console.log(err);
        //                 }
        //             }
        //         } else {
        //             localStorage.clear();
        //             alert("login information does not match user in database");
        //             let error = responseJson;
        //             throw error;
        //         }
        //     } catch (e) {
        //         //this.removeToken();
        //         console.error(e);
        //     }
        // }
    }

    onForgotPress () {
        this.setState({ 
            displaySignup: false,
            displayLogin: false, 
            displayForgot: true, 
            loginFailed: '',
            email: '',
            password: '',
        });
    }

    async onSendEmailPress () {
        const { email } = this.state;
        if (email.trim() === '') {
            this.setState({ loginFailed: "No email address entered." });
            //alert('no email');
        } else {
            var url = UserProfile.getDatabase() + 'auth/' + email;
            try {
                let response = await fetch(url);
                let responseJson = await response.json();
                if (response.status >= 200 && response.status < 300) {
                    if (responseJson.length < 1) {
                        this.setState({ loginFailed: "This is not a registered email." });
                    } else if (!(!!+responseJson[0].registered)) {
                        this.setState({ loginFailed: "Please verify your account before resetting your password." });
                    } else {
                        var crypto = require('crypto');
                        var genRandomString = function(length) {
                            return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
                        }
                        let token = genRandomString(16);
                        try {
                            fetch(UserProfile.getDatabase() + 'auth/ForgotPassword', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    token: token,
                                    email: this.state.email
                                })
                            }).then(() => {
                                try {
                                    fetch(UserProfile.getDatabase() + 'mail/ForgotPassword', {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            user: this.state.email,
                                            token: token
                                        })
                                    });
                                    this.setState({ displayResetCode: true, loginFailed: ''});
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    }
                } else {
                    localStorage.clear();
                    //alert("login information does not match user in database");
                    let error = responseJson;
                    throw error;
                }
            } catch (e) {
                //this.removeToken();
                console.error(e);
            }
        }
    }

    async onCodeSubmit () {
        const { email } = this.state;
        var url = UserProfile.getDatabase() + 'auth/' + email;
        try {
            let response = await fetch(url);
            let responseJson = await response.json();
            if (response.status >= 200 && response.status < 300) {
                let accessToken = responseJson[0].accesstoken;

                if (accessToken === this.state.resetCodeAttempt) {
                    if(!this.state.fromSignup){
                        this.setState({ codeSubmitted: true, displayResetCode: false, loginFailed: ''});
                    }else {
                        try {
                            fetch(UserProfile.getDatabase()+'register/'+accessToken);
                        }catch(err) {
                            console.log(err);
                        }
                        this.setState({ displayLogin: true, 
                            displaySignup: false, 
                            displayForgot: false, 
                            displayResetCode: false, 
                            loginFailed: '', 
                            codeSubmitted: false,
                            password: '' });
                    }
                } else {
                    this.setState({loginFailed: 'The code you entered is incorrect.'})
                }
            } else {
                localStorage.clear();
                alert("error");
                let error = responseJson;
                throw error;
            }
        } catch (e) {
            //this.removeToken();
            console.error(e);
        }
        
    }

    async onPasswordChange () {
        if ((this.state.password.length < 6) || (this.state.password.length > 128)) {
            this.setState({ loginFailed: 'Password must be 6 to 128 characters long.' });            
        } else if ((this.state.password.match(/\d+/g) == null) || (this.state.password.match(/[a-z]/) == null) || (this.state.password.match(/[A-Z]/) == null)) {
            this.setState({ loginFailed: 'Password must contain at least one of each: lowercase letter, uppercase letter and number.' });            
        } else if (this.state.password !== this.state.confirmPass) {
            this.setState({ loginFailed: 'Passwords do not match.' });
        } else {
            try {
                fetch(UserProfile.getDatabase() + 'auth/ChangePassword', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: this.state.password,
                        email: this.state.email
                    })
                }).then(() => {
                    this.setState({codeSubmitted: false, passChangeSuccess: true});
                });
            } catch (err) {
                console.log(err);
            }
        }
    }

    backToLogin () {
        this.setState({ 
            displayLogin: true, 
            displaySignup: false, 
            displayForgot: false, 
            displayResetCode: false, 
            loginFailed: '', 
            codeSubmitted: false,
            password: ''
        });
    }

    async onSignupPress() {
        const { email } = this.state;
        var url = UserProfile.getDatabase() + 'auth/' + email;

        try {
            let response = await fetch(url);
            let responseJson = await response.json();
            
            if (this.state.displaySignup) {
                if (this.state.email === '' || this.state.password === '' || this.state.firstName === '' || this.state.lastName === '' || this.state.department === '' || this.state.confirmPass === '') {
                    this.setState({ loginFailed: 'You must fill all fields before you can sign up.' });
                    //alert('Please fill out all fields for sign up.');
                } else if (!this.state.email.endsWith('@internal.on.ca')) {
                    this.setState({ loginFailed: 'You must enter a internal.on.ca email adress.' });                
                } 
                if (responseJson.length > 0) {
                    this.setState({ loginFailed: "An account already exists with this email addresss." });
                    if (!(!!+responseJson[0].registered)) {
                        this.setState({ loginFailed: "This email address has already been registered. Please check your email for verification." });
                    }
                } else if ((this.state.password.length < 6) || (this.state.password.length > 128)) {
                    this.setState({ loginFailed: 'Password must be 6 to 128 characters long.' });            
                } else if ((this.state.password.match(/\d+/g) == null) || (this.state.password.match(/[a-z]/) == null) || (this.state.password.match(/[A-Z]/) == null)) {
                    this.setState({ loginFailed: 'Password must contain at least one of each: lowercase letter, uppercase letter and number.' });            
                } else if (this.state.password !== this.state.confirmPass) {
                    this.setState({ loginFailed: 'Passwords do not match.' });
                } else {
                    var crypto = require('crypto');
                    var genRandomString = function(length) {
                        return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
                    }
                    let token = genRandomString(16);
                    try {
                        fetch(UserProfile.getDatabase() + 'register/signup', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: this.state.email,
                                password: this.state.password,
                                firstName: this.state.firstName,
                                lastName: this.state.lastName,
                                department: this.state.department,
                                token: token
                            })
                        });
                    } catch (err) {
                        console.log(err);
                    }
                    try {
                        fetch(UserProfile.getDatabase() + 'mail/', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: this.state.email,
                                token: token
                            })
                        });
                    } catch (err) {
                        console.log(err);
                    }
                    this.setState({ displaySingup: false, displayForgot: true, displayResetCode: true, fromSignup: true, loginFailed: ''}); 
                }
            } else {
                this.setState({ displaySignup: true, displayLogin: false,  loginFailed: '' });
            }
        } catch (e) {
            console.error(e);
        }
    }

    handleRemember = name => (event, remember) => {
        this.setState({ [name]: remember });
    };

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.onLoginPress();
        }
    }

    checkRemembered() {
        if (this.state.email !== '' && this.state.password !== '') {
            this.onLoginPress();
        }
    }

    render() {
        let pageContent;
        if (this.state.displayLogin) {
            pageContent = (
                <Card style={styles.card}>
                    <CardContent>
                        <Typography type="title" style={styles.title}> Sign In </Typography>

                        <Paper style={styles.login}>
                            <input style={styles.input} className='loginText' type="text" name="email" placeholder="Email"
                                value={this.state.email}
                                onChange={this.handleInputChange}
                                onKeyPress={this.handleKeyPress} />
                            <Divider />
                            <input style={styles.input} className='loginText' type="password" name="password" placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                onKeyPress={this.handleKeyPress}
                            />
                            <Typography style={styles.loginError}> {this.state.loginFailed} </Typography>
                        </Paper>
                    </CardContent>

                    <CardActions>
                        <Checkbox
                            checked={this.state.remember}
                            onChange={this.handleRemember('remember')}
                            style={styles.checkbox}
                            value="remember"
                        />
                        <Typography style={styles.checkboxLabel}> Remember me </Typography>
                        <Typography className="forgot-password" onClick={this.onForgotPress}> Forgot your password? </Typography>
                    </CardActions>

                    <Button style={styles.button} onClick={this.onLoginPress.bind(this)}>
                        Log In
                    </Button>
                    <Typography style={styles.or}> or </Typography>
                    <Button 
                        style={styles.button} 
                        onClick={this.onSignupPress.bind(this)}
                    >
                        Sign Up
                    </Button>
                </Card>
            );
        } else if (this.state.displayForgot) {
            if (!this.state.displayResetCode && !this.state.codeSubmitted && !this.state.passChangeSuccess) {
                pageContent = (
                    <Card style={styles.card}>
                        <CardContent>
                            <Typography type="title" style={styles.title}> Reset your password </Typography>

                            <Typography style={styles.resetInstruct}> Please enter the email address associated with your account. You will recieve an email with a code to reset your password. </Typography>
                            <Paper style={styles.resetEmail}>
                                <input style={styles.input} className='loginText' type="text" name="email" placeholder="Email"
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                    onKeyPress={null} />
                            </Paper>
                            <Typography style={styles.loginError}> {this.state.loginFailed} </Typography>
                        </CardContent>

                        <Button style={styles.button} onClick={this.onSendEmailPress}>
                            Send Email
                        </Button>

                        <Typography className="back-to-login" onClick={this.backToLogin}> <BackIcon/> Sign In </Typography>
                    </Card>
                );
            } else if (this.state.displayResetCode) {
                pageContent = (
                    <Card style={styles.card}>
                    <CardContent>
                        <Typography type="title" style={styles.title}> Enter Code </Typography>

                        <Typography style={styles.resetInstruct}> Please enter the code that was sent to your email address below. </Typography>
                        <Paper style={styles.resetEmail}>
                            <input style={styles.input} className='loginText' type="text" name="resetCodeAttempt"
                                value={this.state.resetCodeAttempt}
                                onChange={this.handleInputChange}
                                onKeyPress={null} />
                        </Paper>
                        <Typography style={styles.loginError}> {this.state.loginFailed} </Typography>
                    </CardContent>

                    <Button style={styles.button} onClick={this.onCodeSubmit}>
                        Submit
                    </Button>

                    <Typography className="back-to-login" onClick={this.backToLogin}> <BackIcon/> Sign In </Typography>
                </Card>
                );
            } else if (this.state.codeSubmitted) {
                pageContent = (
                    <Card style={styles.card}>
                        <CardContent>
                            <Typography type="title" style={styles.title}> Change Password </Typography>
    
                            <Paper style={styles.login}>
                                <input style={styles.input} className='loginText' type="password" name="password" placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    onKeyPress={null}
                                />
                                <Divider />
                                <input style={styles.input} className='loginText' type="password" name="confirmPass" placeholder="Confirm Password"
                                    value={this.state.confrimPass}
                                    onChange={this.handleInputChange}
                                    onKeyPress={null}
                                />
                            </Paper>

                            <Typography style={styles.loginError}> {this.state.loginFailed} </Typography>
                        </CardContent>
    
                        <Button style={styles.button} onClick={this.onPasswordChange}>
                            Change Password
                        </Button>

                        <Typography className="back-to-login" onClick={this.backToLogin}> <BackIcon/> Sign In </Typography>
                    </Card>
                );
            } else if (this.state.passChangeSuccess){
                pageContent = (
                    <Card style={styles.card}>
                        <CardContent>
                            <Typography type="title" style={styles.title}> Password Changed </Typography>
    
                            <Paper style={styles.resetEmail}>
                                <Typography type="title" style={styles.resetInstruct}> Your password has been changed. You can now sign in with your new password. </Typography>
                            </Paper>
                        </CardContent>
    
                        <Typography className="back-to-login" onClick={this.backToLogin}> <BackIcon/> Sign In </Typography>
                    </Card>
                );
            }
        } else if (this.state.displaySignup) {
            pageContent = (
                <Card style={styles.signupCard}>
                    <CardContent>
                        <Typography type="title" style={styles.title}> Sign Up </Typography>

                        <Paper style={styles.signup}>
                            <input style={styles.input} className='loginText' type="text" name="firstName" placeholder="First Name"
                                value={this.state.firstName}
                                onChange={this.handleInputChange}
                                onKeyPress={null} />
                            <Divider />
                            <input style={styles.input} className='loginText' type="text" name="lastName" placeholder="Last Name"
                                value={this.state.lastName}
                                onChange={this.handleInputChange}
                                onKeyPress={null} />
                            <Divider />
                            <CardActions>
                                <InputLabel style={styles.select} htmlFor="age-simple">Department</InputLabel>
                                <Select
                                    value={this.state.department}
                                    onChange={this.handleChange('department')}
                                    input={<Input id="age-simple" />}
                                    style={{ width: '50%' }}
                                >
                                    <MenuItem value="">
                                    </MenuItem>
                                    <MenuItem value={'IT'}>IT</MenuItem>
                                    <MenuItem value={'Risk'}>Risk Cluster</MenuItem>
                                    <MenuItem value={'Strategy'}>Strategy</MenuItem>
                                    <MenuItem value={'Corporate Services'}>Corporate Services</MenuItem>
                                    <MenuItem value={'Service Excellence'}>Service Excellence</MenuItem>
                                    <MenuItem value={'Finance & Employee Services'}>Finance & Employee Services</MenuItem>
                                    <MenuItem value={'Operations'}>Operations</MenuItem>
                                    <MenuItem value={'Innovation'}>Innovation</MenuItem>
                                </Select>
                            </CardActions>
                            <Divider />
                            <input style={styles.input} className='loginText' type="text" name="email" placeholder="Email@internal.on.ca"
                                value={this.state.email}
                                onChange={this.handleInputChange}
                                onKeyPress={null} />
                            <Divider />
                            <input style={styles.input} className='loginText' type="password" name="password" placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                onKeyPress={null}
                            />
                            <Divider />
                            <input style={styles.input} className='loginText' type="password" name="confirmPass" placeholder="Confirm Password"
                                value={this.state.confrimPass}
                                onChange={this.handleInputChange}
                                onKeyPress={null}
                            />
                        </Paper>
                        <Typography style={styles.loginError}> {this.state.loginFailed} </Typography>
                    </CardContent>

                    <Button 
                        className="sign-up-button" style={styles.button} 
                        onClick={this.onSignupPress.bind(this)}
                    >
                        Sign Up
                    </Button>

                    <Typography className="back-to-login" onClick={this.backToLogin}> <BackIcon/> Sign In </Typography>
                </Card>
            );
        } else if (!this.state.displaySignup) {
            pageContent = (
                <Card style={styles.card}>
                    <CardContent>
                        <Typography type="title" style={styles.title}> Verify Your Account </Typography>

                        <Paper style={styles.signup}>
                            <Typography type="title" style={styles.or}> Please check the inbox of the email you entered to verify your account. </Typography>
                        </Paper>
                    </CardContent>

                    <Typography className="back-to-login" onClick={this.backToLogin}> <BackIcon/> Sign In </Typography>
                </Card>
            );
        }  else {
            pageContent = null;
        }

        return (
            <div className='loginForm'>
                <Paper style={styles.icon}>
                    <img src={logo} alt="logo" style={styles.bulb} />
                    <Typography type="title" style={styles.logoText}> ideas </Typography>
                </Paper>
                {pageContent}
            </div>
        );
    }
}

const styles = {
    icon: {
        backgroundColor: "#4482ff",
        borderRadius: 5,
        boxShadow: "0px 2px 4px #00000080",
        margin: "0 auto",
        marginBottom: 15,
        marginTop: "5%",
        height: 120,
        width: 120,
    },
    bulb: {
        height: 65,
        display: "block",
        margin: "0 auto",
        padding: 10,
    },
    logoText: {
        textAlign: "center",
        fontSize: 28,
        color: "white",
    },
    card: {
        position: "relative",
        margin: "0 auto",
        borderRadius: 5,
        boxShadow: "0px 0px",
        border: "1px solid",
        borderColor: '#4482ff',
        width: 392,
        height: 423,
    },
    signupCard: {
        position: "relative",
        margin: "0 auto",
        borderRadius: 5,
        boxShadow: "0px 0px",
        border: "1px solid",
        borderColor: '#4482ff',
        width: 392,
        height: 523,
    },
    login: {
        margin: "0 auto",
        borderRadius: 5,
        boxShadow: "0px 0px",
        backgroundColor: "#f6f6f6",
        border: "1px solid",
        borderColor: '#4482ff',
        height: 113,
        width: 346
    },
    signup: {
        margin: "0 auto",
        borderRadius: 5,
        boxShadow: "0px 0px",
        backgroundColor: "#f6f6f6",
        border: "1px solid",
        borderColor: '#4482ff',
        height: 'auto',
        width: 346
    },
    title: {
        fontSize: 28,
        marginLeft: 8,
        marginBottom: 16,
        color: "rgba(0, 157, 60, 0.4)",
    },
    input: {
        paddingLeft: 10,
        opacity: 20,
        margin: 10,
        marginRight: 0,
        font: "arial",
        fontSize: 28,
        backgroundColor: "#f6f6f6",
        border: "0px solid",
        outline: "none",
        width: "90%",
    },
    select: {
        paddingLeft: 10,
        opacity: 20,
        margin: 10,
        marginRight: 0,
        font: "arial",
        fontSize: 28,
        backgroundColor: "#f6f6f6",
        border: "0px solid",
        outline: "none",
        width: "50%",
    },
    checkbox: {
        color: '#4482ff',
        marginRight: 0,
    },
    checkboxLabel: {
        fontSize: 16,
        color: "#9B9B9BE6",
        padding: 0,
        margin: 0,
    },
    button: {
        display: "block",
        margin: "0 auto",
        borderRadius: 5,
        backgroundColor: "#4482ff",
        color: "white",
        fontSize: 16,
        height: 48,
        width: 240
    },
    or: {
        margin: 10,
        textAlign: "center",
        color: "#9B9B9B",
        fontSize: 20,
    },
    loginError: {
        //position: "absolute",
        marginTop: 12,
        textAlign: "center",
        color: "red",
    },
    resetEmail: {
        margin: "20px auto 20px",
        borderRadius: 5,
        boxShadow: "0px 0px",
        backgroundColor: "#f6f6f6",
        border: "1px solid",
        borderColor: '#4482ff',
        height: 56,
        width: 346
    },
    resetInstruct: {
        fontSize: 16,
        color: "#9B9B9BE6",
        margin: 10,
    },
}

export default LoginPage;