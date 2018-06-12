import React, { Component } from 'react';
import { AdminPage } from './Components/Admin/AdminPage';
import './App.css';
import './Components/IdeaCard.css';
import bkg from './bkg2.png';



class AdminSetup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loggedIn: false,
			adminView: false,
		};
		this.handleExitAdmin = this.handleExitAdmin.bind(this);
	}

	handleExitAdmin() {
		this.setState({ adminView: false });
	}
	render() {

		let mainContent; // conditional rendering of main content based on current view
		mainContent = <AdminPage onExitAdmin={this.handleExitAdmin} />;
		return (
			<div className="App">
				<div style={styles.background} />
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

export default AdminSetup;