import React from 'react';
import './Admin.css';
import MenuItem  from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel  from '@material-ui/core/InputLabel';
import FormControl  from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import SuperSelectField from 'material-ui-superselectfield'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default class AdminFocusPopover extends React.Component {
    // same implementation as StatusUpdatePopover
    constructor(props) {
        super(props);

        this.state = {
            status: null,
            message: "",
            sendable: false,
        }

        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSendUpdate = this.handleSendUpdate.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        if (document.getElementById("admin-focus-popover")) {
            document.getElementById("admin-focus-popover").focus();
        }
    }

    handleStatusChange(e) {
        this.setState({ status: e.target.value });

        switch(e.target.value) {
            case "inReview": this.setState({ message: "This idea went under review by the Committee.", sendable: true }); break;
            case "inProgress": this.setState({ message: "The Committee approved this idea and sent it to the Lab to be implemented.", sendable: true }); break;
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

        if (e.target.value && this.state.status) {
            this.setState({ sendable: true });
        } else {
            this.setState({ sendable: false });
        }
    }

    handleSendUpdate() {
        if (this.state.sendable) {
            this.props.onSend(this.state.status, this.state.message);
        }
    }
    
    handleClose(e) {
        let currentTarget = e.currentTarget;

        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                if (!(document.getElementById("menu-status"))) this.props.onClose();
            }
        }, 0);
    }

    render() {
        return (
            
            <div id="admin-focus-popover" tabIndex="3" className="admin-focus-popover" >
                 <div className="admin-focus-popover-header">
                    <h1 className="admin-popover-title">Status Update</h1>
                    <div className="admin-popover-close" onClick={this.props.onClose}><CloseIcon style={{ height: 20 }} /></div>
                </div>
                <div className="admin-focus-popover-row"> 
                    <FormControl className="admin-popover-select">
                        <InputLabel>New Status</InputLabel>
                        <Select
                            value={this.state.status}
                            onChange={this.handleStatusChange}
                            name="status"
                            input={<Input name="status" id="status-select" className="admin-popover-select" />}
                        >
                            <MenuItem className="status-list-item" value=""><em>None</em></MenuItem>
                            <Divider />
                            <MenuItem className="status-list-item" value={"inReview"}>In Review</MenuItem>
                            <MenuItem className="status-list-item" value={"inProgress"}>In Progress</MenuItem>
                            <MenuItem className="status-list-item" value={"Completed"}>Completed</MenuItem>
                            <Divider />
                            <MenuItem className="status-list-item" value={"garaged"}>Garaged</MenuItem>
                            <MenuItem className="status-list-item" value={"notPursued"}>Not Pursued</MenuItem>
                            <MenuItem className="status-list-item" value={"duplicated"}>Duplicated</MenuItem>
                        </Select>
                       
                    </FormControl>
                     <div className={"admin-submit-update-" + this.state.sendable.toString()} onClick={this.handleSendUpdate}><SendIcon /></div>
                 </div>
                <TextField
                    id="admin-popover-input"
                    fullWidth
                    multiline
                    label="Update Message"
                    value={this.state.message}
                    onChange={this.handleMessageChange}
                />
                </div>
            
        );
    }
}
