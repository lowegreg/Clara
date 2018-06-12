import React, { Component } from 'react';
// import NavBar from './Components/NavBar';
import NewIdea from './Components/NewIdea';
import SidebarLeft from './Components/SidebarLeft';
import SidebarRight from './Components/SidebarRight';
import { ListView } from './Components/ListView';
import { FocusView } from './Components/FocusView';
import { AdminPage } from './Components/Admin/AdminPage';
import './App.css';
import './Components/IdeaCard.css';
import bkg from './bkg2.png';
import SettingsPage from './Components/SettingsPage';
import UserProfile from './UserProfile';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeTab: 0, //initialize to open tab
			explicitRefresh: false,
			loggedIn: false,
			departments: true,
			activeFilters: ['Innovation', UserProfile.getDep()],
			deepDive: false,
			deepDiveID: 0,
			deepDiveOrigin: "",
			settingsOn: false, //set settings view to inactive
			adminView: false,
		};

		this.handleTabChange = this.handleTabChange.bind(this);
		this.handleDeepDive = this.handleDeepDive.bind(this);
		this.handleResurface = this.handleResurface.bind(this);
		this.handleSwitchToAdmin = this.handleSwitchToAdmin.bind(this);
		this.handleExitAdmin = this.handleExitAdmin.bind(this);
	}

	toggleSettings = () => { //pass to child components to turn settings on/off
		this.setState({ settingsOn: !this.state.settingsOn, adminView: false });
	}

	handleLogin = (login) => {
		if (login) {
			this.setState({ loggedIn: true, activeFilters: ['Innovation', UserProfile.getDep()] });
		}
	}

	handleLogout = () => {
		localStorage.clear();
		this.setState({ loggedIn: false, settingsOn: false });
	}

	handleTabChange(newTab, explicitRefresh = false) {
		if (explicitRefresh) { // scroll back to top when refreshing page explicitly
			window.scrollTo(0, 0);
		}
		this.setState({
			activeTab: newTab,
			explicitRefresh: explicitRefresh,
			deepDive: false,
			settingsOn: false,
			adminView: false,
		});
	}

	handleFilters(array) {
		this.setState({ activeFilters: array });
	}

	// deep dive into an idea (i.e. FocusView)
	// optional origin parameter to return focus to text box if necessary
	//     e.g. title input or search bar
	handleDeepDive(id, origin) {
		document.body.style.overflow = "hidden"; // disable scrolling in background
		this.setState({ deepDive: true, deepDiveID: id, deepDiveOrigin: origin || "", explicitRefresh: false });
	}

	// exit deep dive
	handleResurface() {
		document.body.style.overflow = "auto"; // restore scrolling
		if (this.state.deepDiveOrigin !== "") document.getElementById(this.state.deepDiveOrigin).focus(); // return focus to text box if necessary
		this.setState({ deepDive: false, deepDiveID: 0, deepDiveOrigin: "", explicitRefresh: false });
	}

	handleSwitchToAdmin() {
		this.setState({ adminView: true, settingsOn: false });
	}

	handleExitAdmin() {
		this.setState({ adminView: false });
	}

	render() {
		
			let mainContent; // conditional rendering of main content based on current view
			if (this.state.adminView) {
				mainContent = <AdminPage onExitAdmin={this.handleExitAdmin} />;
			} else if (this.state.settingsOn) {
				mainContent = <SettingsPage toggleSettings={this.toggleSettings.bind(this)} />
			} else { 
				// home page
				let filters;
				if (this.state.departments) { // this is always true unless we manually disable departments
					filters = this.state.activeFilters;
				}

				let deepDive;
				if (this.state.deepDive) {
					deepDive = <FocusView id={this.state.deepDiveID} closeDeepDive={this.handleResurface} />
				}

				mainContent =
					<div className="main-page">
						{deepDive}
						<div className="main-sidebar-left">
							<SidebarLeft onDeepDive={this.handleDeepDive} handleFilters={this.handleFilters.bind(this)} departments={this.state.departments} filters={filters} />
							<SidebarRight onDeepDive={this.handleDeepDive} />
						</div>
						<div className="main-content">
							<NewIdea tabChange={this.handleTabChange} onDeepDive={this.handleDeepDive} />
							<ListView tab={this.state.activeTab} filters={filters} onDeepDive={this.handleDeepDive} explicitRefresh={this.state.explicitRefresh} />
						</div>
						
					</div>;
			}
			return (
				<div className="App">
					<div style={styles.background} />
					{/* <NavBar	// same nav bar for home, admin, and settings pages
						onTabChange={this.handleTabChange}
						onDeepDive={this.handleDeepDive}
						onLogout={this.handleLogout.bind(this)}
						onSwitchToAdmin={this.handleSwitchToAdmin}
						toggleSettings={this.toggleSettings.bind(this)}
						settingsMode={this.state.settingsOn}
					/> */}
					{mainContent}
				</div>
			);
		
	}
}

const styles = {
	background: {
		backgroundImage: "url(" + bkg + ")",
		position: "fixed",
		padding: 0,
		margin: 0,
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		zIndex: -99
	},
}

export default App;