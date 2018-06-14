import React from 'react';
import './Sidebar.css';
import Active from './Active.png';
import inActive from './inActive.png';
import "typeface-roboto";
import "typeface-lato";
import MyLatestIdeaCard from './MyLatestIdeaCard';
import UserProfile from '../UserProfile';
import { connect } from 'react-redux';

class SidebarLeft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departments: this.props.departments,
            filters: ['Innovation', this.props.profile.department],
            activeFilter: this.props.filters,
            myPosts: []
        }
        this.getMyPosts();
    }

    // database call to get the two most recently updated posts for the current user
    async getMyPosts() {
        try {
            let response = await fetch(UserProfile.getDatabase() + 'postOrder/meLatest', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    empID: this.props.profile.employeeId
                })
            })
            let responseJson = await response.json();
            if (responseJson.value.length > 0) {
                this.setState({ myPosts: responseJson.value });
            }
        } catch (err) {
            console.log(err);
        }
    }

    renderMyPosts() {
        if (this.state.myPosts.length > 0) {
            return this.state.myPosts.map(post =>
                <MyLatestIdeaCard key={post.postID} id={post.postID} title={post.title} authorFirst={post.firstName} authorLast={post.lastName} date={post.date}
                    follow={!!+post.followVal} targetDep={post.targetDep} desc={post.descrip} rating={post.rating} empID={post.empID} like={!!+post.boolVal} flagged={post.adminFlag}
                    status={post.status} numComments={post.comments} tab={this.state.stateTab} tabChange={this.props.tabChange} onDeepDive={this.props.onDeepDive} onUpdate={this.openUpdatePopover} />
            );
        } else {
            return null;
        }
    }

    // filtering function to switch between looking at company wide internal posts and the users 
    // own cluster
    handleClick(event) {
        const target = event.currentTarget;
        const value = target.value;
        var img = document.getElementById(value);
        if (this.state.departments) {
            if (img.src === Active) {
                img.src = inActive;
                let arrayWithout = this.state.activeFilter.slice();
                if (value !== 'Innovation') {
                    let allImg = document.getElementById('Innovation');
                    if (allImg.src === Active) {
                        allImg.src = inActive;
                        arrayWithout = arrayWithout.filter(function (arrVal) { return arrVal !== 'Innovation' });
                    }
                } else if (value === 'Innovation') {
                    for (let i = 0; i < this.state.filters.length; i++) {
                        let img = document.getElementById(this.state.filters[i]);
                        img.src = inActive;
                        arrayWithout = [];
                    }
                } arrayWithout = arrayWithout.filter(function (arrVal) { return arrVal !== value });
                this.props.handleFilters(arrayWithout);
                this.setState({ activeFilter: arrayWithout });
            } else {
                img.src = Active;
                let arrayWithout = this.state.activeFilter.slice();
                if (value === 'Innovation') {
                    for (let i = 0; i < this.state.filters.length; i++) {
                        let img = document.getElementById(this.state.filters[i]);
                        img.src = Active;
                    }
                    this.props.handleFilters(this.state.filters);
                    this.setState({ activeFilter: this.state.filters });
                } else {
                    let allImg = document.getElementById('Innovation');
                    if (allImg.src === Active) {
                        allImg.src = inActive;
                        arrayWithout = arrayWithout.filter(function (arrVal) { return arrVal !== 'Innovation' });
                    }
                    arrayWithout.push(value);
                    this.props.handleFilters(arrayWithout);
                    this.setState({ activeFilter: arrayWithout });
                }
            }
        }
    }

    // render the side bar, displaying internal wide posts and the users 
    // own cluster, as well as render 2 most recently updated posts
    render() {
        let dep = this.props.profile.department;
        return (
            <div>
                <div className='left-sidebar'>
                    <h2 className='sidebar-header'>Departments</h2>
                    <div className="filters-container">
                        <button type="button" onClick={this.handleClick.bind(this)} name="all-dep-button" id="all-dep" value="Innovation">
                            <div className="filter-row">
                                <p>Internal (All Clusters)</p>
                                <img className="filter-img" alt="no img" name="all-img" id="Innovation" src={Active} />
                            </div>
                        </button>

                        <button type="button" onClick={this.handleClick.bind(this)} name="it-dep-button" id="it-dep" value={dep}>
                            <div className="filter-row">
                                <p>{dep} Cluster</p>
                                <img className="filter-img" alt="no img" id={dep} src={Active} />
                            </div>
                        </button>
                    </div>
                </div>
                <div className='left-sidebar'>
                    <h2 className='sidebar-header'>My Recent Updates</h2>
                    {this.renderMyPosts()}
                </div>
            </div>
        );
    }
}


export default connect(
    state => ({
        profile: state.Auth.get('profile'),
    }),
)(SidebarLeft);
