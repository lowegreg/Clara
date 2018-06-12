import React from 'react';
import { CommentCard } from './CommentCard.js';
import UserProfile from '../UserProfile';
import './Comment.css';
import SendIcon from '@material-ui/icons/Send';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';

export class CommentList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            comment: "",
            commentTextCap: 300,
            commentList: [],
            commentHeight: 0,
            successOpen: false,
            successPosition: {
                vertical: 'top',
                horizontal: 'center'
            }
        }

        this.getComments(true);

        this.showSuccess = this.showSuccess.bind(this);
        this.hideSuccess = this.hideSuccess.bind(this);
        this.getComments = this.getComments.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    // for snackbar alert
    showSuccess() {
        this.setState({ successOpen: true });
    };

    hideSuccess() {
        this.setState({ successOpen: false });
    };

    // fetch a post's comments from database
    async getComments(initial) {
        this.setState({ loading: true });
        try { // db call for fetching comments
            let response = await fetch(UserProfile.getDatabase() + 'getComments', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postID: this.props.postID,
                })
            });
            let responseJson = await response.json();
            if (response.status >= 200 && response.status < 300) {
                this.setState({ commentList: responseJson.value })
                if (this.props.onComment && !initial) this.props.onComment(responseJson.value.length); // update # of comments displayed on parent
            } else {
                let error = responseJson;
                throw error;
            }
        } catch (e) {
            console.log(e);
        }
        setTimeout(() => this.setState({ loading: false }, () => {
            // automatically scroll to the bottom of the comment list to see the newly posted comment
            if (!initial) document.getElementById("comment-list").scrollTop = document.getElementById("comment-list").scrollHeight;
        }), 500);
    }

    renderComments() {
        if (this.state.loading) { // render loading wheel
            return <CircularProgress
                size={30}
                style={{ margin: "16px" }}
            />
        } else {
            if (this.state.commentList.length > 0) {
                return this.state.commentList.map(post => { // render comments
                    return <CommentCard key={post.commentID} id={post.commentID} postID={this.props.postID} author={post.firstName} date={post.date}
                        desc={post.desc} empID={post.empID} live={this.props.status} getComments={this.getComments} parent={this.props.parent} />;
                });
            } else { // filler text if the comment list is empty
                let noComments =
                    <div style={{ margin: "16px" }}>
                        <p style={{ fontSize: "16px", fontStyle: "italic", fontWeight: "300", margin: "0px", }}>There are no comments on this post.</p>
                    </div>;
                return noComments;
            }
        }
    }

    // posting a comment to the database
    async handleComment() {
        let comment = this.state.comment.trim(); // trim whitespace
        if (comment !== '') {
            var localDate = new Date();
            localDate.setSeconds(localDate.getSeconds() - 1);
            try {
                fetch(UserProfile.getDatabase() + 'comments', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postID: this.props.postID,
                        empID: UserProfile.getID(),
                        desc: this.state.comment,
                        date: localDate,
                        firstName: UserProfile.getName()
                    })
                }).then(() => { // once a comment has been posted
                    this.showSuccess(); // display snackbar alert
                    this.setState({ comment: '' }); // reset input box
                    document.getElementById("comment-box").style.height = "auto";
                    document.getElementById("comment-box").style.height = (document.getElementById("comment-box").scrollHeight) + "px";
                    this.getComments(false); // re-fetch comment list (false parameter will make it scroll to the new comment) 
                    fetch(UserProfile.getDatabase() + 'addComments', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            postID: this.props.postID,
                        })
                    }).then(() => { });
                });
            } catch (error) {
                console.log(error);
            }
            // if (UserProfile.getID() !== this.props.empID) { // many many database calls required for notifying idea owner and followers about the comment
            //     try {
            //         let response = await fetch(UserProfile.getDatabase() + 'notify/getNotif', {
            //             method: 'POST',
            //             headers: {
            //                 'Accept': 'application/json',
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify({
            //                 empID: this.props.empID,
            //                 postID: this.props.postID,
            //                 event: 'Comment',
            //             })
            //         });
            //         let responseJson = await response.json();
            //         if (responseJson.length > 0) {
            //             let list = responseJson[0].peopleList.split(',');
            //             let commaList = list;
            //             console.log(list.length);
            //             for (let i = 0; i < list.length; i++) {
            //                 if (commaList[i].trim() === UserProfile.getName()) {
            //                     list.splice(i, 1);
            //                     console.log("new list: " + list);
            //                     let newList = list[0];
            //                     for (let i = 1; i < list.length; i++) {
            //                         newList = newList + ',' + list[i];
            //                     }
            //                     try {
            //                         fetch(UserProfile.getDatabase() + 'notify/updateNotif', {
            //                             method: 'POST',
            //                             headers: {
            //                                 'Accept': 'application/json',
            //                                 'Content-Type': 'application/json',
            //                             },
            //                             body: JSON.stringify({
            //                                 newList: newList,
            //                                 empID: this.props.empID,
            //                                 postID: this.props.postID,
            //                                 event: 'Comment',
            //                             })
            //                         }).then(() => {
            //                             try {
            //                                 fetch(UserProfile.getDatabase() + 'notify/add', {
            //                                     method: 'POST',
            //                                     headers: {
            //                                         'Accept': 'application/json',
            //                                         'Content-Type': 'application/json',
            //                                     },
            //                                     body: JSON.stringify({
            //                                         noteEvent: 'Comment',
            //                                         firstName: UserProfile.getName(),
            //                                         noteDetails: 'commented on your idea',
            //                                         noteDate: localDate,
            //                                         empID: this.props.empID,
            //                                         postID: this.props.postID,
            //                                     })
            //                                 })
            //                             } catch (err) {
            //                                 console.log(err);
            //                             }
            //                             try {
            //                                 fetch(UserProfile.getDatabase() + 'notify/addCommentNotify', {
            //                                     method: 'POST',
            //                                     headers: {
            //                                         'Accept': 'application/json',
            //                                         'Content-Type': 'application/json',
            //                                     },
            //                                     body: JSON.stringify({
            //                                         empID: this.props.empID,
            //                                     })
            //                                 })
            //                             } catch (err) {
            //                                 console.log(err);
            //                             }
            //                         })
            //                     } catch (err) {
            //                         console.log(err);
            //                     }
            //                 }
            //             }
            //         } else {
            //             try {
            //                 fetch(UserProfile.getDatabase() + 'notify/add', {
            //                     method: 'POST',
            //                     headers: {
            //                         'Accept': 'application/json',
            //                         'Content-Type': 'application/json',
            //                     },
            //                     body: JSON.stringify({
            //                         noteEvent: 'Comment',
            //                         firstName: UserProfile.getName(),
            //                         noteDetails: 'commented on your idea',
            //                         noteDate: localDate,
            //                         empID: this.props.empID,
            //                         postID: this.props.postID,
            //                     })
            //                 })
            //             } catch (err) {
            //                 console.log(err);
            //             }
            //             try {
            //                 fetch(UserProfile.getDatabase() + 'notify/addCommentNotify', {
            //                     method: 'POST',
            //                     headers: {
            //                         'Accept': 'application/json',
            //                         'Content-Type': 'application/json',
            //                     },
            //                     body: JSON.stringify({
            //                         empID: this.props.empID,
            //                     })
            //                 })
            //             } catch (err) {
            //                 console.log(err);
            //             }
            //         }
            //     } catch (err) {
            //         console.log(err);
            //     }
            //             var subList;
            //             try {
            //                 let response = await fetch(UserProfile.getDatabase() + 'subscriptions/' + this.props.postID);
            //                 let responseJson = await response.json();
            //                 if (response.status >= 200 && response.status < 300) {
            //                     subList = responseJson;
            //                 } else {
            //                     let error = responseJson;
            //                     throw error;
            //                 }
            //             } catch (e) {
            //                 console.log(e);
            //             }
            //             if (subList.length > 0) {
            //                 for (let i = 0; i < subList.length; i++) {
            //                     let empID = subList[i].empID;
            //                     if (this.props.empID !== subList[i].empID) {
            //                         try {
            //                             let response = await fetch(UserProfile.getDatabase() + 'notify/getNotif', {
            //                                 method: 'POST',
            //                                 headers: {
            //                                     'Accept': 'application/json',
            //                                     'Content-Type': 'application/json',
            //                                 },
            //                                 body: JSON.stringify({
            //                                     empID: subList[i].empID,
            //                                     postID: this.props.postID,
            //                                     event: 'Follow',
            //                                 })
            //                             });
            //                             let responseJson = await response.json();
            //                             if (responseJson.length > 0) {
            //                                 let list = responseJson[0].peopleList.split(',');
            //                                 let commaList = list;
            //                                 for (let i = 0; i < list.length; i++) {
            //                                     if (commaList[i].trim() === UserProfile.getName()) {
            //                                         list.splice(i, 1);
            //                                         let newList = list[0];
            //                                         for (let i = 1; i < list.length; i++) {
            //                                             newList = newList + ',' + list[i];
            //                                         }
            //                                         try {
            //                                             fetch(UserProfile.getDatabase() + 'notify/updateNotif', {
            //                                                 method: 'POST',
            //                                                 headers: {
            //                                                     'Accept': 'application/json',
            //                                                     'Content-Type': 'application/json',
            //                                                 },
            //                                                 body: JSON.stringify({
            //                                                     newList: newList,
            //                                                     empID: empID,
            //                                                     postID: this.props.postID,
            //                                                     event: 'Follow',
            //                                                 })
            //                                             }).then(() => {
            //                                                 try {
            //                                                     fetch(UserProfile.getDatabase() + 'notify/add', {
            //                                                         method: 'POST',
            //                                                         headers: {
            //                                                             'Accept': 'application/json',
            //                                                             'Content-Type': 'application/json',
            //                                                         },
            //                                                         body: JSON.stringify({
            //                                                             noteEvent: 'Follow',
            //                                                             firstName: UserProfile.getName(),
            //                                                             noteDetails: 'commented on an idea you follow',
            //                                                             noteDate: localDate,
            //                                                             empID: empID,
            //                                                             postID: this.props.postID,
            //                                                         })
            //                                                     })
            //                                                 } catch (err) {
            //                                                     console.log(err);
            //                                                 }
            //                                                 try {
            //                                                     fetch(UserProfile.getDatabase() + 'notify/addFollowNotify', {
            //                                                         method: 'POST',
            //                                                         headers: {
            //                                                             'Accept': 'application/json',
            //                                                             'Content-Type': 'application/json',
            //                                                         },
            //                                                         body: JSON.stringify({
            //                                                             empID: empID,
            //                                                         })
            //                                                     })
            //                                                 } catch (err) {
            //                                                     console.log(err);
            //                                                 }
            //                                             });

            //                                         } catch (err) {
            //                                             console.log(err);
            //                                         }
            //                                     }
            //                                 }
            //                             } else {
            //                                 try {
            //                                     fetch(UserProfile.getDatabase() + 'notify/add', {
            //                                         method: 'POST',
            //                                         headers: {
            //                                             'Accept': 'application/json',
            //                                             'Content-Type': 'application/json',
            //                                         },
            //                                         body: JSON.stringify({
            //                                             noteEvent: 'Follow',
            //                                             firstName: UserProfile.getName(),
            //                                             noteDetails: 'commented on an idea you follow',
            //                                             noteDate: localDate,
            //                                             empID: subList[i].empID,
            //                                             postID: this.props.postID,
            //                                         })
            //                                     })
            //                                 } catch (err) {
            //                                     console.log(err);
            //                                 }
            //                                 try {
            //                                     fetch(UserProfile.getDatabase() + 'notify/addFollowNotify', {
            //                                         method: 'POST',
            //                                         headers: {
            //                                             'Accept': 'application/json',
            //                                             'Content-Type': 'application/json',
            //                                         },
            //                                         body: JSON.stringify({
            //                                             empID: subList[i].empID,
            //                                         })
            //                                     })
            //                                 } catch (err) {
            //                                     console.log(err);
            //                                 }
            //                             }
            //                         } catch (err) {
            //                             console.log(err);
            //                         }
            //                     }
            //                     try {
            //                         let response = await fetch(UserProfile.getDatabase() + 'auth/GetEmailSettings', {
            //                             method: 'POST',
            //                             headers: {
            //                                 'Accept': 'application/json',
            //                                 'Content-Type': 'application/json',
            //                             },
            //                             body: JSON.stringify({
            //                                 empID: empID,
            //                             })
            //                         });
            //                         let responseJson = await response.json();
            //                         if (responseJson.length > 0) {
            //                             if (!!+responseJson[0].myComment && this.props.empID === empID) {
            //                                 try {
            //                                     fetch(UserProfile.getDatabase() + 'mail/EmailNotification', {
            //                                         method: 'POST',
            //                                         headers: {
            //                                             'Accept': 'application/json',
            //                                             'Content-Type': 'application/json',
            //                                         },
            //                                         body: JSON.stringify({
            //                                             user: responseJson[0].email,
            //                                             subject: 'Someone commented on your idea',
            //                                             message: "Hey, someone just posted a commment on your idea!",
            //                                             title: this.props.title,
            //                                             type: "Comment",
            //                                             content: comment
            //                                         })
            //                                     })
            //                                 } catch (err) {
            //                                     console.log(err);
            //                                 }
            //                             } else if (!!+responseJson[0].followComment && this.props.empID !== empID) {
            //                                 try {
            //                                     fetch(UserProfile.getDatabase() + 'mail/EmailNotification', {
            //                                         method: 'POST',
            //                                         headers: {
            //                                             'Accept': 'application/json',
            //                                             'Content-Type': 'application/json',
            //                                         },
            //                                         body: JSON.stringify({
            //                                             user: responseJson[0].email,
            //                                             subject: 'Someone commmented on an idea you follow',
            //                                             message: "Hey, someone just commented on an idea you follow!",
            //                                             title: this.props.title,
            //                                             type: "Comment",
            //                                             content: comment
            //                                         })
            //                                     })
            //                                 } catch (err) {
            //                                     console.log(err);
            //                                 }
            //                             }
            //                         }
            //                     } catch (err) {
            //                         console.log(err);
            //                     }
            //                 }
            //             }
            //         }
            //     } else {
            //         alert("Comment must not be empty.");
            //     }
        }
    }

    // handling changes in comment input box
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // increase height of comment input box if necessary
        target.style.height = "auto";
        target.style.height = (target.scrollHeight) + "px";

        this.setState({
            [name]: value
        });
    }

    // behaviour for pressing Enter in comment input box
    handleKeyPress(e) {
        if (e.key === "Enter" && e.ctrlKey) { // ctrl + Enter adds a newline
            document.getElementById("comment-box").value += "\n";
            document.getElementById("comment-box").style.height = "auto";
            document.getElementById("comment-box").style.height = (document.getElementById("comment-box").scrollHeight) + "px";
        } else if (e.key === "Enter") { // regular Enter to submit idea
            e.preventDefault();
            this.handleComment();
        }
    }

    render() {
        let commentTextCount;
        if (document.getElementById("comment-box")) {
            if (document.getElementById("comment-box").style.height > "23px") { // show character count/limit if input box expands to 2+ lines
                commentTextCount = <p className="word-count">{this.state.comment.length + "/" + this.state.commentTextCap}</p>;
            } else {
                commentTextCount = null;
            }
        }

        let comment;
        if (this.props.status) { // only display comment input box on ideas with status live or inReview
            comment = (
                <div className='write-comment-row'>
                    <textarea id="comment-box" className="write-comment" name="comment" placeholder="Write a comment..." rows="1" maxLength={this.state.commentTextCap}
                        value={this.state.comment} onChange={this.handleInputChange.bind(this)} onKeyPress={this.handleKeyPress} />
                    <div>
                        <div className="submit-comment" name="submit-idea-button" onClick={this.handleComment.bind(this)}><SendIcon /></div>
                        {commentTextCount}
                    </div>
                    <Snackbar
                        id='comment-snackbar'
                        anchorOrigin={this.state.successPosition}
                        open={this.state.successOpen}
                        //onRequestClose={this.hideSuccess}
                        onClose={this.hideSuccess}
                        autoHideDuration={3000}
                        snackbarcontentprops={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Your comment was successfully added!</span>}
                    />
                </div>

            );
        }

        return (
            <div>
                {comment}
                <div id="comment-list" style={{ overflowY: 'scroll', maxHeight: "320px", margin: "0px -24px", padding: "0px 24px" }}>
                    {this.renderComments()}
                </div>
            </div>
        );
    }
}