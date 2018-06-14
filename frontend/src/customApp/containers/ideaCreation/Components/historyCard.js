import React from 'react';
import './Comment.css';
import './Admin/Admin.css'
import MenuButtonIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';

class HistoryCard extends React.Component {
	constructor(props) {
		super(props);
		const dateString = this.getTimeElapsed(this.props.date);
		this.state = {
			message: this.props.message,
			date: dateString,
			previous: this.props.previous,
			new: this.props.new,
			menuAnchorEl: null,
			menuOpen: false,
		}
	}

	getTimeElapsed(date) {
		const postDate = new Date(date);
		const now = new Date();
		const timeElapsed = Math.abs(now.getTime() - postDate.getTime());
		let elapsed = timeElapsed / 1000;
		if (elapsed / 60 >= 1) {
			elapsed /= 60;
			if (elapsed / 60 >= 1) {
				elapsed /= 60;
				if (elapsed / 24 >= 1) {
					elapsed /= 24;
					if (elapsed / 7 >= 1) {
						elapsed /= 7;
						return Math.floor(elapsed) + "w";
					} else {
						return Math.floor(elapsed) + "d";
					}
				} else {
					return Math.floor(elapsed) + "h";
				}
			} else {
				return Math.floor(elapsed) + "m";
			}
		} else {
			return Math.floor(elapsed) + "s";
		}
	}

	// menu with option to delete comment
	handleMenuClick = event => {
		this.setState({ menuOpen: true, menuAnchorEl: event.currentTarget });
	};

	handleRequestClose = () => {
		this.setState({ menuOpen: false });
	};

	render() {
		let color;
		if (this.props.profile.employeeId === this.props.empID) {
			color = "rgb(0, 0, 216)";
		}
		return (
			<div className={"comment-card" + (this.props.parent ? this.props.parent : "")}>
				<div className="deep-dive-row">
					{/* <p className="comment-author" style={{ color: color }}>{this.state.previous}</p> */}
					<Row>
						<Col xs={3}> <p className={"admin-status-" + this.state.previous}>{this.state.previous}</p></Col>
						<Col xs={1}><p className="comment-author" style={{ color: 'grey' }} > to </p></Col>
						<Col xs={3}><p className={"admin-status-" + this.state.new} style={{ color: color, textAlign: 'left' }}>{this.state.new}</p></Col>
						<Col xs={4}><p className="comment-timestamp" style={{ textAlign: 'right' }}>{this.state.date}</p></Col>
					</Row>
					{/* <p className="comment-author" style={{ color: color }}>{this.state.previous}</p><p>to</p><p>{this.state.new}</p> */}

				</div>
				<div className="comment-body-row">
					<p className="comment-text" style={{ textAlign: 'left' }} >{this.state.message}</p>
				</div>
			</div>
		);
	}
}

export default connect(state => ({
	profile: state.Auth.get('profile'),
}))(HistoryCard);