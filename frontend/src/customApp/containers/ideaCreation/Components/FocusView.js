import React from 'react';
import './FocusView.css';
import './IdeaCard.css';
import LikeIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/ChatBubble';
import NotifIcon from '@material-ui/icons/Notifications';
import NotifIcOn from '@material-ui/icons/NotificationsActive';
import UserProfile from '../UserProfile';
import CommentList from './CommentList';
import StatusUpdateItem from './StatusUpdateItem';
import "typeface-poppins";
import "typeface-questrial";
import "typeface-mukta-malar";
import "typeface-pavanam";
import "typeface-lato";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import MenuButtonIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Progress from '../../../../components/uielements/progress';
import { rtl } from '../../../../config/withDirection';
import { Icon } from 'antd';
import { Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';

class FocusView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            postID: 0,
            title: "",
            timeStamp: "",
            desc: "",
            rating: 0,
            liked: false,
            likeColor: "rgb (153, 153, 153)",
            comments: 0,
            commentsOpen: false, // show status updates on default, comments closed
            followed: false,
            followColor: "rgb(153, 153, 153)",
            empID: "",
            authorFirst: "",
            authorLast: "",
            targetDep: "",
            status: "",
            statusUpdates: [],
            successOpen: false,
            successPosition: {
                vertical: 'top',
                horizontal: 'center'
            },
            menuAnchorEl: null,
            menuOpen: false,
        }

        this.getData = this.getData.bind(this);
        this.getPostUpdates = this.getPostUpdates.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.handleCommentToggle = this.handleCommentToggle.bind(this);
        this.handleCommented = this.handleCommented.bind(this);
        this.handleFollow = this.handleFollow.bind(this);
        this.handleUnfollow = this.handleUnfollow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.hideSuccess = this.hideSuccess.bind(this);
        this.getData();
    }

    componentDidUpdate() { // focus on deep dive
        if (!this.state.loading) document.getElementById("deepDive").focus();
    }

    // for like/follow/comment snackbar alert
    showSuccess() {
        this.setState({ successOpen: true });
    };

    hideSuccess() {
        this.setState({ successOpen: false });
    };

    // fetch all base data about the idea
    // does not include lower content i.e. status updates and comments
    async getData() {
        try {
            let response = await fetch(UserProfile.getDatabase() + 'findPost', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    empID: this.props.profile.employeeId, // pass empID to tell whether or not the user has liked/followed the idea
                    postID: this.props.id
                })
            });
            let responseJson = await response.json();
            if (response.status >= 200 && response.status < 300) {
                if (responseJson.value.length < 1) {
                    alert("can't find deep dive");
                } else {
                    //let accessToken = responseJson[0].accesstoken;
                    let dateString = this.getTimeElapsed(responseJson.value[0].date);
                    let liked = false;
                    let likeColor = "rgb(153, 153, 153)";
                    let followed = false;
                    let followColor = "rgb(153, 153, 153)";
                    if (responseJson.value[0].boolVal === "1") {
                        liked = true;
                        likeColor = "#4482ff";
                    }
                    if (responseJson.value[0].followVal === "1") {
                        followed = true;
                        followColor = "#4482ff";
                    }

                    this.getPostUpdates(responseJson.value[0].postID); // get status updates

                    this.setState({
                        postID: responseJson.value[0].postID,
                        title: responseJson.value[0].title,
                        timeStamp: dateString,
                        desc: responseJson.value[0].descrip,
                        rating: responseJson.value[0].rating,
                        empID: responseJson.value[0].empID,
                        authorFirst: responseJson.value[0].firstName,
                        authorLast: responseJson.value[0].lastName,
                        targetDep: responseJson.value[0].targetDep,
                        status: responseJson.value[0].status,
                        liked: liked,
                        likeColor: likeColor,
                        followed: followed,
                        followColor: followColor,
                        comments: responseJson.value[0].comments,
                        cost: responseJson.value[0].cost,
                        efficiency: responseJson.value[0].efficiency,
                        insights: responseJson.value[0].insights,
                        ux: responseJson.value[0].ux,
                    });
                }
            } else {
                alert("deep dive error");
                let error = responseJson;
                throw error;
            }
        } catch (e) {
            //this.removeToken();
            console.error(e);
        }
    }

    async getPostUpdates(id) {
        try {
            fetch(UserProfile.getDatabase() + "posts/GetPostStatusHistory", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postID: id,
                }),
            }).then((response) => {
                return response.json();
            }).then((parsedData) => { // if the idea doesn't have any status updates yet, show comments on default instead
                this.setState({ loading: false, statusUpdates: parsedData.value, commentsOpen: (parsedData.length === 0) });
            });
        } catch (error) {
            console.log(error);
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

    renderStatusUpdates() {
        return this.state.statusUpdates.map((statusUpdate) => {
            return <StatusUpdateItem key={statusUpdate.histID} date={statusUpdate.date}
                status={statusUpdate.newState} prevStatus={statusUpdate.previousState} message={statusUpdate.message} />
        })
    }

    // pressing esc closes the deep dive except for when typing in the comment box
    handleKeyDown(e) {
        if (e.keyCode === 27 && document.activeElement.id !== "comment-box") {
            this.props.closeDeepDive();
        }
    }

    // db calls for toggling liking the idea
    handleLike() {
        if (!this.state.liked) {
            try {
                fetch(UserProfile.getDatabase() + 'like/addLike', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        empID: this.props.profile.employeeId,
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
                        empID: this.props.profile.employeeId,
                        postID: this.props.id,
                    })
                })
            } catch (error) {
                console.log(error);
            }
            if (this.props.empID !== this.props.profile.employeeId) {
                var localDate = new Date();
                localDate.setSeconds(localDate.getSeconds() - 1);
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
                            empID: this.state.empID,
                            postID: this.props.id,
                        })
                    });
                } catch (err) {
                    alert(err);
                }
                try {
                    fetch(UserProfile.getDatabase() + 'notify/addLikeNotify', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            empID: this.state.empID,
                        })
                    })
                } catch (err) {
                    alert(err);
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
                        empID: this.props.profile.employeeId,
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
                        empID: this.props.profile.employeeId,
                        postID: this.props.id,
                    })
                })
            } catch (error) {
                console.log(error);
            }
            this.setState({ rating: this.state.rating - 1, liked: false, likeColor: "grey" });
        }
    }

    // show/close comments section when clicking on the comment button
    handleCommentToggle() {
        if (this.state.statusUpdates.length > 0) { // toggle comments view when the post has status updates
            this.setState({ commentsOpen: !this.state.commentsOpen });
        } else if (document.getElementById("comment-box")) {
            // if there are no status updates, comments are always shown, so just enter the comment box
            document.getElementById("comment-box").focus();
        }
    }

    // re-fetch data after a comment to update the comment count
    handleCommented() {
        this.getData();
    }

    // db calls for following an idea
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
                    empID: this.props.profile.employeeId,
                })
            })
        } catch (err) {
            alert(err);
        }
        this.showSuccess(); // snackbar alert after following
        this.setState({ followed: true, followColor: "#4482ff" }); // update follow button
    }

    // db calls for unfollowing an idea
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
                    empID: this.props.profile.employeeId,
                })
            })
        } catch (err) {
            alert(err);
        }
        this.showSuccess(); // snackbar alert after unfollowing
        this.setState({ followed: false, followColor: "rgb(153, 153, 153)" }); // update follow button
    }

    // admin menu for deleting
    // status updates not implemented in deep dive
    handleMenuClick = event => {
        this.setState({ menuOpen: true, menuAnchorEl: event.currentTarget });
    };

    handleRequestClose = () => {
        this.setState({ menuOpen: false });
    };

    // db calls for deleting the idea
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
            }).then(() => {
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
                    }).then(() => { // close deep dive after deleting
                        this.props.closeDeepDive();
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
        const marginStyle = {
            margin: rtl === 'rtl' ? '0 0 10px 10px' : '0 10px 10px 0',
        };
        let likeTooltip = "Like";
        if (this.state.liked) likeTooltip = "Unlike";

        let followButton; // conditionally render follow icon based on whether or not you're following it
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
                        //onRequestClose={this.hideSuccess}
                        autoHideDuration={5000}
                        snackbarcontentprops={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">You have successfully followed {this.state.authorFirst}'s idea! You will now receive updates on this idea.</span>}
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
                        //onRequestClose={this.hideSuccess}
                        onClose={this.hideSuccess}
                        autoHideDuration={5000}
                        snackbarcontentprops={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">You have unfollowed {this.state.authorFirst}'s idea. You will no longer receive updates on this idea.</span>}
                    />
                </div>
        }

        let authorColor; // display name in blue if you are the author
        if (this.props.profile.employeeId === this.state.empID) {
            authorColor = "rgb(0, 0, 216)";
        }

        // menu shown under the same conditions as on IdeaCard
        let menuButton;
        let button = (
            <div style={{ marginTop: 2, marginRight: -10 }}>
                <IconButton
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
                    //onRequestClose={this.handleRequestClose}
                    onClose={this.handleRequestClose}
                    style={{ marginTop: 35, marginLeft: -25, padding: '0px' }}
                >
                    <MenuItem style={{ fontSize: 14, paddingTop: 6, paddingBottom: 6 }} onClick={this.handleDelete}>Delete</MenuItem>
                </Menu>
            </div>
        );
        if (this.state.status !== 'inReview' && this.state.status !== 'inProgress' && this.state.status !== 'Completed') {
            if (this.props.profile.employeeId === this.state.empID ||  this.props.profile.role==='Administrator') {
                menuButton = button;
            }
        } else if ( this.props.profile.role==='Administrator'|| this.props.profile.employeeId === this.state.empID ) {
            menuButton = button;
        }

        // show status bar for ideas that have graduated from live
        let statusBar;
        let live = false;
        if (this.state.status === "live") {
            live = true;
        } else if (this.state.status === "inReview") {
            live = true;
            if (!this.state.commentsOpen) { // remove status bar when displaying comment box
                statusBar =
                    <div className="deep-dive-status-row" style={{ backgroundColor: "rgba(231, 111, 133, 0.8)" }}>
                        <p className="deep-dive-status" style={{ color: "white" }}>
                            This idea is currently being reviewed by the Committee.
                        </p>
                    </div>;
            }
        } else if (this.state.status === "inProgress") {
            statusBar =
                <div className="deep-dive-status-row" style={{ backgroundColor: "rgb(255, 162, 0)" }}>
                    <p className="deep-dive-status" style={{ color: "white" }}>
                        This idea has been reviewed by the Committee and is currently being put into action. Liking and commenting has thus been disabled.
                    </p>
                </div>;
        } else if (this.state.status === "internal") {
            statusBar =
                <div className="deep-dive-status-row" style={{ backgroundColor: "rgb(255, 162, 0)" }}>
                    <p className="deep-dive-status" style={{ color: "white" }}>
                        This idea was reviewed by the Committee and has been sent to internal to be implemented. Liking and commenting has thus been disabled.
                    </p>
                </div>;
        } else if (this.state.status === "lab") {
            statusBar =
                <div className="deep-dive-status-row" style={{ backgroundColor: "rgb(255, 162, 0)" }}>
                    <p className="deep-dive-status" style={{ color: "white" }}>
                        This idea was reviewed by the Committee and has been sent to the Lab to be implemented. Liking and commenting has thus been disabled.
                    </p>
                </div>;
        } else if (this.state.status === "Completed") {
            statusBar =
                <div className="deep-dive-status-row" style={{ backgroundColor: "rgb(0, 192, 72)" }}>
                    <p className="deep-dive-status" style={{ color: "white" }}>
                        This idea has been implemented. Thanks to everyone for contributing.
                    </p>
                </div>;
        }

        let lowerContent;
        if (this.state.commentsOpen) { // display either comments or status updates
            lowerContent =
                <div>
                    <CommentList parent="deepDive" postID={this.props.id} empID={this.state.empID} status={live} onComment={this.handleCommented} />
                </div>;
        } else {
            lowerContent =
                <div className="status-update">
                    <h1>Status Updates</h1>
                    {this.renderStatusUpdates()}
                </div>;
        }

        if (this.state.loading) { // don't display anything while still fetching
            return (null);
        } else { // only open deep dive when we have all the base data
            return (
                <div className="deep-dive-background" onClick={this.props.closeDeepDive}>
                    <div className="deep-dive" id="deepDive" onClick={(e) => e.stopPropagation()} onKeyDown={this.handleKeyDown} tabIndex="3">
                        <div className="deep-dive-row">
                            <h1 className="deep-dive-title">{this.state.title}</h1>
                            <h2 className="deep-dive-date">{this.state.timeStamp}</h2>
                        </div>
                        <div className="deep-dive-row">
                            <p className="deep-dive-body">{this.state.desc}</p>
                        </div>
                        <div className="deep-dive-row">
                            <div className="deep-dive-interactions">
                                <div
                                    className={"tooltip deep-dive-interaction-" + this.state.liked.toString() + ((this.state.status !== "live" && this.state.status !== "inReview") ? ' disabled-button' : '')}
                                    onClick={(this.state.status === "live" || this.state.status === "inReview") ? this.handleLike : null}>
                                    <LikeIcon />
                                    <h2 className="deep-dive-interaction-num">{this.state.rating}</h2>
                                    <span className="tooltiptext"> {likeTooltip} </span>
                                </div>
                                <div className={"tooltip deep-dive-interaction-" + this.state.commentsOpen.toString()} onClick={this.handleCommentToggle}>
                                    <CommentIcon />
                                    <h2 className="deep-dive-interaction-num">{this.state.comments}</h2>
                                    <span className="tooltiptext"> Comments </span>
                                </div>
                                {followButton}


                            </div>
                            <h2 className="deep-dive-author">{this.state.targetDep}&nbsp;&nbsp;|&nbsp;&nbsp;<span style={{ color: authorColor }}>{this.state.authorFirst + " " + this.state.authorLast.substr(0, 1)}.</span>&nbsp;{menuButton}</h2>
                        </div>
                        <div style={{ justifyContent: 'center', display: 'inline-flex' }}>
                            <Row>
                                <Col xs={3}>
                                    <h4 style={{ marginBottom: '16px' }} >Cost  <i className="ion-social-usd" /></h4>
                                    <Progress
                                        type="circle"
                                        percent={this.state.cost}
                                        style={marginStyle}
                                        status='active'
                                        width={70}
                                    />
                                </Col>

                                <Col xs={4}>
                                    <h4 style={{ marginBottom: '16px' }}>Efficiency  <i className="ion-speedometer" /></h4>

                                    <Progress
                                        type="circle"
                                        percent={this.state.efficiency}
                                        style={marginStyle}
                                        status='active'
                                        width={70}
                                    />
                                </Col>

                                <Col xs={3}>
                                    <h4 style={{ marginBottom: '16px' }}>Insights  <i className="ion-android-bulb" /></h4>
                                    <Progress
                                        type="circle"
                                        percent={this.state.insights}
                                        style={marginStyle}
                                        status='active'
                                        width={70}
                                    />
                                </Col>
                                <Col xs={2}>
                                    <h4 style={{ marginBottom: '16px' }}>UX   <Icon type="user" /></h4>
                                    <Progress
                                        type="circle"
                                        percent={this.state.ux}
                                        style={marginStyle}
                                        status='active'
                                        width={70}
                                    />
                                </Col>
                            </Row>
                        </div>
                        {statusBar}
                        {lowerContent}
                    </div>
                </div>
            );
        }
    }
}

export default connect(state => ({
    profile: state.Auth.get('profile'),
}))(FocusView);