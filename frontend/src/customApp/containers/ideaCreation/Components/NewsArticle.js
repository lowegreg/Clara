import React from 'react';
import './Sidebar.css';

class NewsArticle extends React.Component {
    constructor(props) {
        super(props);

        const dateString = this.getTimeElapsed(this.props.date);
        this.state = {
            date: dateString,
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        const target = event.currentTarget;
        const value = target.value;
        this.props.onClick(value);
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

    renderProgressBar() {
        if (this.props.status === 'inProgress' || this.props.status === 'internal' || this.props.status === 'lab') {
            return (
                <div className="progress">
                    <div className="bar-step" style={{ marginRight: '50%' }}>
                        <div className="label-line" />
                    </div>
                    <div className="bar-step" style={{ marginRight: '75%' }}>
                        <div className="label-line" />
                    </div>
                    <div className="bar-inProgress" />
                </div>
            );
        } else if (this.props.status === 'Completed') {
            return (
                <div className="progress">
                    <div className="bar-step" style={{ marginRight: '25%' }}>
                        <div className="label-line" />
                    </div>
                    <div className="bar-step" style={{ marginRight: '50%' }}>
                        <div className="label-line" />
                    </div>
                    <div className="bar-step" style={{ marginRight: '75%' }}>
                        <div className="label-line" />
                    </div>
                    <div className="bar-Complete" />
                </div>
            );
        } else if (this.props.status === 'inReview') {
            return (
                <div className="progress">
                    <div className="bar-step" style={{ marginRight: '75%' }}>
                        <div className="label-line" />
                    </div>
                    <div className="bar-inReview" />
                </div>
            );
        }
    }
    render() {
        return (
            <div>
                <button type="button" className={this.props.status + "-article"} onClick={this.handleClick} name="news-button" id={this.props.id} value={this.props.id}>
                    <div className="article-row sidebar-title">
                        <p>{this.props.title}</p>
                    </div>
                    <div className="article-row article-author">
                        <p>{this.props.author}</p>
                        <p>{this.state.date}</p>
                    </div>
                    <div className="article-row">
                        {this.renderProgressBar()}
                    </div>
                </button>
            </div>
        );
    }
};

export default NewsArticle;