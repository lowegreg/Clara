import React from 'react';
import { NotificationItem } from './NotificationItem';
import './Sidebar.css';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/ChatBubble';
import NotifIcon from '@material-ui/icons/Notifications';
import UserProfile from '../UserProfile';
import CircularProgress from '@material-ui/core/CircularProgress';
import NotifArrow from '@material-ui/icons/ArrowDropUp';
import './Notifications.css'

export class NotificationPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            tabStatus: 0, // 0 or 1 depending on whether or not notifications are open
            unreadNotifs: 0,
            notifs: [],
        };

        this.getNotifCounts = this.getNotifCounts.bind(this);
        this.handleOpenTab = this.handleOpenTab.bind(this);
        this.getNotifCounts();
    }

    componentWillReceiveProps(nextProps) {
        this.getNotifCounts();
        if (this.state.tabStatus === 1) {
            this.getNotifs();
        }
    }

    // get number of unopened notifications
    async getNotifCounts() {
        this.setState({
            unreadNotifs: [],
        });
        // try {
        //     let response = await fetch(UserProfile.getDatabase() + 'notify/getNum/' + UserProfile.getID());
        //     let responseJson = await response.json();
        //     if (response.status >= 200 && response.status < 300) {
        //         let notifs = responseJson[0].unreadNotifications;
        //         if (notifs > 0) document.getElementById('notif-num').classList.add('show');

        //         this.setState({
        //             unreadNotifs: notifs,
        //         });
        //     } else {
        //         let error = responseJson;
        //         throw error;
        //     }
        // } catch (e) {
        //     //this.removeToken();
        //     console.error(e);
        // }
    }

    // backend call to reset number of unopened notifs to zero
    // this does not mark any notifications as "read"
    async markOpened() {
        try {
            fetch(UserProfile.getDatabase() + 'notify/updateNum/' + UserProfile.getID());
        } catch (err) {
            console.log(err);
        }
    }

    // fetch notifs from database
    async getNotifs() {
        try {
            let response = await fetch(UserProfile.getDatabase() + 'notify/getAll/' + UserProfile.getID());;
            let responseJson = await response.json();
            if (response.status >= 200 && response.status < 300) {
                setTimeout(() => this.setState({ loading: false, notifs: responseJson }), 300);
            }
        } catch (err) {
            console.log(err);
        }
    }

    renderNotifs() {
        if (this.state.loading) {
            return <CircularProgress
                size={30}
                style={{ margin: "16px" }}
            />
        } else {
            if (this.state.notifs.length > 0) { // render notifs
                return this.state.notifs.map(notif => {
                    return <NotificationItem key={notif.noteID} noteID={notif.noteID} peopleList={notif.peopleList} content={notif.noteDetails} status={!!+notif.noteStatus}
                        type={notif.noteEvent} date={notif.noteDate} postID={notif.postID} postTitle={notif.title} onDeepDive={this.props.onDeepDive} />;
                });
            } else if (this.state.tabStatus === 1) { // filler text for when there are no notifications
                let noNotifs =
                    <div style={{ padding: "16px" }}>
                        <p style={{ fontSize: "15px", fontStyle: "italic", fontWeight: "300", margin: "0px", }}>No notifications</p>
                    </div>;
                return noNotifs;
            }
        }
    }

    // opening notifications
    handleOpenTab() {
        if (this.state.tabStatus === 0) {
            this.markOpened(); // reset unopened notif count to zero
            this.setState({ unreadNotifs: 0 });
            document.getElementById('notif-num').classList.remove('show');
            this.setState({ loading: true, tabStatus: 1 }); // open notifs
            this.getNotifs();
        } else {
            this.setState({ unreadNotifs: 0 });
            if (document.getElementById('notif-num')) document.getElementById('notif-num').classList.remove('show');
            this.setState({ tabStatus: 0, notifs: [] }); // close notifs
        }
    }

    render() {
        return (
            <div className="notif-main">
                <IconButton onClick={this.handleOpenTab} style={styles.iconButton}>
                    <NotifIcon style={styles.icon} />
                    <div id="notif-num" className="notif-num">{this.state.unreadNotifs}</div>
                </IconButton>

                <div className="notif-popup" style={(this.state.tabStatus) ? null : { opacity: 0 }}>
                    <NotifArrow style={styles.notifArrow} />
                    <div className="notif-list">
                        {this.renderNotifs()}
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    iconButton: {
        color: "white",
        height: 40,
        width: 40,
        margin: 11
    },
    icon: {
        width: 28,
        height: 28,
    },
    notifArrow: {
        color: "white",
        position: "relative",
        right: 0,
        display: "block",
        width: 40,
        height: 40,
        margin: "0 15 -18px auto",
    }
}