import React from 'react';
import UserProfile from '../UserProfile';
import './Notifications.css'

export class NotificationItem extends React.Component {
    constructor(props) {
        super(props);

        // background color set to white or blue based on whether or not the notification has been clicked on
        let color = "white";
        if (!this.props.status) {
            color = "rgb(232, 232, 255)";
        }

        let maxNames = 2;
        let list = this.props.peopleList.split(',');
        let newList = list[0];
        for (let i = 1; i < maxNames && i < list.length; i++) {
            newList = newList + ',' + list[i];
        }
        if (list.length > maxNames) {
            newList = newList + ' and ' + (list.length - maxNames) + ' others';
        }
        this.state = {
            list: newList,
            content: this.props.content,
            status: this.props.status,
            color: color,
        }
    }

    // mark notification as read
    async readNotif() {
        try {
            fetch(UserProfile.getDatabase() + 'notify/read' + this.props.type, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    empID: UserProfile.getID(),
                    noteID: this.props.noteID,
                })
            });
        } catch (err) {
            console.log(err);
        }
    }

    getTimeElapsed(date) {
        const postDate = new Date(date);
        const now = new Date();
        const timeElapsed = now - postDate;

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

    // deep diving into a notification
    handleDeepDive(id) {
        this.readNotif(); // mark notif as read
        this.setState({ status: 1, color: "white" }); // display as read
        this.props.onDeepDive(id); // open deep dive
    }

    render() {
        let postTitleArray = this.props.postTitle.split(" ");

        let postTitle = "";
        for (let i = 0; i < 3; i++) {
            if (postTitleArray[i]) postTitle += postTitleArray[i] + " ";
        }
        postTitle = postTitle.trim();
        if (postTitleArray.length > 3) postTitle += "...";

        return (
            <div className="notif" onClick={this.handleDeepDive.bind(this, this.props.postID)} style={{ backgroundColor: this.state.color }}>
                <div>
                    <p className="notif-text">
                        <span>{this.state.list}</span>
                        {' ' + this.state.content + ': "'}
                        <span>{postTitle}</span>".
                    </p>
                </div>
                <p className="notif-timestamp">{this.getTimeElapsed(this.props.date)}</p>
            </div>
        );
    }
}

NotificationItem.defaultProps = {
    content: "No one liked your idea",
}