import React from 'react';
import CommentList from './CommentList.js'
import LikeIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/ChatBubble';
import NotifIcon from '@material-ui/icons/Notifications';
import NotifIcOn from '@material-ui/icons/NotificationsActive';
import ArrowDropLeft from '@material-ui/icons/KeyboardArrowLeft';
import FlagIcon from '@material-ui/icons/Flag';
import Lightbulb from '@material-ui/icons/LightbulbOutline';
import './IdeaCard.css';
import './FocusView.css';
import UserProfile from '../UserProfile';
import "typeface-roboto";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import MenuButtonIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';

class IdeaCard extends React.Component {
	constructor(props) {
		super(props);
		const dateString = this.getTimeElapsed(this.props.date)
		let ellipses = "";
		let cardType = "";
		if (this.props.desc.length > 300) {
			ellipses = "...";
			cardType = "-expandable";
		}

		let likeColor = "rgb(153, 153, 153)";
		let like = false;
		if (this.props.like) {
			likeColor = "#4482ff";
			like = true;
		}

		let followColor = "rgb(153, 153, 153)";
		let follow = false;
		if (this.props.follow) {
			followColor = "#4482ff";
			follow = true;
		}

		this.state = {
			date: dateString,
			liked: like,
			rating: this.props.rating,
			numComments: this.props.numComments,
			likeColor: likeColor,
			desc: this.props.desc.substring(0, 300) + ellipses,
			cardType: cardType,
			descExpanded: false,
			commentsExpanded: false,
			followed: follow,
			followColor: followColor,
			successOpen: false,
			successPosition: {
				vertical: 'top',
				horizontal: 'center'
			},
			menuAnchorEl: null,
			menuOpen: false,
			adminMenuAnchorEl: null,
			adminMenuOpen: false,
			statusChange: '',
			flagged: Boolean(this.props.flagged),
		};

		this.handleDeepDive = this.handleDeepDive.bind(this);
		this.handleExpandComments = this.handleExpandComments.bind(this);
		this.handleCollapseComments = this.handleCollapseComments.bind(this);
		this.handleFollow = this.handleFollow.bind(this);
		this.handleUnfollow = this.handleUnfollow.bind(this);
		this.handleLike = this.handleLike.bind(this);
		this.handleCommented = this.handleCommented.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleFlag = this.handleFlag.bind(this);
		this.handleStatus = this.handleStatus.bind(this);
	}
	componentDidMount() {

		fetch(UserProfile.getDatabase() + 'findLike', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				empID: UserProfile.getID(),
				postID: this.props.id,

			})
		})
			.then((response) => response.json())
			.then(responseJson => {
				if (responseJson.value.length > 0) {
					this.setState({ liked: true })
				}

			})
			.catch((error) => {
				console.error(error);
			});

	}
	showSuccess = () => { //show nackbar
		this.setState({ successOpen: true });
	};

	hideSuccess = () => { //hide snackbar
		this.setState({ successOpen: false });
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.like !== undefined && this.props.like !== nextProps.like) {
			let likeColor = "rgb(153, 153, 153)";
			if (nextProps.like) {
				likeColor = "#4482ff";
			}
			this.setState({ liked: nextProps.like, likeColor: likeColor, rating: nextProps.rating });
		}
		if (this.props.numComments !== undefined && this.props.numComments !== nextProps.numComments) {
			this.setState({ numComments: nextProps.numComments });
		}

		this.setState({ date: this.getTimeElapsed(nextProps.date), rating: nextProps.rating });
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

	handleDeepDive() {
		this.props.onDeepDive(this.props.id);
	}

	async handleLike() {
		if (!this.state.liked) {
			try {
				fetch(UserProfile.getDatabase() + 'like/addLike', {
					method: 'PUT',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						empID: UserProfile.getID(),
						postID: this.props.id,
					})
				})
			} catch (error) {
				console.log(error);
			}
			try {
				fetch(UserProfile.getDatabase() + 'like', {
					method: 'PUT',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						empID: UserProfile.getID(),
						postID: this.props.id,
					})
				})
			} catch (error) {
				console.log(error);
			}
			// if (this.props.empID !== UserProfile.getID()) {
			// 	var localDate = new Date();
			// 	localDate.setSeconds(localDate.getSeconds() - 1);
			// 	try {
			// 		let response = await fetch(UserProfile.getDatabase() + 'notify/getNotif', {
			// 			method: 'POST',
			// 			headers: {
			// 				'Accept': 'application/json',
			// 				'Content-Type': 'application/json',
			// 			},
			// 			body: JSON.stringify({
			// 				empID: this.props.empID,
			// 				postID: this.props.postID,
			// 				event: 'Like',
			// 			})
			// 		});
			// 		let responseJson = await response.json();
			// 		if (responseJson.length > 0) {
			// 			let list = responseJson[0].peopleList.split(',');
			// 			let commaList = list;
			// 			for (let i = 0; i < list.length; i++) {
			// 				if (commaList[i].trim() === UserProfile.getName()) {
			// 					list.splice(i, 1);
			// 					let newList = list[0];
			// 					for (let i = 1; i < list.length; i++) {
			// 						newList = newList + ',' + list[i];
			// 					}
			// 					try {
			// 						fetch(UserProfile.getDatabase() + 'notify/updateNotif', {
			// 							method: 'POST',
			// 							headers: {
			// 								'Accept': 'application/json',
			// 								'Content-Type': 'application/json',
			// 							},
			// 							body: JSON.stringify({
			// 								newList: newList,
			// 								empID: this.props.empID,
			// 								postID: this.props.postID,
			// 								event: 'Like',
			// 							})
			// 						}).then(() => {
			// 							try {
			// 								fetch(UserProfile.getDatabase() + 'notify/add', {
			// 									method: 'POST',
			// 									headers: {
			// 										'Accept': 'application/json',
			// 										'Content-Type': 'application/json',
			// 									},
			// 									body: JSON.stringify({
			// 										noteEvent: 'Like',
			// 										firstName: UserProfile.getName(),
			// 										noteDetails: 'liked your idea',
			// 										noteDate: localDate,
			// 										empID: this.props.empID,
			// 										postID: this.props.id,
			// 									})
			// 								})
			// 							} catch (err) {
			// 								console.log(err);
			// 							}
			// 							try {
			// 								fetch(UserProfile.getDatabase() + 'notify/addLikeNotify', {
			// 									method: 'POST',
			// 									headers: {
			// 										'Accept': 'application/json',
			// 										'Content-Type': 'application/json',
			// 									},
			// 									body: JSON.stringify({
			// 										empID: this.props.empID,
			// 									})
			// 								})
			// 							} catch (err) {
			// 								console.log(err);
			// 							}
			// 						})
			// 					} catch (err) {
			// 						console.log(err);
			// 					}
			// 				}
			// 			}
			// 		} else {
			// 			try {
			// 				fetch(UserProfile.getDatabase() + 'notify/add', {
			// 					method: 'POST',
			// 					headers: {
			// 						'Accept': 'application/json',
			// 						'Content-Type': 'application/json',
			// 					},
			// 					body: JSON.stringify({
			// 						noteEvent: 'Like',
			// 						firstName: UserProfile.getName(),
			// 						noteDetails: 'liked your idea',
			// 						noteDate: localDate,
			// 						empID: this.props.empID,
			// 						postID: this.props.id,
			// 					})
			// 				})
			// 			} catch (err) {
			// 				console.log(err);
			// 			}
			// 			try {
			// 				fetch(UserProfile.getDatabase() + 'notify/addLikeNotify', {
			// 					method: 'POST',
			// 					headers: {
			// 						'Accept': 'application/json',
			// 						'Content-Type': 'application/json',
			// 					},
			// 					body: JSON.stringify({
			// 						empID: this.props.empID,
			// 					})
			// 				})
			// 			} catch (err) {
			// 				console.log(err);
			// 			}
			// 		}
			// 	} catch (err) {
			// 		console.log(err);
			// 	}		
			// }
			// var subList;
			// try {
			// 	let response = await fetch(UserProfile.getDatabase() + 'subscriptions/' + this.props.id);
			// 	let responseJson = await response.json();
			// 	if (response.status >= 200 && response.status < 300) {
			// 		subList = responseJson;
			// 	} else {
			// 		let error = responseJson;
			// 		throw error;
			// 	}
			// } catch (e) {
			// 	console.log(e);
			// }
			// if (subList.length > 0) {
			// 	for (let i = 0; i < subList.length; i++) {
			// 		let empID = subList[i].empID;
			// 		try {
			// 			let response = await fetch(UserProfile.getDatabase() + 'auth/GetEmailSettings', {
			// 				method: 'POST',
			// 				headers: {
			// 					'Accept': 'application/json',
			// 					'Content-Type': 'application/json',
			// 				},
			// 				body: JSON.stringify({
			// 					empID: empID,
			// 				})
			// 			});
			// 			let responseJson = await response.json();
			// 			if (responseJson.length > 0) {
			// 				if (!!+responseJson[0].myLike && this.props.empID === empID) {
			// 					try {
			// 						fetch(UserProfile.getDatabase() + 'mail/EmailNotification', {
			// 							method: 'POST',
			// 							headers: {
			// 								'Accept': 'application/json',
			// 								'Content-Type': 'application/json',
			// 							},
			// 							body: JSON.stringify({
			// 								user: responseJson[0].email,
			// 								subject: 'Someone liked your idea',
			// 								message: 'Hey someone just liked your idea!',
			// 								title: this.props.title,
			// 								type: "Like",
			// 								content: this.state.rating
			// 							})
			// 						})
			// 					} catch (err) {
			// 						console.log(err);
			// 					}
			// 				} else if (!!+responseJson[0].followLike && this.props.empID !== empID) {
			// 					try {
			// 						fetch(UserProfile.getDatabase() + 'mail/EmailNotification', {
			// 							method: 'POST',
			// 							headers: {
			// 								'Accept': 'application/json',
			// 								'Content-Type': 'application/json',
			// 							},
			// 							body: JSON.stringify({
			// 								user: responseJson[0].email,
			// 								subject: 'Someone liked an idea you follow',
			// 								message: "Hey someone just liked an idea you're following!",
			// 								title: this.props.title,
			// 								type: "Like",
			// 								content: this.state.rating
			// 							})
			// 						})
			// 					} catch (err) {
			// 						console.log(err);
			// 					}
			// 				}
			// 			}
			// 		} catch (err) {
			// 			console.log(err);
			// 		}
			// 	}
			// }	
			this.setState({ rating: this.state.rating + 1, liked: true, likeColor: "#4482ff" });
		} else {
			try {
				fetch(UserProfile.getDatabase() + 'dislike/remLike', {
					method: 'PUT',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						empID: UserProfile.getID(),
						postID: this.props.id,
					})
				})
			} catch (error) {
				console.log(error);
			}
			try {
				fetch(UserProfile.getDatabase() + 'dislike', {
					method: 'PUT',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						empID: UserProfile.getID(),
						postID: this.props.id,
					})
				})
			} catch (error) {
				console.log(error);
			}
			this.setState({ rating: this.state.rating - 1, liked: false, likeColor: "grey" });
		}
	}

	handleFollow() {
		try {
			fetch(UserProfile.getDatabase() + 'subscriptions/add', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					postID: this.props.id,
					empID: UserProfile.getID(),
				})
			})
		} catch (err) {
			alert(err);
		}
		this.showSuccess();
		this.setState({ followed: true, followColor: "#4482ff" });
	}

	handleUnfollow() {
		try {
			fetch(UserProfile.getDatabase() + 'subscriptions/remove', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					postID: this.props.id,
					empID: UserProfile.getID(),
				})
			})
		} catch (err) {
			alert(err);
		}
		this.showSuccess();
		this.setState({ followed: false, followColor: "rgb(153, 153, 153)" });
	}

	handleExpandDesc() {
		this.setState({ desc: this.props.desc, descExpanded: true });
		document.body.style.cursor = "default";
	}

	handleCollapseDesc() {
		if (this.props.desc.length > 300) this.setState({ desc: this.props.desc.substring(0, 300) + "...", descExpanded: false });
		document.body.style.cursor = "default";
	}

	handleExpandComments() {
		this.setState({ commentsExpanded: true });
	}

	handleCollapseComments() {
		this.setState({ commentsExpanded: false });
	}

	handleCommented(numComments) {
		this.setState({ numComments: numComments });
	}

	handleMenuClick = event => {
		this.setState({ menuOpen: true, menuAnchorEl: event.currentTarget });
	};

	handleAdminMenuClick = event => {
		this.setState({ adminMenuOpen: true, adminMenuAnchorEl: event.currentTarget });
	};

	handleRequestClose = () => {
		this.setState({ menuOpen: false, adminMenuOpen: false });
	};

	handleDelete() {
		var localDate = new Date();
		localDate.setSeconds(localDate.getSeconds() - 1);
		try {
			fetch(UserProfile.getDatabase() + 'posts/deletePostByStatus', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					postID: this.props.id,
					empID: this.props.empID,
				})
			}).then(() => {
				// try {
				// 	fetch(UserProfile.getDatabase() + 'posts/deletePostNotifs', {
				// 		method: 'POST',
				// 		headers: {
				// 			'Accept': 'application/json',
				// 			'Content-Type': 'application/json',
				// 		},
				// 		body: JSON.stringify({
				// 			postID: this.props.id,
				// 		})
				// 	}).then(() => {

				try {
					fetch(UserProfile.getDatabase() + 'posts/UpdatePostHistory', {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							postID: this.props.id,
							empID: this.props.empID,
							type: 'Status',
							previous: this.props.status,
							new: 'deleted',
							date: localDate
						})
					}).then(() => {
						this.props.refresh();
					});
				} catch (err) {
					console.log(err);
				}

			});
			// 	} catch (err) {
			// 		console.log(err);
			// 	}
			//  });
		} catch (err) {
			console.log(err);
		}
		this.props.tabChange(0, true);
	}


	handleClose = () => {
		this.setState({ menuAnchorEl: null, adminMenuOpen: false, menuOpen: false });
	};


	handleStatus(status) {
		this.handleRequestClose();
		this.props.onUpdate(this.props.id, this.props.title, this.props.status, status);
	}

	handleFlag() {
		try {
			fetch(UserProfile.getDatabase() + "admin/UpdateAdminFlag", {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					flag: !this.state.flagged,
					postID: this.props.id,
				})
			}).then(() => {
				this.setState({ flagged: !this.state.flagged });
			});
		} catch (e) {
			console.log(e);
		}
	}


	render() {
		let statusCircle; // it's a lightbulb, not actually a circle
		if (this.props.status === "inReview") {
			statusCircle =
				<div className="tooltip">
					<Lightbulb style={{ height: 22, width: 22, color: "rgb(231, 111, 133)" }} />
					<span className="tooltiptext">In Review</span>
				</div>
		} else if (this.props.status === "inProgress" || this.props.status === "internal") {
			statusCircle =
				<div className="tooltip">
					<Lightbulb style={{ height: 22, width: 22, color: "orange" }} />
					<span className="tooltiptext">In Progress: internal</span>
				</div>
		} else if (this.props.status === "lab") {
			statusCircle =
				<div className="tooltip">
					<Lightbulb style={{ height: 22, width: 22, color: "orange" }} />
					<span className="tooltiptext">In Progress: Lab</span>
				</div>
		} else if (this.props.status === "Completed") {
			statusCircle =
				<div className="tooltip">
					<Lightbulb style={{ height: 22, width: 22, color: "#009d3c" }} />
					<span className="tooltiptext">Completed</span>
				</div>
		}

		// let expandDescButton;
		// if (this.state.cardType === "-expandable") {
		// 	if (!this.state.descExpanded) {
		// 		expandDescButton = <ExpandMore style={{
		// 			marginLeft: "auto", marginRight: "auto", left: "0", right: "0",
		// 			position: "absolute", color: "grey"
		// 		}} onClick={this.handleExpandDesc} onMouseOver={this.handleExpandHover} onMouseOut={this.handleExpandUnhover} />;
		// 	} else {
		// 		expandDescButton = <ExpandLess style={{
		// 			marginLeft: "auto", marginRight: "auto", left: "0", right: "0",
		// 			position: "absolute", color: "grey"
		// 		}} onClick={this.handleCollapseDesc} onMouseOver={this.handleExpandHover} onMouseOut={this.handleExpandUnhover} />;
		// 	}
		// }

		let commentList;
		let commentListToggle;
		if (this.state.commentsExpanded) {
			let live = (this.props.status === 'live' || this.props.status === 'inReview');
			commentList = <CommentList postID={this.props.id} empID={this.props.empID} status={live} onComment={this.handleCommented} />;
			commentListToggle = this.handleCollapseComments;
		} else {
			commentListToggle = this.handleExpandComments;
		}

		let likeTooltip = "Like";
		if (this.state.liked) likeTooltip = "Unlike";

		let followButton;
		if (this.state.followed) {
			followButton =
				<div className="Card-interaction-true tooltip">
					<div onClick={this.handleUnfollow}>
						<NotifIcOn />
						<span className="tooltiptext"> Unfollow </span>
					</div>
					<Snackbar
						id='follow-snackbar'
						anchorOrigin={this.state.successPosition}
						open={this.state.successOpen}
						////onRequestClose={this.hideSuccess}
						autoHideDuration={5000}
						snackbarcontentprops={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">You have successfully followed {this.props.authorFirst}'s idea! You will now receive updates on this idea.</span>}
					/>
				</div>
		} else {
			followButton =
				<div className="Card-interaction-false tooltip">
					<div onClick={this.handleFollow}>
						<NotifIcon />
						<span className="tooltiptext"> Follow </span>
					</div>
					<Snackbar
						id='unfollow-snackbar'
						anchorOrigin={this.state.successPosition}
						open={this.state.successOpen}
						////onRequestClose={this.hideSuccess}
						autoHideDuration={5000}
						onClose={this.hideSuccess}
						snackbarcontentprops={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">You have unfollowed {this.props.authorFirst}'s idea. You will no longer receive updates on this idea.</span>}
					/>
				</div>
		}

		let authorColor;
		if (UserProfile.getID() === this.props.empID) {
			authorColor = "rgb(0, 0, 216)";
		}

		// admins can delete/update/flag any post
		// regular users can only delete their own posts, if and only if the idea's status is "live"
		let adminItem;
		if (this.props.profile.role==='Administrator') {//  UserProfile.getView() === 'admin' || UserProfile.getView() === 'lab'
			adminItem = (
				<div>
					{/* only "live" ideas can be sent to review */}
					<MenuItem disabled={this.props.status !== "live"} style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6 }} onClick={() => this.handleStatus('inReview')}>Send to Review</MenuItem>

					<MenuItem
						id="disposition-button"
						aria-owns={this.state.adminMenuOpen ? 'admin-card-menu' : null}
						aria-haspopup="true"
						disabled={this.props.status !== "inReview"} // only ideas in review can be moved to disposition
						style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6, zIndex: 800 }}
						onClick={this.handleAdminMenuClick}
					><ArrowDropLeft style={{ height: 20, marginLeft: 0, paddingLeft: 0 }} />  Disposition

					</MenuItem>
					<Menu
						id="admin-card-menu"
						anchorEl={this.state.adminMenuAnchorEl}
						open={this.state.adminMenuOpen}
						////onRequestClose={this.handleRequestClose}
						style={{ zIndex: 800 }}
						onClose={this.handleClose}
						transitionDuration={100}
					>
						<MenuItem key="placeholder" style={{ display: "none" }} />
						<MenuItem style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6 }} onClick={() => this.handleStatus('internal')}>Internal </MenuItem>
						<MenuItem style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6 }} onClick={() => this.handleStatus('lab')} divider>Innovation Lab</MenuItem>
						<MenuItem style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6 }} onClick={() => this.handleStatus('garaged')}>Garaged</MenuItem>
						<MenuItem style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6 }} onClick={() => this.handleStatus('notPursued')}>Not Pursued</MenuItem>
					</Menu>
					{/* only ideas that are in progress can be completed */}
					<MenuItem disabled={this.props.status !== "inProgress" && this.props.status !== "internal" && this.props.status !== "lab"} style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6 }} onClick={() => this.handleStatus('Completed')} divider>Completed</MenuItem>
					<MenuItem className="admin-menu-list-item" style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6 }} onClick={this.handleFlag}>Flag for Admin <div className={"flag-icon-" + this.state.flagged.toString()}><FlagIcon style={{ height: 20 }} /></div></MenuItem>
				</div>
			);
		}

		let menuButton;
		let button = (
			<div style={{ marginTop: 2, marginRight: -10 }}>
				<IconButton
					id="menu-button"
					aria-owns={this.state.menuOpen ? 'user-card-menu' : null}
					aria-haspopup="true"
					onClick={this.handleMenuClick}
					style={{ height: 16, width: 16, color: 'grey' }}
				>
					<MenuButtonIcon style={{ height: 16, width: 16, color: 'grey' }} />
				</IconButton>
				<Menu
					id="user-card-menu"
					anchorEl={this.state.menuAnchorEl}
					open={this.state.menuOpen}
					////onRequestClose={this.handleRequestClose}
					onClose={this.handleClose}
					style={{ marginTop: 35, marginLeft: -25, padding: '0px', zIndex: 800 }}
				// transitionDuration={100}
				// MenuListProps={{
				// 	onMouseEnter: this.enterMenu,
				// 	onMouseLeave: this.leaveMenu,
				// }}
				>
					<MenuItem key="placeholder" style={{ display: "none" }} />
					<MenuItem style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6 }} onClick={this.handleDelete} divider>Delete</MenuItem>
					{adminItem}
				</Menu>

			</div>
		);
		if (this.props.status !== 'inReview' && this.props.status !== 'inProgress' && this.props.status !== "internal" && this.props.status !== "lab" && this.props.status !== 'Completed') {
			if (this.props.profile.employeeId === this.props.empID || this.props.profile.role==='Administrator') {
				menuButton = button;
			}
		} else if (this.props.profile.role==='Administrator') {
			menuButton = button;
		}

		return (
			<div className="Card">
				<div className="Card-row" onClick={this.handleExpandDesc}>
					<h1 className="Card-title" onClick={this.handleDeepDive}>{this.props.title}</h1>
					<div className="Card-header">
						{statusCircle}
						<h2 className="Card-date">{this.state.date}</h2>
					</div>
				</div>
				<div className="Card-row" id="clickable" onClick={this.handleDeepDive}>
					<p className="Card-body">{this.state.desc}</p>
				</div>
				<div className="Card-row">
					<div className="deep-dive-interactions">
						<div className={"tooltip Card-interaction-" + this.state.liked.toString() + ((this.props.status !== "live" && this.props.status !== "inReview") ? ' disabled-button' : '')}
							onClick={(this.props.status === "live" || this.props.status === "inReview") ? this.handleLike : null}>
							<LikeIcon />

							<h2 className="Card-interaction-num">{this.state.rating}</h2>
							<span className="tooltiptext"> {likeTooltip} </span>
						</div>
						<div className={"tooltip Card-interaction-" + this.state.commentsExpanded.toString()} onClick={commentListToggle}>
							<CommentIcon />
							<h2 className="Card-interaction-num">{this.state.numComments}</h2>
							<span className="tooltiptext"> Comments </span>
						</div>
						{followButton}
					</div>
					{/* {expandDescButton} */}
					<h2 className="author">{this.props.targetDep}&nbsp;&nbsp;|&nbsp;&nbsp;<span style={{ color: authorColor }}>{this.props.authorFirst + " " + this.props.authorLast.substr(0, 1)}.</span>{menuButton}</h2>

				</div>
				{commentList}


			</div>
		);
	}
};


export default connect(state => ({
    profile: state.Auth.get('profile'),
}))(IdeaCard);