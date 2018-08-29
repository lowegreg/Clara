import React from 'react';
import './Admin.css';
import UserProfile from '../../UserProfile';
import LikeIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/ChatBubble';
import NotifIcon from '@material-ui/icons/Notifications';
import StarIcon from '@material-ui/icons/Star';

export default class AdminListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            flagged: Boolean(this.props.flagged),
        }

        this.handleFocus = this.handleFocus.bind(this);
        this.handleFlag = this.handleFlag.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.flagged !== this.props.flagged) {
            this.setState({ flagged: Boolean(nextProps.flagged) });
        }
    }

    handleFocus() {
        this.props.onFocus(this.props.postID);
    }

    // flagging an idea
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
                // tell parent the idea has been flagged
                // if the idea is open in AdminFocus, then the flag status will update there too
                this.props.onFlag(this.props.postID);

                this.setState({ flagged: !this.state.flagged });
            })
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        let active = ""; // highlight list item if it's open in AdminFocus
        if (this.props.postID === this.props.focusID) {
            active = "admin-list-item-active";
        }

        let date = new Date(this.props.date);
        let month;
        switch(date.getMonth()) {
            case 0: month = "Jan "; break;
            case 1: month = "Feb "; break;
            case 2: month = "Mar "; break;
            case 3: month = "Apr "; break;
            case 4: month = "May "; break;
            case 5: month = "Jun "; break;
            case 6: month = "Jul "; break;
            case 7: month = "Aug "; break;
            case 8: month = "Sep "; break;
            case 9: month = "Oct "; break;
            case 10: month = "Nov "; break;
            case 11: month = "Dec "; break;
            default: break;
        }
        let date2 = month + date.getDate() + "/" + date.getFullYear();

        return (
            <div className={"admin-list-item " + active} onClick={this.handleFocus}>
                <div className="admin-item-row">
                    <p className="admin-item-title">{this.props.title}</p>
                    <StarIcon id={"list-flag-" + this.props.postID} className={"admin-item-flag-" + this.state.flagged.toString()} onClick={this.handleFlag} />
                </div>
                <div className="admin-item-row">
                    <p className="admin-item-desc">{this.props.desc}</p>
                    <p className="admin-item-desc">{this.props.score}</p>
                </div>
                <div className="admin-item-row">
                    <div className="admin-item-interactions">
                        <div className="admin-item-interaction">
                            <LikeIcon style={{ height: 20 }} />
                            <p>{this.props.rating}</p>
                        </div>
                        <div className="admin-item-interaction">
                            <CommentIcon style={{ height: 20 }} />
                            <p>{this.props.comments}</p>
                        </div>
                        <div className="admin-item-interaction">
                            <NotifIcon style={{ height: 20 }} />
                            <p>{this.props.follows}</p>
                        </div>
                    </div>
                    <p className="admin-item-date">{date2}</p>
                </div>
            </div>
        );
    }
}