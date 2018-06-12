import React, { Component } from 'react';
import logo from '../images/nav-bar-wsib-ideas.png';
import Fuse from 'fuse.js';
import PersonIcon from '@material-ui/icons/Person'
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import Menu, { MenuItem } from '@material-ui/core/Menu';
import UserProfile from '../UserProfile';
import SearchIcon from '@material-ui/icons/Search';
import NotifIcon from '@material-ui/icons/Notifications';
import CloseIcon from '@material-ui/icons/Close';
import Lightbulb from '@material-ui/icons/LightbulbOutline';
import { NotificationPanel } from './NotificationPanel';
import './NavBar.css';
import './NewIdea.css';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: [],
            searchField: '', //initialize search input to empty
            settingAnchorEl: null, 
            settingOpen: false, //this controls if the settings dropdown is displayed
            searchOn: false, //this controls if the search dropdown is displayed
        };

        this.handleCloseSearch = this.handleCloseSearch.bind(this);
    }

    async componentDidMount() { //get all posts fromt he database and place them in an array that serach can access
        try {
            let response = await fetch(UserProfile.getDatabase() + 'posts');
            let responseJson = await response.json();
            if (response.status >= 200 && response.status < 300) { //
                let array = responseJson.value;
                array = array.filter(e => e.status !== "deleted"); //filter out deleted posts
                this.setState({ search: array });
            } else {
                let error = responseJson;
                throw error;
            }
        } catch (e) {
            console.error(e);
        }
    }

    toggleSearch = () => {
        this.setState({ searchOn: !this.state.searchOn });
    }

    handleSettingClick = event => { //open settings menu
        this.setState({ settingOpen: true, settingAnchorEl: event.currentTarget });
    };
    handleClose = () => {
		this.setState({ settingOpen: false});
	};
    handleRequestClose = () => { //close settings menu
        this.setState({ settingOpen: false });
    };

    handleTabChange = (event, value) => { //change tabs from open/assigned/completed by sending the numeric value to App.js
        this.props.onTabChange(value, true);
    };

    handleSearch = (event) => {
        let value = event.target.value;
        this.setState({ searchField: value });
        if (value.substr(-1) === ' ') {
            this.createOptions();
            document.getElementById("nav-myDropdown").classList.add("show");
        } else if(value.trim() === '') {
            this.removeSearch();
        }
    };

    createOptions() {
        if (this.state.searchField !== '') {
            var myNode = document.getElementById('nav-myDropdown');
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            } // first remove all options

            var options = {
                shouldSort: true,
                tokenize: true,
                matchAllTokens: true,
                findAllMatches: true,
                threshold: 0.2,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 3,
                keys: ['title','descrip','firstName']
            };
            var fuse = new Fuse(this.state.search, options);
            var post = fuse.search(this.state.searchField);
            if(post.length < 1){
                let node = document.createElement("a");
                let textnode = document.createTextNode('0 results');
                node.appendChild(textnode);
                myNode.appendChild(node);
            }else {
                for (var i = 0; i < post.length; i++) {
                    let node = document.createElement("a");
                    let textnode = document.createTextNode(post[i].title);
                    node.onclick = this.handleDeepDive.bind(this, post[i].postID, "searchBox")
                    node.appendChild(textnode);
                    myNode.appendChild(node);
                }
            }
        } else {
            this.removeSearch();
        }
    }

    removeSearch() { //remove search dropdown from screen
        document.getElementById("nav-myDropdown").classList.remove("show");
    }

    handleDeepDive = (id, origin) => { //go into deepdive by clicking on an idea from the search dropdown
        this.props.onDeepDive(id, origin);
    }

    handleCloseSearch(e) { //close search when there's a click away from the search box
        var currentTarget = e.currentTarget;

        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                if (!document.getElementById("deepDive")) {
                    this.removeSearch();
                }
            }
        }, 0);
    }

    render() {
        let navPanel; //set what the right panel of the navbar displays when serach is on/off
        if (this.state.searchOn) { //search is on so display the search box instead of the buttons
            navPanel = (
                <div className="search-area" tabIndex="3" onBlur={this.handleCloseSearch}>
                    <input
                        id="searchBox"
                        className="search-box"
                        placeholder="Search Ideas"
                        onChange={this.handleSearch}
                        onFocus={this.handleSearch}
                    />
                    <CloseIcon style={{ marginLeft: 8, cursor: "pointer"}} onClick={this.toggleSearch}/>
                    <div id="nav-myDropdown" className="nav-dropdown-content"> </div>
                </div>
            );
        } else { //display buttons
            navPanel = (
                <div className="nav-buttons">
                    
                    {/* Notification button and all related functions */}
                    <NotificationPanel onDeepDive={this.handleDeepDive} />

                    {/* search icon */}
                    <IconButton
                    onClick={this.toggleSearch}
                    style={styles.iconButton}
                    > 
                        <SearchIcon style={styles.icon}/> 
                    </IconButton>

                    {/* setting icon */}
                    <IconButton 
                    aria-owns={this.state.settingOpen ? 'simple-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleSettingClick}
                    style={styles.iconButton}
                    > 
                        <SettingsIcon style={styles.icon}/> 
                    </IconButton>

                    {/* setting dropdown */}
                    <Menu
                    id="simple-menu"
                    anchorEl={this.state.settingAnchorEl}
                    open={this.state.settingOpen}
                    // //onRequestClose={this.handleRequestClose}
                    style={styles.dropdownMenu}
                    onClose={this.handleClose}
                    >
                        <MenuItem key="placeholder" style={{ display: "none" }} />
                        <MenuItem onClick={() => { this.props.toggleSettings(); this.handleRequestClose(); }}>Settings</MenuItem>
                        <MenuItem disabled={!(UserProfile.getView() === "lab" || UserProfile.getView() === "admin")} onClick={() => { this.props.onSwitchToAdmin(); this.handleRequestClose(); }}>Switch to Admin</MenuItem>
                        <MenuItem onClick={this.props.onLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            );
        }

        return (
            <div className="nav-bar">
                <div className="nav-bar-content">
                    <div className="nav-bar-left">
                        {/* clicking Home acts as going back to the main page with the "Open" tab selected */}
                        <p onClick={() => this.props.onTabChange(0, true)}><Lightbulb />&nbsp;&nbsp;Home</p>
                        &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                        {/* clicking on your name changes ListView to show all ideas you posted and are following, ordered by date posted */}
                        <p onClick={() => this.props.onTabChange(3, true)}><PersonIcon />&nbsp;&nbsp;{UserProfile.getName()}</p>
                    </div>
                    <div className="nav-title">
                        <img src={logo} style={{ height: 40 }} />
                    </div>
                    {navPanel}
                </div>
            </div>
        );
    }
}

export default NavBar;

const styles = {
    iconButton: {
        color: "white",
        height: 40,
        width: 40,
        margin: 11
    },
    icon: {
        width: 28,
        height: 28,
    },
    dropdownMenu: {
        top: 35,
    },
}