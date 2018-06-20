import React from 'react';
import './ListView.css';
import { IdeaCard } from './IdeaCard';
import UserProfile from '../UserProfile';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import StatusUpdatePopover from './StatusUpdatePopover';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import Lightbulb from '@material-ui/icons/LightbulbOutline';
import { connect } from 'react-redux';
import { Spin } from 'antd';

class ListView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            statuses: ["live", "inReview"],
            sort: "recent",
            sortMenu: false,
            stateTab: this.props.tab,
            posts: [],
            renderMore: false,
            noMore: false,
            //activeFilters: this.props.filters,
            updating: false,
            updateID: -1,
            updateTitle: "",
            updatePrev: "",
            updateNext: "",
        }

        this.getPosts = this.getPosts.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.openUpdatePopover = this.openUpdatePopover.bind(this);
        this.closeUpdatePopover = this.closeUpdatePopover.bind(this);
        this.refresh = this.refresh.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.getPosts(this.state.sort, this.state.statuses);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.explicitRefresh) {
            this.setState({ loading: true, posts: [], renderMore: false, noMore: false });
        }
        if (this.props.filters !== nextProps.filters) { // receiving department filters from parent component
            this.setState({ loading: true, posts: [], renderMore: false, noMore: false });
        }

        // this is meant for tab changes from the nav bar, which has since been removed
        let status;
        switch (nextProps.tab) {
            case 0:
                status = ["live", "inReview"];
                break;
            case 1:
                status = ["internal", "lab"];
                break;
            case 2:
                status = ["Completed"];
                break;
            default:
                break;
        }

        // fetch posts under new tab with new department filters
        this.getPosts((nextProps.tab === 3 ? "me" : this.state.sort), status, nextProps.explicitRefresh || this.props.filters !== nextProps.filters, nextProps.filters);
        this.setState({ stateTab: nextProps.tab, statuses: status });
    }

    componentDidUpdate() {
        if (document.getElementById("list-view-sort-menu")) {
            document.getElementById("list-view-sort-menu").focus();
        }
    }

    // empty idea list, optionally set new sort/statuses, re-fetch posts
    refresh(sort = this.state.sort, statuses = this.state.statuses) {
        this.setState({ sort: sort, statuses: statuses, posts: [], updating: false, loading: true, renderMore: false, noMore: false });
        this.getPosts(sort, statuses, true);
    }

    // get ideas from database
    // each time, the database returns ten unique ideas which are appended to the current idea list
    async getPosts(sort, statuses, refresh = false, departments = this.props.filters) {
        // store all postIDs in an array so that we don't fetch ideas already displayed
        // if doing a refresh, the array is empty
        let postIDs = refresh ? [] : this.state.posts.map(post => post.postID);
        if (this.props.profilePage) { // fetching list for "your ideas"

            try {
                let response = await fetch(UserProfile.getDatabase() + 'postOrder/me', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        empID: this.props.profile.employeeId,
                        ids: postIDs,
                        status: statuses,
                        sort: sort
                    })
                })
                let responseJson = await response.json();
                this.setState({ loading: false})
                // if (response.status >= 200 && response.status < 300) {
                //     try {
                //         let response2 = await fetch(UserProfile.getDatabase() + 'postOrder/follow', {
                //             method: 'POST',
                //             headers: {
                //                 'Accept': 'application/json',
                //                 'Content-Type': 'application/json',
                //             },
                //             body: JSON.stringify({
                //                 empID: this.props.profile.employeeId,
                //                 ids: postIDs,
                //             })
                //         })
                //         let responseJson2 = await response2.json();
                //         if (response2.status >= 200 && response2.status < 300) {
                //             let newPostArray = responseJson.value.concat(responseJson2.value);
                //             newPostArray.sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime() });

                            if (responseJson.value.length > 0) {
                                if (responseJson.value.length < 10) { // if we received fewer than 10 ideas, we know there are no more ideas to fetch
                                    this.setState({ noMore: true });
                                }
                                // add fetched ideas to the list, after a delay of 300ms
                                // the purpose of the delay is to set a lower bound for the duration of the loading wheel
                                // reset renderMore to false

                                setTimeout(() => this.setState({ loading: false, posts: responseJson.value||[], renderMore: false }), 300);
                            } else { // no more ideas to fetch if the response is empty
                                this.setState({ loading: false, noMore: true, renderMore: false });
                            }
                //         } else {
                //             let error = responseJson;
                //             throw error;
                //         }
                //     } catch (e) {
                //         //this.removeToken();
                //         console.error(e);
                //     }
                // } else {
                //     let error = responseJson;
                //     throw error;
                // }
            } catch (e) {
                //this.removeToken();
                console.error(e);
            }
        } else { // regular fetching of ideas
            var dept = new Array();
            if (departments.length === 0) {
                dept[0] = 'none'
            } else if (departments.length < 2) {
                dept[0] = departments[0]
            }

            try {
                let response = await fetch(UserProfile.getDatabase() + 'postOrder/' + sort, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        empID: this.props.profile.employeeId,
                        status: statuses,
                        ids: postIDs,
                        deps: dept,
                        date: null
                    })
                });
                let responseJson = await response.json();
                this.setState({ loading: false})
                if (response.status >= 200 && response.status < 300 && this.state.noMore === false) {
                    if (responseJson.value.length > 0) {
                        if (responseJson.value.length < 10) { // if we received fewer than 10 ideas, we know there are no more ideas to fetch
                            this.setState({ noMore: true });
                        }
                        // add fetched ideas to the list, after a delay of 300ms
                        // the purpose of the delay is to set a lower bound for the duration of the loading wheel
                        // reset renderMore to false
                        setTimeout(() => this.setState({ loading: false, posts: responseJson.value||[], renderMore: false }), 300);
                    } else { // no more ideas to fetch if the response is empty
                        this.setState({ loading: false, noMore: true, renderMore: false });
                    }
                } else {
                    let error = responseJson.value;
                    throw error;
                }
            } catch (e) {
                //this.removeToken();
                console.error(e);
            }
        }
    }

    // opening the popover for status updates: pass along all the necessary information
    openUpdatePopover(postID, postTitle, prevStatus, nextStatus) {
        this.setState({ updating: true, updateID: postID, updateTitle: postTitle, updatePrev: prevStatus, updateNext: nextStatus });
    }

    // close update popover; refresh based on whether or not an update was submitted
    closeUpdatePopover(refresh = false) {
        if (refresh) {
            this.refresh(); // refresh list view with same settings if an update went through
        } else { // no need to refresh if no update was submitted i.e. the popover was simply closed
            this.setState({ updating: false });
        }
    }
    checkIfDeleted(post) {
        if (post === 'deleted' || post.status === 'deleted') {
            return
        }

        return (<IdeaCard key={post.postID} id={post.postID} title={post.title} authorFirst={post.firstName} authorLast={post.lastName} date={post.date}
            follow={!!+post.followVal} targetDep={post.targetDep} desc={post.descrip} rating={post.rating} empID={post.empID} like={!!+post.boolVal} flagged={post.adminFlag}
            status={post.status} numComments={post.comments} tab={this.state.stateTab} tabChange={this.handleTabChange} refresh={this.refresh} onDeepDive={this.props.onDeepDive} onUpdate={this.openUpdatePopover} />)
    }

    // render idea cards
    // show loading wheel if still fetching
    // show some filler/explanation text when the idea list is empty
    renderPosts() {
        if (this.state.loading) { // loading wheel
            return <div style={{ margin: "16px" }}><Spin size="large"   />	</div>
        } else {
            if (this.state.posts.length > 0) {
                return this.state.posts.map(post =>

                    this.checkIfDeleted(post)
                );
            } else {
                let empty;
                if (this.props.filters.length === 0) {
                    empty =
                        <div style={styles.emptyDiv}>
                            <h1 style={styles.emptyHeader}>No Ideas</h1>
                            <p style={styles.emptyText}>No filters are active. Select a department to see posts.</p>
                        </div>;
                } else {
                    empty =
                        <div style={styles.emptyDiv}>
                            <h1 style={styles.emptyHeader}>No Ideas</h1>
                            <p style={styles.emptyText}>Looks like this section is empty. Post an idea to get it started!</p>
                        </div>;
                }
                return empty;
            }

        }
    }

    // handling for status checkboxes
    toggleStatus(status) {
        let newStatuses;
        if (this.state.statuses.indexOf(status) === -1) {
            newStatuses = this.state.statuses.concat([status]);
        } else {
            newStatuses = this.state.statuses.filter((s) => s !== status);
        }
        this.refresh(this.state.sort, newStatuses); // refresh with new status array
    }

    // fetch more posts from the database if you scroll through 80% of the page
    handleScroll() {
        let scrollRatio = document.scrollingElement.scrollTop / (document.body.clientHeight - window.innerHeight);
        // fetch more posts if:
        //     scroll position reaches 80% down the page
        //     we aren't already fetching more
        //     there are still posts to fetch
        if (scrollRatio > 0.8 && !this.state.renderMore && !this.state.noMore) {
            this.setState({ renderMore: true }); // renderMore conditional so that we only fetch once at a time
            this.getPosts(this.state.sort, this.state.statuses);
        }
    }

    // handling for changing sort order
    handleSortChange(sort) {
        this.setState({ sortMenu: false });
        this.refresh(sort, this.state.statuses); // refresh with new sort
    }

    // handling for tab switches within ListView
    handleTabChange(tab) {
        if (this.state.stateTab !== 3) {
            if (!this.state.loading) { // don't change tab if we're already trying to load one
                let statuses;
                switch (tab) { // default statuses for each tab
                    case 0: statuses = ["live", "inReview"]; break;
                    case 1: statuses = ["internal", "lab"]; break;
                    case 2: statuses = ["Completed"]; break;
                    default: statuses = ["live", "inReview"];
                }
                this.setState({ stateTab: tab });
                this.refresh(this.state.sort, statuses); // refresh with new status array
            }
        }
    }

    render() {
        let popover;
        if (this.state.updating) {
            popover = <StatusUpdatePopover postID={this.state.updateID} title={this.state.updateTitle}
                prevStatus={this.state.updatePrev} nextStatus={this.state.updateNext} onClose={this.closeUpdatePopover} />
        }

        let loading; // loading wheel for renderMore only if there isn't already one for loading
        if (this.state.renderMore && !this.state.loading) {
            loading = <CircularProgress
                size={40}
                style={{ margin: "16px" }}
            />;
        }

        let sort;
        switch (this.state.sort) {
            case "recent": sort = "Date Posted"; break;
            case "latest": sort = "Last Updated"; break;
            case "highRating": sort = "Popularity"; break;
            default: break;
        }

        let sortMenu;
        if (this.state.sortMenu) {
            sortMenu =
                <div id="list-view-sort-menu" className="list-view-sort-menu" tabIndex="5" onBlur={() => this.setState({ sortMenu: false })}>
                    <p onClick={() => this.handleSortChange("recent")}>Date Posted</p>
                    <p onClick={() => this.handleSortChange("latest")}>Last Updated</p>
                    <p onClick={() => this.handleSortChange("highRating")}>Popularity</p>
                </div>;
        }

        // status filter checkboxes for "open" and "assigned" tabs
        // WET implementation, could be improved
        let secondaryControl;
        if (this.state.stateTab === 0) {
            secondaryControl =
                <div className="list-view-secondary-control">
                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.statuses.indexOf("live") !== -1}
                            onChange={() => this.toggleStatus("live")}
                            disableRipple
                            style={styles.checkbox}
                        />}
                        label={<span style={{ margin: "0px 0px 0px -8px", padding: "0px", fontWeight: 300, fontSize: 14 }}>Live</span>}
                        style={styles.checkboxContainer}
                    />
                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.statuses.indexOf("inReview") !== -1}
                            onChange={() => this.toggleStatus("inReview")}
                            disableRipple
                            style={styles.checkbox}
                        />}
                        label={<span style={{ margin: "0px 0px 0px -8px", padding: "0px", fontWeight: 300, fontSize: 14 }}>In Review</span>}
                        style={styles.checkboxContainer}
                    />
                </div>
        } else if (this.state.stateTab === 1) {
            secondaryControl =
                <div className="list-view-secondary-control">
                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.statuses.indexOf("internal") !== -1}
                            onChange={() => this.toggleStatus("internal")}
                            disableRipple
                            style={styles.checkbox}
                        />}
                        label={<span style={{ margin: "0px 0px 0px -8px", padding: "0px", fontWeight: 300, fontSize: 14 }}>Internal </span>}
                        style={styles.checkboxContainer}
                    />
                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.statuses.indexOf("lab") !== -1}
                            onChange={() => this.toggleStatus("lab")}
                            disableRipple
                            style={styles.checkbox}
                        />}
                        label={<span style={{ margin: "0px 0px 0px -8px", padding: "0px", fontWeight: 300, fontSize: 14 }}>Lab</span>}
                        style={styles.checkboxContainer}
                    />
                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.statuses.indexOf("garaged") !== -1}
                            onChange={() => this.toggleStatus("garaged")}
                            disableRipple
                            style={styles.checkbox}
                        />}
                        label={<span style={{ margin: "0px 0px 0px -8px", padding: "0px", fontWeight: 300, fontSize: 14 }}>Garaged</span>}
                        style={styles.checkboxContainer}
                    />
                    <FormControlLabel
                        control={<Checkbox
                            checked={this.state.statuses.indexOf("notPursued") !== -1}
                            onChange={() => this.toggleStatus("notPursued")}
                            disableRipple
                            style={styles.checkbox}
                        />}
                        label={<span style={{ margin: "0px 0px 0px -8px", padding: "0px", fontWeight: 300, fontSize: 14 }}>Not Pursued</span>}
                        style={styles.checkboxContainer}
                    />
                </div>
        }

        return (

            <div className="list-view" onScroll={this.handleScroll}>
                {popover}
                {/* fade out list view control when viewing your own ideas */}
                <div className={"list-view-control " + ((this.state.stateTab === 0 || this.state.stateTab === 1) ? "secondary " : "") + (this.state.stateTab === 3 ? "lvc-disabled" : "")}>
                    <div className="list-view-tabs">
                        <p className={"list-view-tab-" + Boolean(this.state.stateTab === 0).toString()} onClick={() => this.handleTabChange(0)}>
                            <Lightbulb style={{ height: 20, width: 20, color: "rgb(231, 111, 133)" }} />&nbsp;&nbsp;Open
                        </p>
                        <p className={"list-view-tab-" + Boolean(this.state.stateTab === 1).toString()} onClick={() => this.handleTabChange(1)}>
                            <Lightbulb style={{ height: 20, width: 20, color: "orange" }} />&nbsp;&nbsp;Assigned
                        </p>
                        <p className={"list-view-tab-" + Boolean(this.state.stateTab === 2).toString()} onClick={() => this.handleTabChange(2)}>
                            <Lightbulb style={{ height: 20, width: 20, color: "#009d3c" }} />&nbsp;&nbsp;Completed
                        </p>
                    </div>
                    <p className="list-view-sort">Sort by:&nbsp;&nbsp;<span onClick={() => this.setState({ sortMenu: !this.state.sortMenu })}>{sort} <ExpandIcon style={{ height: 21 }} /></span></p>
                    {sortMenu}
                </div>
                {secondaryControl}
                {this.renderPosts()}
                {loading}
            </div>
        );
    }
}

const styles = {
    emptyDiv: {
        margin: "16px",
    },
    emptyHeader: {
        margin: "8px 0px",
        fontStyle: "italic",
        fontWeight: "400",
        fontSize: "24",
    },
    emptyText: {
        fontSize: "18px",
        fontStyle: "italic",
        fontWeight: "300",
        margin: "0px",
    },
    checkboxContainer: {
        marginRight: 32,
    },
    checkbox: {
        color: "#4482ff",
    }
}

export default connect(state => ({
    profile: state.Auth.get('profile'),
}))(ListView);