import React from 'react';
import './Admin.css';
import AdminFocusPopover from './AdminFocusPopover';

import UserProfile from '../../UserProfile';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'; 



import StarIcon from '@material-ui/icons/Star';

import { Row, Col } from 'react-flexbox-grid';

import { CommentCard } from '../CommentCard.js';
import { HistoryCard } from '../historyCard.js';

export default class AdminFocus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            desc: "",
            date: "",
            empID: -1,
            authorFirst: "",
            authorLast: "",
            rating: 0,
            numComments: 0,
            numFollows: 0,
            status: "",
            targetDep: "",
            flagged: false,
            updateMenuOpen: false,
            updateMenuAnchor: null,
            updating: false,
            activeTab: 0,
            likes:0, 
            comments:[],
            hisory:[],
            numContribute:0
        };

        this.setActiveTab = this.setActiveTab.bind(this);

        this.handleUpdateMenuOpen = this.handleUpdateMenuOpen.bind(this);
        this.handleUpdateMenuClose = this.handleUpdateMenuClose.bind(this);
        this.handleFlag = this.handleFlag.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleCancelUpdate = this.handleCancelUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    // update when parent updates i.e. selecting an idea
    componentWillReceiveProps(nextProps) {
        this.getData(nextProps.postID);

        if (nextProps.flagToggle) {
            this.setState({ flagged: !this.state.flagged });
        }
    }

    // get base data for idea
    async getData(id) {
        try {
            fetch(UserProfile.getDatabase() + "findPost" , {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    empID: UserProfile.getID(),
                    postID: id
                }),
            }).then((response) => 
                 response.json()     
            ).then((parsedData) => {
                if (parsedData.value.length < 1) {
                    console.log("can't find idea");
                } else {
                    let date = new Date(parsedData.value[0].date)

                    this.setState({
                        title: parsedData.value[0].title,
                        desc: parsedData.value[0].descrip,
                        date: date.toDateString(),
                        empID: parsedData.value[0].empID,
                        authorFirst: parsedData.value[0].firstName,
                        authorLast: parsedData.value[0].lastName,
                        rating: parsedData.value[0].rating,
                        numComments: parsedData.value[0].comments,
                        status: parsedData.value[0].status,
                        postID: parsedData.value[0].postID,
                        targetDep: parsedData.value[0].targetDep,
                        flagged: Boolean(parsedData.value[0].adminFlag),
                    });
                    this.getComments(this.props.postID)
                    this.getHistory(this.props.postID)
                    this.getContributors(this.props.postID)
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    setActiveTab(tab) {
        this.setState({ activeTab: tab });
    }

    // open popover to update status
    handleUpdateMenuOpen(e) {
        this.setState({ updating: true });
    }

    // close status update popover
    handleCancelUpdate() {
        this.setState({ updating: false });
    }

    // dropdown menu for status updates -- NOT in use
    handleUpdateMenuClose(e) {
        this.setState({ updateMenuOpen: false, updateMenuAnchor: null })
    }


    
    async getContributors(postID) {
        fetch(UserProfile.getDatabase() + 'contributors' , {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postID:postID,
	
			})})
			.then((response) =>  response.json())
			.then(responseJson=>{
                
                this.setState({  numContribute: responseJson.value.length})
			}  )
			.catch((error) => {
				console.error(error);
        });
    }
    async getComments(postID) {
        fetch(UserProfile.getDatabase() + 'getComments' , {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postID:postID,
	
			})})
			.then((response) =>  response.json())
			.then(responseJson=>{
                this.setState({  comments:responseJson.value, numComments: responseJson.value.length})
			}  )
			.catch((error) => {
				console.error(error);
        });
    }
    async getHistory(postID) {
        fetch(UserProfile.getDatabase() + 'posts/GetPostStatusHistory' , {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postID:postID,
	
			})})
			.then((response) =>  response.json())
			.then(responseJson=>{
                this.setState({  history:responseJson.value, })
			}  )
			.catch((error) => {
				console.error(error);
        });
    } 
  
    // backend calls for sending a status update
    async handleStatusChange(status, message) {
        let date = new Date();
        date.setSeconds(date.getSeconds() - 1);

        try {
            fetch(UserProfile.getDatabase() + "admin/ChangeStatus", {
                method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					status: status,
					postID: this.props.postID,
				})
            }).then(() => {
                try {
                    fetch(UserProfile.getDatabase() + "posts/UpdatePostHistory", {
                        method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							postID: this.props.postID,
							empID: UserProfile.getID(),
							previous: this.state.status,
							type: 'Status',
							new: status,
                            date: date,
                            message: message,
						})
                    })
                } catch (e) {
                    console.log(e);
                }

                this.props.refresh();

                // try {
                //     fetch(UserProfile.getDatabase() + "subscriptions/" + this.props.id).then((response) => {
                //         return response.json();
                //     }).then((parsedData) => {
                //         for (let user in parsedData) {
                //             try {
                //                 fetch(UserProfile.getDatabase() + "admin/ChangeStatusNotif", {
                //                     method: 'POST',
                //                     headers: {
                //                         'Accept': 'application/json',
                //                         'Content-Type': 'application/json',
                //                     },
                //                     body: JSON.stringify({
                //                         noteEvent: 'Follow',
                //                         noteDetails: message,
                //                         noteDate: date,
                //                         empID: user.empID,
                //                         postID: this.props.postID,
                //                     })
                //                 })
                //             } catch(e) {
                //                 console.log(e);
                //             }
                //             try {
                //                 fetch(UserProfile.getDatabases() + "notify/addFollowNotify", {
                //                     method: 'POST',
                //                     headers: {
                //                         'Accept': 'application/json',
                //                         'Content-Type': 'application/json',
                //                     },
                //                     body: JSON.stringify({
                //                         empID: user.empID,
                //                     })
                //                 });
                //             } catch(e) {
                //                 console.log(e);
                //             }
                //         }
                //     })
                // } catch (e) {
                //     console.log(e);
                // }
            }).then(() => {
                this.handleCancelUpdate();
            })
        } catch(e) {
            console.log(e);
        }
    }

    // flagging the idea
    handleFlag(e) {
        e.stopPropagation();
        try {
            fetch(UserProfile.getDatabase() + "admin/UpdateAdminFlag", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    flag: !this.state.flagged,
                    postID: this.props.postID,
                })
            }).then(() => {
                this.props.refresh(); // update parent so AdminList is in sync

                this.setState({ flagged: !this.state.flagged });
            });
        } catch (e) {
            console.log(e);
        }
    }
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
					postID: this.state.postID,
					empID: this.state.empID,
				})
			}).then(()=> {
						try {
							fetch(UserProfile.getDatabase() + 'posts/UpdatePostHistory', {
								method: 'POST',
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									postID: this.state.postID,
									empID: this.state.empID,
									type: 'Status',
									previous: this.state.status,
									new: 'deleted',
									date: localDate
								})
							}).then(() => { // change state to deleted
								this.setState({
                                    status: 'deleted'
                                })
							});
						} catch (err) {
							console.log(err);
						}
			});
		} catch (err) {
			console.log(err);
		}
	}
    render() {
        let popover; // conditionally display update popover
        
        if (this.state.updating) {
            popover = <AdminFocusPopover type="update" onSend={this.handleStatusChange} onClose={this.handleCancelUpdate} />
        }

        if (this.props.postID < 0) {
            return (
                <div className="admin-focus">
                    <div className="admin-focus-toolbar">
                    </div>
                </div>
            );
        } else {
           
            return (
                <div className="admin-focus" >
                    <div className="admin-focus-toolbar">
                    {/* currently, only the update button on the toolbar works */}
                        <p className="admin-toolbar-button" onClick={this.handleUpdateMenuOpen}>Update</p>
                        <Menu // this menu is not in use right now
                            id="admin-update-menu"
                            anchorEl={this.state.updateMenuAnchor}
                            open={this.state.updateMenuOpen}
                            //onRequestClose={this.handleUpdateMenuClose}
                        >
                            <MenuItem>Review</MenuItem>
                        </Menu>
                        <p className="admin-toolbar-button" onClick={this.handleDelete}>Delete</p>
                        {/* <p className="admin-toolbar-button">Message</p> */}
                    </div>
                    <div className="admin-focus-container">
                        {popover}
                        <div className="admin-focus-row">
                            <p className="admin-focus-title">{this.state.title}</p>
                            <div className="admin-caption">
                                <StarIcon id={"focus-flag-" + this.props.postID} className={"admin-item-flag-" + this.state.flagged.toString()} onClick={this.handleFlag} />
                                <p className={"admin-focus-status admin-status-" + this.state.status}>{this.state.status}</p>
                            </div>
                        </div>
                        <p className="admin-focus-desc">{this.state.desc}</p>
                        <div className="admin-focus-detail-row">
                            <p className="admin-focus-detail">{this.state.authorFirst} {this.state.authorLast}</p>
                            <p className="admin-focus-detail">{this.state.targetDep}</p>
                            <p className="admin-focus-detail">{this.state.date}</p>
                        </div>
                        <div className="admin-focus-tab-container">
                            <p className={"admin-focus-tab-" + Boolean(this.state.activeTab === 0).toString()} onClick={() => this.setActiveTab(0)}>Metrics</p>
                            <p className={"admin-focus-tab-" + Boolean(this.state.activeTab === 1).toString()} onClick={() => this.setActiveTab(1)}>Comments</p>
                            <p className={"admin-focus-tab-" + Boolean(this.state.activeTab === 2).toString()} onClick={() => this.setActiveTab(2)}>History</p>
                        </div>
                    </div>
                    <div>
                        
                     
                        <div style={{marginLeft:'20px'}}>
                            {this.state.activeTab===0 &&
                                <div>
                                    <Row><Col xs={5}><h4 style={{textAlign:'right', marginBottom: '10px'}}>Likes:</h4></Col ><Col xs={6}><h5 style={{textAlign:'left', marginBottom: '10px'}}>{this.state.rating}</h5></Col></Row>
                                    <Row><Col xs={5}><h4 style={{textAlign:'right', marginBottom: '10px'}}>Comments:</h4></Col><Col xs={6}><h5 style={{textAlign:'left', marginBottom: '10px'}}>{this.state.numComments}</h5></Col></Row>
                                    <Row><Col xs={5}><h4 style={{textAlign:'right'}}>Number of contributors:</h4></Col><Col xs={6}><h5 style={{textAlign:'left'}}>{this.state.numContribute}</h5></Col></Row>
                                    
                                
                                </div>
                            }
                            {this.state.activeTab===1 &&
                                // <div > comments</div>
                            
                                this.state.comments.map(post => { // render comments
                                    return <div key={post.commentID} id="comment-list" style={{ overflowY: 'scroll', maxHeight: "320px", margin: "0px -24px", padding: "0px 24px" }}>
                                    <CommentCard key={post.commentID} id={post.commentID} postID={this.props.postID} author={post.firstName} date={post.date}
                                        desc={post.desc} empID={post.empID} live={this.props.status} getComments={this.getComments} parent={this.props.parent} admin />
                                    </div>   
                                })
                            }
                            {this.state.activeTab===2 &&
                            
                                 this.state.history.map(hist => { // render comments
                                    return <div id="comment-list" key={hist.histID} style={{ overflowY: 'scroll', maxHeight: "320px", margin: "0px -24px", padding: "0px 24px" }}>
                                        {/* <h1>{hist.empID}</h1><h1>{hist.previous}</h1><h1>{hist.type}</h1><h1>{hist.message}</h1><h1>{hist.date}</h1> */}
                                        <HistoryCard key={hist.histID} id={hist.histID} postID={this.props.postID} previous={hist.previous} new={hist.new} date={hist.date}
                                        message={hist.message} empID={hist.empID} live={this.props.status}  parent={this.props.parent} admin />
                                    </div>   
                                })
                            }
                            
                        </div>
                   
                    </div>    
                </div>
                
            );
        }
    }
}