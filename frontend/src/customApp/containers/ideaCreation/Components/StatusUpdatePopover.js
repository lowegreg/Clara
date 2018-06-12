import React from 'react';
import './IdeaCard.css';

import MenuItem  from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import  InputLabel from '@material-ui/core/InputLabel';
import  FormControl  from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import UserProfile from '../UserProfile';


export default class StatusUpdatePopover extends React.Component {
    constructor(props) {
        super(props);

        let message = "";
        switch (this.props.nextStatus) {
            case "inReview": message = "This idea went under review by the Committee."; break;
            case "internal": message = "The Committee approved this idea and sent it to internal to be implemented."; break;
            case "lab": message = "The Committee approved this idea and sent it to the Lab to be implemented."; break;
            case "Completed": message = "Implementation of this idea is complete."; break;
            case "garaged": message = "This idea has been garaged to be completed at a later date."; break;
            case "notPursued": message = "The Committee has decided not to pursue this idea."; break;
            case "duplicated": message = "This idea was a duplicate."; break;
            default: break;
        }

        this.state = {
            status: this.props.nextStatus,
            message: message,
            sendable: Boolean(this.props.nextStatus),
        }

        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSendUpdate = this.handleSendUpdate.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    // submit status update to database
    async updateStatus(status, message) {
        let date = new Date();
        date.setSeconds(date.getSeconds() - 1);
        try {
            fetch(UserProfile.getDatabase() + "admin/ChangeStatus", { // change idea status
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: status,
                    postID: this.props.postID,
                })
            }).then(() => {
                try {

                    fetch(UserProfile.getDatabase() + "posts/UpdatePostHistory", { // add update to post history
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            postID: this.props.postID,
                            empID: UserProfile.getID(),
                            previous: this.props.prevStatus,
                            type: 'Status',
                            new: this.state.status,
                            date: date,
                            message: message,
                        })
                    })
                } catch (e) {
                    console.log(e);
                }
                // try {
                //     fetch(UserProfile.getDatabase() + "subscriptions/" + this.props.postID).then((response) => { // fetch subscription list
                //         return response.json();
                //     }).then((parsedData) => {
                //         for (let i in parsedData) { // for each follower
                //             try {
                //                 fetch(UserProfile.getDatabase() + "admin/ChangeStatusNotif", { // send notif
                //                     method: 'POST',
                //                     headers: {
                //                         'Accept': 'application/json',
                //                         'Content-Type': 'application/json',
                //                     },
                //                     body: JSON.stringify({
                //                         noteEvent: 'Follow',
                //                         firstName: '',
                //                         noteDetails: message,
                //                         noteDate: date,
                //                         empID: parsedData[i].empID,
                //                         postID: this.props.postID,
                //                     })
                //                 })
                //             } catch (e) {
                //                 console.log(e);
                //             }
                //             try {
                //                 fetch(UserProfile.getDatabase() + "notify/addFollowNotify", { // increment unopened notif count
                //                     method: 'POST',
                //                     headers: {
                //                         'Accept': 'application/json',
                //                         'Content-Type': 'application/json',
                //                     },
                //                     body: JSON.stringify({
                //                         empID: parsedData[i].empID,
                //                     })
                //                 });
                //             } catch (e) {
                //                 console.log(e);
                //             }
                //         }
                //     })
                // } catch (e) {
                //     console.log(e);
                // }
            }).then(() => {
                this.props.onClose(true); // close StatusUpdatePopover when finished submitting
            })
        } catch (e) {
            console.log(e);
        }
    }

    // handler for selecting a status
    handleStatusChange(e) {
        this.setState({ status: e.target.value });

        switch (e.target.value) { // pre-populate message box with some default text
            case "inReview": this.setState({ message: "This idea went under review by the Committee.", sendable: true }); break;
            case "internal": this.setState({ message: "The Committee approved this idea and sent it to internal  to be implemented.", sendable: true }); break;
            case "lab": this.setState({ message: "The Committee approved this idea and sent it to the Lab to be implemented.", sendable: true }); break;
            case "Completed": this.setState({ message: "Implementation of this idea is complete.", sendable: true }); break;
            case "deleted": this.setState({ message: "", sendable: false }); break;
            case "garaged": this.setState({ message: "This idea has been garaged to be completed at a later date.", sendable: true }); break;
            case "notPursued": this.setState({ message: "The Committee has decided not to pursue this idea.", sendable: true }); break;
            case "duplicated": this.setState({ message: "This idea was a duplicate.", sendable: true }); break;
            case "": this.setState({ sendable: false }); break;
            default: break;
        }
    }

    handleMessageChange(e) { 
        this.setState({ message: e.target.value })

        // only valid for submission if status and message are both not empty
        if (e.target.value && this.state.status) {
            this.setState({ sendable: true });
        } else {
            this.setState({ sendable: false });
        }
    }

    // pretty redundant middle function tbh
    handleSendUpdate() {
        if (this.state.sendable) {
            this.updateStatus(this.state.status, this.state.message);
        }
    }

    // handler for closing popover
    handleClose(e) {
        let currentTarget = e.currentTarget;

        // close popover if one of the following applies:
        //     user clicks out of it
        //     user clicks on the x
        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement) && document.activeElement !== document.getElementById("menu-button") && document.activeElement !== document.getElementById("disposition-button")) {
                if (!(document.getElementById("menu-status"))) this.props.onClose();
            }
        }, 0);
    }

    render() {
        return (
            <div className="update-popover-background" onClick={this.handleClose}>
                <div id="status-update-popover" className="status-update-popover" onClick={(e) => e.stopPropagation()}>
                    <div className="status-update-popover-header">
                        <h1 className="update-popover-title">Status Update</h1>
                        <div className="update-popover-close" onClick={this.props.onClose}><CloseIcon style={{ height: 20 }} /></div>
                    </div>
                    <p className="update-popover-idea-title">{this.props.title}</p>
                    <div className="status-update-popover-row">
                        <FormControl className="update-popover-select">
                            <InputLabel>New Status</InputLabel>
                            <Select
                                value={this.state.status}
                                onChange={this.handleStatusChange}
                                name="status"
                                input={<Input name="status" id="status-select" className="update-popover-select" />}
                            >
                                <MenuItem className="status-list-item" value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem className="status-list-item" value={"inReview"} disabled={this.props.prevStatus !== "live"} divider>In Review</MenuItem>
                                <MenuItem className="status-list-item" value={"internal"} disabled={this.props.prevStatus !== "inReview"}>internal</MenuItem>
                                <MenuItem className="status-list-item" value={"lab"} disabled={this.props.prevStatus !== "inReview"}>Innovation Lab</MenuItem>
                                <MenuItem className="status-list-item" value={"garaged"} disabled={this.props.prevStatus !== "inReview"}>Garaged</MenuItem>
                                <MenuItem className="status-list-item" value={"notPursued"} disabled={this.props.prevStatus !== "inReview"} divider>Not Pursued</MenuItem>
                                <MenuItem className="status-list-item" value={"Completed"} disabled={this.props.prevStatus !== "inProgress" && this.props.prevStatus !== "internalInternal" && this.props.prevStatus !== "lab"} divider>Completed</MenuItem>
                                <MenuItem className="status-list-item" value={"duplicated"}>Duplicated</MenuItem>
                            </Select>


                            
                        </FormControl>
                        <div className={"submit-update-" + this.state.sendable.toString()} onClick={this.handleSendUpdate}><SendIcon /></div>
                    </div>
                    <TextField
                        id="update-popover-input"
                        fullWidth
                        multiline
                        label="Update Message"
                        value={this.state.message}
                        onChange={this.handleMessageChange}
                    />
                </div>
            </div>
        );
    }
}
