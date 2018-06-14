import React from 'react';
import './Admin.css';
import AdminFolders from './AdminFolders';
import AdminList from './AdminList';
import AdminFocus from './AdminFocus';

export class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeFolder: 0,
            focusID: -1,
            focusFlagToggle: false,
            listFlagToggle: false,
            filtersToggle: true,
        };

        this.handleFolderChange = this.handleFolderChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleListFlag = this.handleListFlag.bind(this);
        this.handleFocusFlag = this.handleFocusFlag.bind(this);
        this.showFilters = this.showFilters.bind(this)
    }

    handleFolderChange(newFolder) {
        this.setState({ activeFolder: newFolder, focusFlagToggle: false });
    }

    handleFocus(id) {
        this.setState({ focusID: id, focusFlagToggle: false });
    }

    handleListFlag(id) {
        if (id === this.state.focusID) {
            this.setState({ focusFlagToggle: true });
        } else {
            this.setState({ focusFlagToggle: false });
        }
    }

    // basically just refreshes the admin page so all children components get updated
    // this.state.listFlagToggle isn't used anywhere else, the value is irrelevant
    handleFocusFlag() {
        this.setState({ listFlagToggle: !this.state.listFlagToggle });
    }
    showFilters() {
        this.setState({
            filtersToggle: !this.state.filtersToggle
        })
    }

    render() {
        return (
            <div >
                <h1 style={{ margin: '16px', textAlign: 'left' }}>Ideas Admin</h1>
                <div className="admin-container">
                    {this.state.filtersToggle === true &&
                        <AdminFolders onFolderChange={this.handleFolderChange} onExitAdmin={this.showFilters} />
                    }
                    <AdminList activeFolder={this.state.activeFolder} focusID={this.state.focusID} onFocus={this.handleFocus} onFlag={this.handleListFlag} showFilters={this.showFilters} />
                    <AdminFocus postID={this.state.focusID} flagToggle={this.state.focusFlagToggle} refresh={this.handleFocusFlag} />
                </div>

            </div>
        );
    }
}