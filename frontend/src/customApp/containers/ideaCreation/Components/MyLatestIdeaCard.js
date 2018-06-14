import React from 'react';
import LikeIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/ChatBubble';
import Lightbulb from '@material-ui/icons/LightbulbOutline';
import YellowBulb from '../images/Yellow.svg';
import OrangeBulb from '../images/Orange.svg';
import GreenBulb from '../images/Green.svg';
import './IdeaCard.css';
import './FocusView.css';
import UserProfile from '../UserProfile';
import "typeface-roboto";
import { connect } from 'react-redux';

class MyLatestIdeaCard extends React.Component {
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
		this.showSuccess = this.showSuccess.bind(this);
		this.hideSuccess = this.hideSuccess.bind(this);
	}

	showSuccess() {
		this.setState({ successOpen: true });
	};

	hideSuccess() {
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
			console.log('num comments next: ', nextProps.numComments);
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
						empID: this.props.profil.employeeId,
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
						empID: this.props.profil.employeeId,
						postID: this.props.id,
					})
				})
			} catch (error) {
				console.log(error);
			}
			if (this.props.empID !== this.props.profil.employeeId) {
				var localDate = new Date();
				localDate.setSeconds(localDate.getSeconds() - 1);
				try {
					let response = await fetch(UserProfile.getDatabase() + 'notify/getNotif', {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							empID: this.props.empID,
							postID: this.props.postID,
							event: 'Like',
						})
					});
					let responseJson = await response.json();
					if (responseJson.length > 0) {
						let list = responseJson[0].peopleList.split(',');
						let commaList = list;
						console.log(list.length);
						for (let i = 0; i < list.length; i++) {
							if (commaList[i].trim() === this.props.profil.firstName) {
								list.splice(i, 1);
								console.log("new list: " + list);
								let newList = list[0];
								for (let i = 1; i < list.length; i++) {
									newList = newList + ',' + list[i];
								}
								try {
									fetch(UserProfile.getDatabase() + 'notify/updateNotif', {
										method: 'POST',
										headers: {
											'Accept': 'application/json',
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({
											newList: newList,
											empID: this.props.empID,
											postID: this.props.postID,
											event: 'Like',
										})
									}).then(() => {
										try {
											fetch(UserProfile.getDatabase() + 'notify/add', {
												method: 'POST',
												headers: {
													'Accept': 'application/json',
													'Content-Type': 'application/json',
												},
												body: JSON.stringify({
													noteEvent: 'Like',
													firstName: UserProfile.getName(),
													noteDetails: 'liked your idea',
													noteDate: localDate,
													empID: this.props.empID,
													postID: this.props.id,
												})
											})
										} catch (err) {
											console.log(err);
										}
										try {
											fetch(UserProfile.getDatabase() + 'notify/addLikeNotify', {
												method: 'POST',
												headers: {
													'Accept': 'application/json',
													'Content-Type': 'application/json',
												},
												body: JSON.stringify({
													empID: this.props.empID,
												})
											})
										} catch (err) {
											console.log(err);
										}
									})
								} catch (err) {
									console.log(err);
								}
							}
						}
					} else {
						try {
							fetch(UserProfile.getDatabase() + 'notify/add', {
								method: 'POST',
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									noteEvent: 'Like',
									firstName: this.props.profil.firstName,
									noteDetails: 'liked your idea',
									noteDate: localDate,
									empID: this.props.empID,
									postID: this.props.id,
								})
							})
						} catch (err) {
							console.log(err);
						}
						try {
							fetch(UserProfile.getDatabase() + 'notify/addLikeNotify', {
								method: 'POST',
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									empID: this.props.empID,
								})
							})
						} catch (err) {
							console.log(err);
						}
					}
				} catch (err) {
					console.log(err);
				}
			}
			var subList;
			try {
				let response = await fetch(UserProfile.getDatabase() + 'subscriptions/' + this.props.id);
				let responseJson = await response.json();
				if (response.status >= 200 && response.status < 300) {
					subList = responseJson;
				} else {
					let error = responseJson;
					throw error;
				}
			} catch (e) {
				console.log(e);
			}
			if (subList.length > 0) {
				for (let i = 0; i < subList.length; i++) {
					let empID = subList[i].empID;
					try {
						let response = await fetch(UserProfile.getDatabase() + 'auth/GetEmailSettings', {
							method: 'POST',
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								empID: empID,
							})
						});
						let responseJson = await response.json();
						if (responseJson.length > 0) {
							if (!!+responseJson[0].myLike && this.props.empID === empID) {
								try {
									fetch(UserProfile.getDatabase() + 'mail/EmailNotification', {
										method: 'POST',
										headers: {
											'Accept': 'application/json',
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({
											user: responseJson[0].email,
											subject: 'Someone liked your idea',
											message: 'Hey someone just liked your idea!',
											title: this.props.title,
											type: "Like",
											content: this.state.rating
										})
									})
								} catch (err) {
									console.log(err);
								}
							} else if (!!+responseJson[0].followLike && this.props.empID !== empID) {
								try {
									fetch(UserProfile.getDatabase() + 'mail/EmailNotification', {
										method: 'POST',
										headers: {
											'Accept': 'application/json',
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({
											user: responseJson[0].email,
											subject: 'Someone liked an idea you follow',
											message: "Hey someone just liked an idea you're following!",
											title: this.props.title,
											type: "Like",
											content: this.state.rating
										})
									})
								} catch (err) {
									console.log(err);
								}
							}
						}
					} catch (err) {
						console.log(err);
					}
				}
			}
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
						empID: this.props.profil.employeeId,
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
						empID: this.props.profil.employeeId,
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
					empID: this.props.profil.employeeId,
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
					empID: this.props.profil.employeeId,
				})
			})
		} catch (err) {
			alert(err);
		}
		this.showSuccess();
		this.setState({ followed: false, followColor: "rgb(153, 153, 153)" });
	}

	// handleExpandDesc() {
	// 	this.setState({ desc: this.props.desc, descExpanded: true });
	// 	document.body.style.cursor = "default";
	// }

	// handleCollapseDesc() {
	// 	if (this.props.desc.length > 300) this.setState({ desc: this.props.desc.substring(0, 300) + "...", descExpanded: false });
	// 	document.body.style.cursor = "default";
	// }

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
						this.props.tabChange(this.props.tab);
					});
				} catch (err) {
					console.log(err);
				}

				// 	});
				// } catch (err) {
				// 	console.log(err);
				// }
			});
		} catch (err) {
			console.log(err);
		}
	}

	handleStatus(status) {
		this.handleRequestClose();
		this.props.onUpdate(this.props.id, this.props.title, this.props.status, status);
	}

	async handleStatusChange(newStatus) {
		var localDate = new Date();
		localDate.setSeconds(localDate.getSeconds() - 1);
		try {
			fetch(UserProfile.getDatabase() + 'admin/ChangeStatus', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					status: newStatus,
					postID: this.props.id,
				})
			}).then(async () => {
				var subList;
				try {
					let response = await fetch(UserProfile.getDatabase() + 'subscriptions/' + this.props.id);
					let responseJson = await response.json();
					if (response.status >= 200 && response.status < 300) {
						subList = responseJson;
					} else {
						let error = responseJson;
						throw error;
					}
				} catch (e) {
					console.log(e);
				}
				if (subList.length > 0) {
					let noteString = 'has changed the status of this idea to ' + newStatus;
					for (let i = 0; i < subList.length; i++) {
						let empID = subList[i].empID;
						if (this.props.empID === empID) {
							noteString = 'has changed the status of your idea to ' + newStatus;
						}
						try {
							fetch(UserProfile.getDatabase() + 'admin/ChangeStatusNotif', {
								method: 'POST',
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									noteEvent: 'Follow',
									firstName: UserProfile.getView(),
									noteDetails: noteString,
									noteDate: localDate,
									empID: empID,
									postID: this.props.id,
								})
							})
						} catch (err) {
							console.log(err);
						}
						try {
							fetch(UserProfile.getDatabase() + 'notify/addFollowNotify', {
								method: 'POST',
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									empID: empID,
								})
							}).then(async () => {
								try {
									let response = await fetch(UserProfile.getDatabase() + 'auth/GetEmailSettings', {
										method: 'POST',
										headers: {
											'Accept': 'application/json',
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({
											empID: empID,
										})
									});
									let responseJson = await response.json();
									if (!!+responseJson[0].myAdminStatus && this.props.empID === empID) {
										try {
											fetch(UserProfile.getDatabase() + 'mail/EmailNotification', {
												method: 'POST',
												headers: {
													'Accept': 'application/json',
													'Content-Type': 'application/json',
												},
												body: JSON.stringify({
													user: responseJson[0].email,
													subject: 'Status Change on your idea',
													message: 'The status of your idea has changed to ' + newStatus,
													title: this.props.title,
													type: "New Status",
													content: newStatus
												})
											})
										} catch (err) {
											console.log(err);
										}
									} else if (!!+responseJson[0].followAdminStatus && this.props.empID !== empID) {
										try {
											fetch(UserProfile.getDatabase() + 'mail/EmailNotification', {
												method: 'POST',
												headers: {
													'Accept': 'application/json',
													'Content-Type': 'application/json',
												},
												body: JSON.stringify({
													user: responseJson[0].email,
													subject: 'Status Change on an idea you follow',
													message: 'The status of an idea you follow has changed to ' + newStatus,
													title: this.props.title,
													type: "New Status",
													content: newStatus
												})
											})
										} catch (err) {
											console.log(err);
										}
									}
								} catch (err) {
									console.log(err);
								}
							})
						} catch (err) {
							console.log(err);
						}
					}
				}
			}).then(() => {


				try {
					fetch(UserProfile.getDatabase() + 'posts/UpdatePostHistory', {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							postID: this.props.id,
							empID: this.props.profil.employeeId,
							previous: this.props.status,
							type: 'Status',
							new: newStatus,
							date: localDate
						})
					}).then(() => {
						this.props.tabChange(this.props.tab);
					});
				} catch (err) {
					console.log(err);
				}
			});
		} catch (err) {
			alert(err);
		}
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
		let statusCircle;
		// if (this.props.status === "inReview") {
		// 	statusCircle =
		// 		<svg height="16" width="16">
		// 			<circle cx="8" cy="8" r="8" fill="rgb(240, 240, 0)">
		// 				<title>In Review</title>
		// 			</circle>
		// 		</svg>;
		// } else if (this.props.status === "inProgress" || this.props.status === "internal" || this.props.status === "lab") {
		// 	statusCircle =
		// 		<svg height="16" width="16">
		// 			<circle cx="8" cy="8" r="8" fill="orange">
		// 				<title>In Progress</title>
		// 			</circle>
		// 		</svg>;
		// } else if (this.props.status === "Completed") {
		// 	statusCircle =
		// 		<svg height="16" width="16">
		// 			<circle cx="8" cy="8" r="8" fill="#009d3c">
		// 				<title>Complete</title>
		// 			</circle>
		// 		</svg>;
		// }

		if (this.props.status === "inReview") {
			statusCircle =
				<div className="tooltip">
					<embed src={YellowBulb} height="22" width="22" />
					<span className="tooltiptext">In Review</span>
				</div>
		} else if (this.props.status === "inProgress" || this.props.status === "internal") {
			statusCircle =
				<div className="tooltip">
					<embed src={OrangeBulb} height="22" width="22" />
					<span className="tooltiptext">In Progress: internal Internal</span>
				</div>
		} else if (this.props.status === "lab") {
			statusCircle =
				<div className="tooltip">
					<embed src={OrangeBulb} height="22" width="22" />
					<span className="tooltiptext">In Progress: Lab</span>
				</div>
		} else if (this.props.status === "Completed") {
			statusCircle =
				<div className="tooltip">
					<embed src={GreenBulb} height="22" width="22" />
					<span className="tooltiptext">Completed</span>
				</div>
		}

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
					<span className="tooltiptext">In Progress: internal </span>
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

		return (
			<div className="MyLatestIdeaCard-Card" onClick={this.handleDeepDive} style={{ cursor: 'pointer' }}>
				<div className="Card-row" onClick={this.handleExpandDesc}>
					<h1 className="MyLatestIdeaCard-title">{this.props.title}</h1>
					<div className="Card-header">
						{statusCircle}
						<h2 className="Card-date">{this.state.date}</h2>
					</div>
				</div>
				<div className="Card-row">
					<div className="deep-dive-interactions">
						<div className={"Card-interaction-" + this.state.liked.toString() + ((this.props.status !== "live" && this.props.status !== "inReview") ? ' disabled-button' : '')}
							onClick={(this.props.status === "live" || this.props.status === "inReview") ? this.handleLike : null}>
							<LikeIcon />
							<h2 className="Card-interaction-num-stay">{this.state.rating}</h2>
						</div>
						<div className={"Card-interaction-" + this.state.commentsExpanded.toString()} >
							<CommentIcon />
							<h2 className="Card-interaction-num-stay">{this.state.numComments}</h2>
						</div>
					</div>
				</div>
			</div>
		);
	}
};
export default connect(state => ({
	profile: state.Auth.get('profile'),
}))(MyLatestIdeaCard);