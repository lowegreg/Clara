import React from 'react';
import './Comment.css';
import UserProfile from '../UserProfile';
import MenuButtonIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';

class CommentCard extends React.Component {
	constructor(props) {
		super(props);

		const dateString = this.getTimeElapsed(this.props.date);

		this.state = {
			desc: this.props.desc,
			date: dateString,
			author: this.props.author,
			menuAnchorEl: null,
			menuOpen: false,
			view: true
		}

		this.handleDelete = this.handleDelete.bind(this);
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

	handleDelete() {
		try {
			fetch(UserProfile.getDatabase() + 'subtractComments', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					postID: this.props.postID,
				})
			});
			fetch(UserProfile.getDatabase() + 'deleteComment', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					postID: this.props.postID,
					commentID: this.props.id,
				})
			}).then(() => {
				if (this.props.admin) {
					this.props.getComments(this.props.id);
					this.setState({ view: false, menuOpen: false })
				} else {
					this.props.getComments(true);
				}

			});

		} catch (err) {
			alert(err);
		}
	}

	render() {
		let color;
		if (this.props.profile.employeeId === this.props.empID) {
			color = "rgb(0, 0, 216)";
		}

		let menuButton;
		let button = (
			<div>
				<IconButton
					aria-owns={this.state.menuOpen ? 'user-card-menu' : null}
					aria-haspopup="true"
					onClick={this.handleMenuClick}
					style={{ height: 16, width: 16, color: 'grey', margin: "0px", padding: "0px" }}
				>
					<MenuButtonIcon style={{ height: 16, width: 16, color: 'grey' }} />
				</IconButton>

				<Menu
					id="user-card-menu"
					anchorEl={this.state.menuAnchorEl}
					open={this.state.menuOpen}
					//onRequestClose={this.handleRequestClose}
					onClose={this.handleRequestClose}
					style={{ marginTop: 35, marginLeft: -25, padding: '0px' }}
				>

					<MenuItem style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6 }} onClick={this.handleDelete}>Delete</MenuItem>
				</Menu>
			</div>
		);
		// delete menu only available if one of these apply:
		//     user made the comment and the idea's status is live or inReview
		//     user is admin or lab
		if (this.props.live) {
			if (this.props.profile.employeeId === this.props.empID || UserProfile.getView() === 'admin' || UserProfile.getView() === 'lab') {
				menuButton = button;
			}
		} else if (UserProfile.getView() === 'admin' || UserProfile.getView() === 'lab') {
			menuButton = button;
		}
		return (
			<div>
				{this.state.view === true &&
					<div className={"comment-card" + (this.props.parent ? this.props.parent : "")}>

						<div className="deep-dive-row">
							<p className="comment-author" style={{ color: color }}>{this.state.author}</p>
							<p className="comment-timestamp">{this.state.date}</p>
						</div>
						<div className="comment-body-row">
							<p className="comment-text" style={{ textAlign: 'left' }} >{this.state.desc}</p>
							{menuButton}
						</div>

					</div>
				}
			</div>
		);
	}
}

export default connect(state => ({
	profile: state.Auth.get('profile'),
}))(CommentCard);