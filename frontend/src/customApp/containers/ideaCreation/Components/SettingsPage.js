import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import './SettingsPage.css';
// import ChangePassword from './Settings/ChangePassword'
// import NotificationSettings from './Settings/NotificationSettings'

class SettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSetting: "0", //select the first setting in the menu by default
        };
    }

    handleMenu = (event) => { //set currentSetting to the id of the menu option that was just clicked
        if (this.state.currentSetting !== event.target.id) {
            this.setState({ currentSetting: event.target.id });
        }
    }

    render() {
        let setting; //change the setting component rendered when currentSetting changes
        // switch (this.state.currentSetting) {
        //     case "0":
        //         // setting = (<ChangePassword/>);
        //         break;
        //     case "1":
        //         setting = (<NotificationSettings/>);
        //         break;
        //     default:
        //         // setting = (<ChangePassword/>);
        // }

        return (
            <div className='settings-page'>
                <div className='settings-menu'>
                    <p className="setting-menu-title"> Settings </p>

                    <Divider />
                    <div className={"settings-menu-option" + (this.state.currentSetting === "0" ? " selected-setting" : "")}
                        id="0" onClick={this.handleMenu}>
                        Security & Privacy
                    </div>
                    <Divider />
                    <div className={"settings-menu-option" + (this.state.currentSetting === "1" ? " selected-setting" : "")}
                        id="1" onClick={this.handleMenu}>
                        Notifications
                    </div>
                    <Divider />
                    {/* Use template below to create new menu options */}
                    {/* <div className={"settings-menu-option" + (this.state.currentSetting === "n"? " selected-setting": "")}
                    id="n" onClick={this.handleMenu}>
                        Option n
                    </div>
                    <Divider/> */}
                </div>
                {setting}
            </div>
        );
    }
}

export default SettingsPage;