import React from 'react';
import './Admin.css';
import AdminListItem from './AdminListItem';
import UserProfile from '../../UserProfile';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Menu from '@material-ui/icons/Menu';

export default class AdminList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ideas: [],
        };

        this.getIdeas(this.props.activeFolder);
        this.filter();
    }

    // refresh (i.e. re-fetch ideas) when the parent updates
    componentWillReceiveProps(nextProps) {
        this.getIdeas(nextProps.activeFolder);
    }

    // fetch ideas based on which folder was selected
    async getIdeas(folder) {
        let status, call, date;
        switch (folder) {
            case 0: call = "admin/GetHotPosts"; break;
            case 1: call = "admin/GetColdPosts"; break;
            case 2: status = "live"; break;
            case 3: status = "inReview"; break;
            case 4: status = "inProgress"; break;
            case 5: status = "Completed"; break;
            case 6: status = "deleted"; break;
            case 7: status = "garaged"; break;
            case 8: status = "notPursued"; break;
            case 9: status = "duplicated"; break;
            case 10: status = "cost"; break;
            case 11: status = "efficiency"; break;
            case 12: status = "insights"; break;
            case 13: status = "ux"; break;
            default: break;
        }

        date = new Date();

        if (folder === 0) {
            call = "admin/GetHotPosts";
            date.setDate(date.getDate() - 7);
        } else if (folder === 1) {
            call = "admin/GetColdPosts";
            date.setDate(date.getDate() - 20);
        } else if (folder >= 2 && folder <= 13) {
            call = "admin/GetPosts";
        }

        try {
            let response = await fetch(UserProfile.getDatabase() + call, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: status,
                    date: date,
                })
            });
            let responseJson = await response.json();

            this.setState({ ideas: responseJson.value ||[]});

        } catch (e) {
            console.log(e);
        }
    }

    renderIdeas() {
        if (this.state.ideas.length===0){
            return
        }
        return this.state.ideas.map((idea) => {
            return <AdminListItem key={idea.postID} postID={idea.postID} focusID={this.props.focusID} title={idea.title} desc={idea.descrip} date={idea.date} rating={idea.rating} score={idea.trendingScore}
                comments={idea.comments} follows={idea.follows} flagged={idea.adminFlag} onFocus={this.props.onFocus} onFlag={this.props.onFlag} />;
        })
    }
    filter = () => {
        this.props.showFilters()
    }
    render() {

        return (
            <div className="admin-list-container">
                <div className="admin-list-toolbar">
                    {/* toolbar does NOT have functionality yet */}
                    <p className="admin-toolbar-button" onClick={this.filter}><Menu />&nbsp;Filters</p>
                    <p className="admin-toolbar-button"><span style={{ color: 'white' }}>Sort by:&nbsp;</span>Recent&nbsp;<ExpandMore /></p>

                </div>
                <div className="admin-list scrollbar" id="style-2">
                    {this.renderIdeas()}
                </div>
            </div>
        );
    }
}