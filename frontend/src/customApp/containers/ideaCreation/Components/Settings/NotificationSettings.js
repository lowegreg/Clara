import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import UserProfile from '../../UserProfile';
import './NotificationSettings.css';
import  CircularProgress  from '@material-ui/core/CircularProgress';
import Success from "./settingSuccess.png";
import Checkbox from '@material-ui/core/Checkbox';

class NotificationSettings extends Component {
    constructor(props) {
        super(props);
        this.state = { //set all notification settings off before loading users settings from database
            myLike: false,
            myComment: false,
            myEdit: false,
            myStage: false,
            followLike: false,
            followComment: false,
            followEdit: false,
            followStage: false,
            changeSuccess: false,
            loading: true, //set initial load
        };

        this.submitChange = this.submitChange.bind(this);

        this.getSettings(); //get user's settings from database
    }

    handleChange = name => (event, checked) => {
        this.setState({ [name]: checked });
    };

    async getSettings () {
        try { //get notification settings from database
            let response = await fetch(UserProfile.getDatabase() + 'auth/GetEmailSettings', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    empID: UserProfile.getID()
                })
            });
            let responseJson = await response.json();
            if(responseJson.length > 0) {
                if (response.status >= 200 && response.status < 300) {
                    setTimeout(() => this.setState({ //set frontend variables to user's settings
                        myLike: responseJson[0].myLike, 
                        myComment: responseJson[0].myComment, 
                        myEdit: responseJson[0].myAdminEdit,
                        myStage: responseJson[0].myAdminStatus, 
                        followLike: responseJson[0].followLike, 
                        followComment: responseJson[0].followComment, 
                        followEdit: responseJson[0].followAdminEdit,
                        followStage: responseJson[0].followAdminStatus,
                        loading: false, //stop loading
                    }), 300);
                } else {
                    let error = responseJson;
                    throw error;
                }
            }else { //if no settings found then just keep all as false and stop loading
                setTimeout(() => this.setState({ 
                    loading: false, 
                }), 300);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async submitChange () { //save user's changes to the database
        this.setState({loading: true}); //start loading
        try {
            fetch(UserProfile.getDatabase() + 'auth/UpdateEmailSettings', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify ({
                    empID: UserProfile.getID(),
                    email: UserProfile.getEmail(),
                    myLike: this.state.myLike,
                    myComment: this.state.myComment,
                    myAdminEdit: this.state.myEdit,
                    myAdminStatus: this.state.myStage,
                    followLike: this.state.followLike,
                    followComment: this.state.followComment,
                    followAdminEdit: this.state.followEdit,
                    followAdminStatus: this.state.followStage,
                })
            }).then(() => { //stop loading and display success
                setTimeout(() => this.setState({ changeSuccess: true, loading: false }), 300);
            });
        } catch (err) {
            console.log(err);
        }
    }

    render () {
        let pageContent; //determine what is displayed in the notification settings component
        if (!this.state.changeSuccess && !this.state.loading) { //load initial notificaton settings screen 
            pageContent = (
                <div className='notification-settings'>
                    <p className='setting-subheading'> My Ideas: </p>

                    <div className='checkbox-group'>
                        <p> Get email notifications when: </p>

                        <div> 
                            <Checkbox
                            checked={!!+this.state.myLike}
                            onChange={this.handleChange('myLike')}
                            style={styles.checkbox}
                            value="myLike"
                            /> 
                            Someone likes my idea 
                        </div>

                        <div> 
                            <Checkbox
                                checked={!!+this.state.myComment}
                                onChange={this.handleChange('myComment')}
                                style={styles.checkbox}
                                value="myComment"
                            /> 
                            Someone comments on my idea 
                        </div>

                        <div> 
                            <Checkbox
                                checked={!!+this.state.myEdit}
                                onChange={this.handleChange('myEdit')}
                                style={styles.checkbox}
                                value="myEdit"
                            /> 
                            An admin edits my idea 
                        </div>

                        <div> 
                            <Checkbox
                                checked={!!+this.state.myStage}
                                onChange={this.handleChange('myStage')}
                                style={styles.checkbox}
                                value="myStage"
                            /> 
                            My ideas moves to a new stage 
                        </div>
                    </div>

                    <Divider/>

                    <p className='setting-subheading'> Ideas I follow: </p>
                    <div className='checkbox-group'>
                        <p> Get email notifications when: </p>

                        <div> 
                            <Checkbox
                            checked={!!+this.state.followLike}
                            onChange={this.handleChange('followLike')}
                            style={styles.checkbox}
                            value="followLike"
                            /> 
                            Someone likes an idea I follow 
                        </div>

                        <div> 
                            <Checkbox
                                checked={!!+this.state.followComment}
                                onChange={this.handleChange('followComment')}
                                style={styles.checkbox}
                                value="followComment"
                            /> 
                            Someone comments on an idea I follow 
                        </div>

                        <div> 
                            <Checkbox
                                checked={!!+this.state.followEdit}
                                onChange={this.handleChange('followEdit')}
                                style={styles.checkbox}
                                value="followEdit"
                            /> 
                            Someone edits an idea I follow 
                        </div>

                        <div> 
                            <Checkbox
                                checked={!!+this.state.followStage}
                                onChange={this.handleChange('followStage')}
                                style={styles.checkbox}
                                value="followStage"
                            /> 
                            An idea I follow moves to a new stage 
                        </div>
                    </div>

                    <Button style={styles.button} onClick={this.submitChange}>
                        Save changes
                    </Button>
                </div>
            );
        } else if (this.state.loading) { //show loading wheel
            pageContent = (
                <div className='notifications-component'>
                    <CircularProgress
                    className='settings-spinner'/>
                </div>
            );
        } else { //show success message
            pageContent = (
                <div className='notifications-component'>
                    <p className='notifications-success'> 
                        <img src={Success} alt="success" className="setting-success-icon"/>
                        Your settings were successfully changed!
                    </p>
                </div>
            );
        }
        
        return (
            <div className='settings-component'>
                <p className="setting-title"> Email Notifications </p>
                {pageContent}
            </div>
        );
    }
}
export default NotificationSettings;

const styles = {
    button: {
        display: "block",
        margin: "10px auto",
        borderRadius: 5,
        backgroundColor: "#009d3c",
        color: "white",
        height: 30,
        width: 150
    },
    checkbox: {
        color: '#009d3c',
        height: 35,
    },
}