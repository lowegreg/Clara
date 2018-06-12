import React from 'react';
import './Admin.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/LightbulbOutline';

export default class AdminFolders extends React.Component {
    constructor(props) {
        super(props);

        this.state = { // booleans for opening/closing the folder groups
            priorityOpen: true,
            liveOpen: true,
            otherOpen: false,
        };

        this.handlePriorityToggle = this.handlePriorityToggle.bind(this);
        this.handleLiveToggle = this.handleLiveToggle.bind(this);
        this.handleOtherToggle = this.handleOtherToggle.bind(this);
        this.handleFolderChange = this.handleFolderChange.bind(this);
    }

    handlePriorityToggle() {
        this.setState({ priorityOpen: !this.state.priorityOpen });
    }

    handleLiveToggle() {
        this.setState({ liveOpen: !this.state.liveOpen });
    }

    handleOtherToggle() {
        this.setState({ otherOpen: !this.state.otherOpen });
    }

    // handler for clicking on a folder
    handleFolderChange(newFolder) {
        this.props.onFolderChange(newFolder); // tell parent (AdminPage.js) about folder switch
    }

    render() {
        return (
            <div className="admin-folders">
                <div className="admin-folders-toolbar">
                    <p className="admin-toolbar-caption" onClick={this.props.onExitAdmin}><HomeIcon />&nbsp;Ideas</p>
                </div>
                <List>
                    <ListItem button onClick={this.handlePriorityToggle}>
                        <ListItemText primary="Priority" />
                        {this.state.priorityOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.priorityOpen} timeout="auto" unmountOnExit>
                        <ListItem selected button onClick={() => this.handleFolderChange(0)}>
                            <ListItemText primary="Hot" className="nested" />
                        </ListItem>
                        <ListItem button onClick={() => this.handleFolderChange(1)} divider>
                            <ListItemText primary="Cold" className="nested" />
                        </ListItem>
                    </Collapse>
                    <ListItem button onClick={this.handleLiveToggle}>
                        <ListItemText primary="Open" />
                        {this.state.liveOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.liveOpen} timeout="auto" unmountOnExit>
                        <ListItem button onClick={() => this.handleFolderChange(2)}>
                            <ListItemText primary="Live" className="nested" />
                        </ListItem>
                        <ListItem button onClick={() => this.handleFolderChange(3)}>
                            <ListItemText primary="In Review" className="nested" />
                        </ListItem>
                        <ListItem button onClick={() => this.handleFolderChange(4)}>
                            <ListItemText primary="In Progress" className="nested" />
                        </ListItem>
                        <ListItem button onClick={() => this.handleFolderChange(5)} divider>
                            <ListItemText primary="Completed" className="nested" />
                        </ListItem>
                    </Collapse>
                    <ListItem button onClick={this.handleOtherToggle}>
                        <ListItemText primary="Other" />
                        {this.state.otherOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.otherOpen} timeout="auto" unmountOnExit>
                        <ListItem button onClick={() => this.handleFolderChange(6)}>
                            <ListItemText primary="Pending Deletion" className="nested" />
                        </ListItem>
                        <ListItem button onClick={() => this.handleFolderChange(7)}>
                            <ListItemText primary="Garaged" className="nested" />
                        </ListItem>
                        <ListItem button onClick={() => this.handleFolderChange(8)}>
                            <ListItemText primary="Not Pursued" className="nested" />
                        </ListItem>
                        <ListItem button onClick={() => this.handleFolderChange(7)} divider>
                            <ListItemText primary="Duplicated" className="nested" />
                        </ListItem>
                    </Collapse>
                </List> 
            </div>
        );
    }
}