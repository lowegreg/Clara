import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import UserProfile from '../../UserProfile';
import './ChangePassword.css';
import  CircularProgress  from '@material-ui/core/CircularProgress';
import Success from "./settingSuccess.png";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: UserProfile.getEmail(),
            password: '',
            newPassword: '',
            confirmPassword: '',
            error: '', //use to dynamically change the error message on this page, start as empty/no error
            changeSuccess: false,
            loading: true, //show initial loading wheel
        };

        this.submitChange = this.submitChange.bind(this);

        this.load(); //remove initial loading wheel
    }

    load = () => { //remove loading wheel after a minimum amount of time
        setTimeout(() => this.setState({ loading: false }), 300);
    }

    handleInputChange = (event) => { //change text field values
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleKeyPress = (event) => { //if user hits Enter key then act as if the "Save Changes" button was pressed
        if (event.key === 'Enter') {
            this.submitChange();
        }
    }

    async submitChange () { //Verify that all the input is valid then save new password to the backend
        const { email, password } = this.state;

        //Perform all necessary checks on the input
        if ((password === '') || (this.state.newPassword === '') || (this.state.confirmPassword === '')) {
            this.setState({ error: 'All fields must be filled to change password.' });
        } else if ((this.state.newPassword.length < 6) || (this.state.newPassword.length > 128)) {
            this.setState({ error: 'New password must be 6 to 128 characters long.' });            
        } else if ((this.state.newPassword.match(/\d+/g) == null)/*doesn't have number*/|| (this.state.newPassword.match(/[a-z]/) == null)/*doesn't have lowercase*/ || (this.state.newPassword.match(/[A-Z]/) == null))/*doesn't have uppercase*/ {
            this.setState({ error: 'New password must contain at least one of each: lowercase letter, uppercase letter and number.' });            
        } else if (this.state.newPassword !== this.state.confirmPassword) {
            this.setState({ error: 'New passwords do not match.' });
        } else {
            var url = UserProfile.getDatabase() + 'auth/' + email;
            try {
                let response = await fetch(url);
                let responseJson = await response.json();
                if (response.status >= 200 && response.status < 300) { //check password enter against password on server
                    if (responseJson.length < 1) {
                        this.setState({ error: "Incorrect current password." });
                    } else {
                        this.setState({ loading: true }); //start loading wheel
                        let salt;
                        try {
                            let response3 = await fetch(UserProfile.getDatabase()+'auth/GetSalt', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    email: email,
                                })
                            })
                            let responseJson3 = await response3.json();
                            salt = responseJson3[0].salt;
                        }catch(err) {
                            console.log(err);
                        }
                        try { //check if new password is same as old
                            let response2 = await fetch(UserProfile.getDatabase()+'auth/CheckPassword', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    email: email,
                                    password: this.state.newPassword,
                                    salt: salt
                                })
                            });
                            let responseJson2 = await response2.json();
                            if(!!+responseJson2[0].boolean){
                                this.setState({ error: "New password can't be the same as old password." });
                            }else {
                                try { //change password on database
                                    fetch(UserProfile.getDatabase() + 'auth/ChangePassword', {
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            password: this.state.newPassword,
                                            email: this.state.email
                                        })
                                    }).then(() => { //stop loading and set state to display success message
                                        this.setState({changeSuccess: true});
                                        setTimeout(() => this.setState({ loading: false }), 400);
                                        localStorage.setItem('Password', this.state.newPassword);
                                    });
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }catch(err) {
                            console.log(err);
                        }
                    }
                } else {
                    localStorage.clear();
                    alert("error");
                    let error = responseJson;
                    throw error;
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    render () {
        let pageContent; //determine what is displayed in the password component
        if (!this.state.changeSuccess && !this.state.loading) { //display the inital password change ui 
            pageContent = (
                <div className='password-component'>
                    <div className='change-password-form'>
                        <input className='login-text' type="password" name="password" placeholder="Current password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleKeyPress}
                        />
                        <Divider />
                        <input className='login-text' type="password" name="newPassword" placeholder="New password"
                            value={this.state.newPassword}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleKeyPress}
                        />
                        <Divider />
                        <input className='login-text' type="password" name="confirmPassword" placeholder="Confirm password"
                            value={this.state.confirmPassword}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleKeyPress}
                        />
                    </div>

                    <p className="login-error"> {this.state.error} </p>

                    <Button style={styles.button} onClick={this.submitChange}>
                        Save changes
                    </Button>
                </div>
            );
        } else if (this.state.loading) { //display loading wheel
            pageContent = (
                <div className='password-component'>
                    <CircularProgress
                    className='settings-spinner'/>
                </div>
            );
        } else {
            pageContent = (
                <div className='password-component'>
                    <p className='password-success'> 
                        <img src={Success} alt="success" className="setting-success-icon"/>
                        Your password was successfully changed!
                    </p>
                </div>
            );
        }
        return (
            <div className='settings-component'>
                <p className="setting-title"> Password </p>
                {pageContent}
            </div>
        );
    }
}
export default ChangePassword;

const styles = {
    button: {
        display: "block",
        margin: "10px auto",
        borderRadius: 5,
        backgroundColor: "#4482ff",
        color: "white",
        height: 30,
        width: 150
    },
}