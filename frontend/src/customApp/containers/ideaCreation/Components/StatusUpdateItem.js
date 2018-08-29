import React from 'react';
import './FocusView.css';

export default class StatusUpdateItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        // let desc;
        // if (this.props.status === "inReview") {
        //     desc = 
        //         <p className="update-desc">
        //             Review message: {this.props.message}
        //         </p>
        // } else if (this.props.status === "inProgress") {
        //     desc = 
        //         <p className="update-desc">
        //             The <span>Committee</span> approved this idea and sent it to the <span>Lab</span> to be implemented.
        //         </p>
        // } else if (this.props.status === "Completed") {
        //     desc = 
        //         <p className="update-desc" style={{ color: "#009d3c", fontWeight: 400 }}>
        //             Implementation of this idea is complete.
        //         </p>
        // } else {

        // }

        let date = new Date(this.props.date);

        return (
            <div className="update-item">
                <p className="update-desc">{this.props.message}</p>
                <p className="update-date">{date.toDateString()}</p>
            </div>
        );
    }
}