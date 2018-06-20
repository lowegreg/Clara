import React from 'react';
import './Sidebar.css';
import NewsArticle from './NewsArticle';
import UserProfile from '../UserProfile';
import "typeface-roboto";

class SidebarRight extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            news: [],
        }
        this.getPosts = this.getPosts.bind(this);
        this.handleDeepDive = this.handleDeepDive.bind(this);

        this.getPosts();
    }

    // database call to get the 4 most recent status changes for inProgress
    // and Completed
    async getPosts() {
        try {
            let response = await fetch(UserProfile.getDatabase() + 'postOrder/news', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    empID: ''
                })
            });
            let responseJson = await response.json();
            if (response.status >= 200 && response.status < 300) {
                this.setState({ news: responseJson.value ||[]});
            } else {
                let error = responseJson;
                throw error;
            }
        } catch (e) {
            //this.removeToken();
            console.error(e);
        }
    }

    renderNews() {
        return this.state.news.map(post =>
            <NewsArticle key={post.postID} id={post.postID} title={post.title} author={post.firstName} date={post.date}
                desc={post.descrip} rating={post.rating} like={post.boolVal} status={post.status} onClick={this.handleDeepDive} />
        );
    }

    // pass deep dive function from parent to News Article component
    handleDeepDive(id) {
        this.props.onDeepDive(id);
    }

    // render news articles
    render() {
        return (
            <div>
                <div className='right-sidebar'>
                    <h2 className='sidebar-header'>Recent Updates</h2>
                    <div className="news-container">
                        {this.renderNews()}
                    </div>
                </div>
            </div>
        );
    }
};

export default SidebarRight;