import React from 'react';
import './NewIdea.css';
import SendIcon from '@material-ui/icons/Send';
import UserProfile from '../UserProfile';

import Snackbar from '@material-ui/core/Snackbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button, { ButtonGroup } from '../../../../components/uielements/button';
import { connect } from 'react-redux';
import Progress from '../../../../components/uielements/progress';

import { Row, Col } from 'react-flexbox-grid';
import { Icon } from 'antd';
import { rtl } from '../../../../config/withDirection';
class NewIdea extends React.Component {
    // styling for text on the form
    static regStyle = { color: "black", fontWeight: "300", fontStyle: "normal", fontSize: "14px" }; // one style for word counts, one style for error messages
    static errorStyle = { color: "red", fontWeight: "400", fontStyle: "italic", fontSize: "16px" }; // honestly this was a weird way to do this

    constructor(props) {
        super(props);

        this.state = {
            costPercent: 20,
            efficiencyPercent: 20,
            insightsPercent: 20,
            uxPercent: 20,
            totalPercent: 20,
            title: '',
            description: '',
            titleCap: 100,
            descCap: 600,
            composing: false,
            submissionFormBottomPadding: 10,
            search: [],
            titlePlaceholder: "Have an idea?",
            confirmationOpen: false,
            confirmationPosition: {
                vertical: 'top',
                horizontal: 'center'
            },
            message: "",
            messageStyle: NewIdea.regStyle,
            depOnly: UserProfile.getDepDefault(),
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleHaveAnIdea = this.handleHaveAnIdea.bind(this);
        this.handleCancelIdea = this.handleCancelIdea.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEnterDesc = this.handleEnterDesc.bind(this);
        this.showConfirmation = this.showConfirmation.bind(this);
        this.hideConfirmation = this.hideConfirmation.bind(this);
        this.handleDepChange = this.handleDepChange.bind(this);
    }
    increase = (category) => {
        let percent;

        if (this.state.totalPercent > 0) {
            percent = this.state.totalPercent - 5
            this.setState({ totalPercent: percent });

            switch (category) {
                case 'cost':
                    percent = this.state.costPercent + 5;
                    if (percent > 100) {
                        percent = 100;
                    }
                    this.setState({ costPercent: percent });
                    break;
                case 'efficiency':
                    percent = this.state.efficiencyPercent + 5;
                    if (percent > 100) {
                        percent = 100;
                    }
                    this.setState({ efficiencyPercent: percent });
                    break;
                case 'insights':
                    percent = this.state.insightsPercent + 5;
                    if (percent > 100) {
                        percent = 100;
                    }
                    this.setState({ insightsPercent: percent });
                    break;
                case 'ux':
                    percent = this.state.uxPercent + 5;
                    if (percent > 100) {
                        percent = 100;
                    }
                    this.setState({ uxPercent: percent });
                    break;
                default:
            }
        }
    }
    decline = (category) => {
        const total = this.state.totalPercent
        if (total < 100) {

            let percent;
            switch (category) {
                case 'cost':
                    percent = this.state.costPercent - 5;
                    if (percent < 0) {
                        percent = 0;
                    } else {
                        this.setState({ totalPercent: total + 5 });
                    }
                    this.setState({ costPercent: percent });
                    break;
                case 'efficiency':
                    percent = this.state.efficiencyPercent - 5;
                    if (percent < 0) {
                        percent = 0;
                    } else {
                        this.setState({ totalPercent: total + 5 });
                    }
                    this.setState({ efficiencyPercent: percent });
                    break;
                case 'insights':
                    percent = this.state.insightsPercent - 5;
                    if (percent < 0) {
                        percent = 0;
                    } else {
                        this.setState({ totalPercent: total + 5 });
                    }
                    this.setState({ insightsPercent: percent });
                    break;
                case 'ux':
                    percent = this.state.uxPercent - 5;
                    if (percent < 0) {
                        percent = 0;
                    } else {
                        this.setState({ totalPercent: total + 5 });
                    }
                    this.setState({ uxPercent: percent });
                    break;
                default:
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ message: "" });
    }

    showConfirmation() {
        this.setState({ confirmationOpen: true });
    };

    hideConfirmation() {
        this.setState({ confirmationOpen: false });
    };

    // expand form when entering title box
    handleHaveAnIdea() {
        // this.initSearch();
        this.setState({
            // change placeholder text to be more informative
            composing: true, submissionFormBottomPadding: 50, titlePlaceholder: "Enter a short title for your idea",
            // set message text as character count for title
            message: "Title: " + this.state.title.length + "/" + this.state.titleCap, messageStyle: NewIdea.regStyle
        });

    }

    // handling for shrinking the form back down on exit
    handleCancelIdea(e) {
        var currentTarget = e.currentTarget;

        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) { // only exit if clicking outside of the form
                if (!document.getElementById("deepDive")) { // don't exit while in deep dive

                    if (document.getElementById("descBox")) { // don't exit if the description box has content in it
                        if (document.getElementById("descBox").value === "") {
                            // exit, reset placeholder and message
                            this.setState({ composing: false, submissionFormBottomPadding: 10, titlePlaceholder: "Have an idea?", message: "" });
                        }
                    }
                }
            }
        }, 0);
    }

    // when entering description
    handleEnterDesc() {
        // set message text as character count for description
        this.setState({ message: "Description: " + this.state.description.length + "/" + this.state.descCap, messageStyle: NewIdea.regStyle });
    }

    // handler for changing title and desc content
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name === 'title') { // if typing in title, show character count for title and display duplicate prevention dropdown
            this.setState({ message: "Title: " + value.length + "/" + this.state.titleCap, messageStyle: NewIdea.regStyle });

        } else if (name === 'description') { // if typing in description, show character count for desc
            this.setState({ message: "Description: " + value.length + "/" + this.state.descCap, messageStyle: NewIdea.regStyle });
        }

        this.setState({
            [name]: value
        });
    }

    // if Enter is pressed, go to description
    handleKeyPress(e) {
        if (e.key === "Enter") {
            document.getElementById("descBox").focus();
        }
    }

    // pressing Esc closes the duplicate prevention dropdown
    handleKeyDown(e) {
        // console.log(e.keyCode);

    }

    // checks and db calls for submitting an idea
    async handleSubmit() {

        if (this.state.title.trim() === '') { // set error message if something is wrong
            this.setState({ message: "Idea has no title.", messageStyle: NewIdea.errorStyle });
        } else if (this.state.description.trim() === '') {
            this.setState({ message: "Idea has no description.", messageStyle: NewIdea.errorStyle });
        } else if (this.props.profile.employeeId === '' || this.props.profile.department === '') {
            this.setState({ message: "Cannot post anonymously, please login.", messageStyle: NewIdea.errorStyle });
        } else if (this.state.totalPercent > 0) {
            this.setState({ message: "Need to distribute all points", messageStyle: NewIdea.errorStyle });
        } else {
            var localDate = new Date();
            localDate.setSeconds(localDate.getSeconds() - 1);
            try {
                fetch(UserProfile.getDatabase() + 'posts', { // post idea
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postID: '',
                        empID: this.props.profile.employeeId,
                        targetDep: this.state.depOnly ? this.props.profile.department : "Innovation",
                        title: this.state.title,
                        descrip: this.state.description,
                        firstName: this.props.profile.firstName,
                        lastName: this.props.profile.lastName,
                        rating: 0,
                        numClicks: 0,
                        numRatings: 0,
                        date: localDate,
                        status: 'live',
                        comments: 0,
                        adminFlag: false,
                        cost: this.state.costPercent,
                        efficiency: this.state.efficiencyPercent,
                        insights: this.state.insightsPercent,
                        ux: this.state.uxPercent
                    })
                }).then((response) => {
                    return response.json();
                    //}).then((parsedData) => {
                    //     try {
                    //         fetch(UserProfile.getDatabase() + 'subscriptions/add', { // follow your newly submitted idea
                    //             method: 'POST',
                    //             headers: {
                    //                 'Accept': 'application/json',
                    //                 'Content-Type': 'application/json',
                    //             },
                    //             body: JSON.stringify({
                    //                 postID: parsedData.insertId,
                    //                 empID: UserProfile.getID(),
                    //             })
                    //         })
                    //     } catch (err) {
                    //         alert(err);
                    //     }
                }).then(() => { // once submitted,
                    this.showConfirmation(); // show confirmation snackbar
                    this.props.tabChange(0, true); // go to recent tab or refresh if already there to see the new idea
                    this.setState({ title: '', description: '', composing: false, submissionFormBottomPadding: 10, costPercent: 20, efficiencyPercent: 20, insightsPercent: 20, uxPercent: 20, total: 20 }); // reset form
                });
            } catch (err) {
                alert(err);
            }
            // try {
            //     fetch(UserProfile.getDatabase() + 'subscriptions/add', {
            //         method: 'POST',
            //         headers: {
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({
            //             postID: this.props.id,
            //             empID: UserProfile.getID(),
            //         })
            //     })
            // } catch (err) {
            //     alert(err);
            // }
        }
    }

    // for deep diving into an idea from the duplicate prevention dropdown


    // toggle target department
    handleDepChange(event, checked) {
        this.setState({ depOnly: !this.state.depOnly })
        UserProfile.setDepDefault(checked); // sets default for the user, preserves for the rest of the session
    }

    render() {

        const marginStyle = {
            margin: rtl === 'rtl' ? '0 0 10px 10px' : '0 10px 10px 0',
        };
        let ideaFormTitle; // always render title box
        ideaFormTitle = (
            <div className='title-container'>
                <input type="text" name="title" id="titleBox" autoComplete={'off'} placeholder={this.state.titlePlaceholder} maxLength={this.state.titleCap} onKeyDown={this.handleKeyDown}
                    onFocus={this.handleHaveAnIdea} value={this.state.title} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} />
            </div>
        );

        let ideaFormBody; // render rest of the form conditionally based on whether or not the form is in focus
        if (this.state.composing) {
            ideaFormBody = (
                <div>
                    <div className='description-container'>
                        <p style={{ textAlign: 'left' }}>You get 100 point to destribute between the categories.</p>
                        <Row>
                            <div style={{ width: 400, marginLeft: '16px' }}>
                                <Progress percent={this.state.totalPercent} status='active' />
                            </div>
                            <div>
                                <p style={{ color: 'red', fontWeight: 'bold', marginLeft: '16px' }}>{this.state.pointError}</p>
                            </div>

                        </Row>
                        <Row>
                            <Col md={3} >
                                <div>
                                    <h4 style={{ marginBottom: '16px' }} >Cost  <i className="ion-social-usd" /></h4>

                                    <Progress
                                        type="circle"
                                        percent={this.state.costPercent}
                                        style={marginStyle}
                                        status='active'
                                        width={110}

                                    />

                                    <ButtonGroup>
                                        <Button onClick={() => this.decline('cost')} icon="minus" />
                                        <Button onClick={() => this.increase('cost')} icon="plus" />
                                    </ButtonGroup>

                                </div>
                            </Col>
                            <Col md={3} >
                                {/* <div> */}
                                <h4 style={{ marginBottom: '16px' }}>Efficiency  <i className="ion-speedometer" /></h4>
                                <Progress
                                    type="circle"
                                    percent={this.state.efficiencyPercent}
                                    style={marginStyle}
                                    status='active'
                                    width={110}
                                />
                                <ButtonGroup>
                                    <Button onClick={() => this.decline('efficiency')} icon="minus" />
                                    <Button onClick={() => this.increase('efficiency')} icon="plus" />
                                </ButtonGroup>
                                {/* </div>  */}
                            </Col>
                            <Col md={3} >
                                {/* <div> */}
                                <h4 style={{ marginBottom: '16px' }}>Insights  <i className="ion-android-bulb" /></h4>
                                <Progress
                                    type="circle"
                                    percent={this.state.insightsPercent}
                                    style={marginStyle}
                                    status='active'
                                    width={110}
                                />
                                <ButtonGroup>
                                    <Button onClick={() => this.decline('insights')} icon="minus" />
                                    <Button onClick={() => this.increase('insights')} icon="plus" />
                                </ButtonGroup>
                                {/* </div>  */}
                            </Col>
                            <Col md={3} >
                                {/* <div> */}
                                <h4 style={{ marginBottom: '16px' }}>UX   <Icon type="user" /></h4>
                                <Progress
                                    type="circle"
                                    percent={this.state.uxPercent}
                                    style={marginStyle}
                                    status='active'
                                    width={110}
                                />
                                <ButtonGroup >
                                    <Button onClick={() => this.decline('ux')} icon="minus" />
                                    <Button onClick={() => this.increase('ux')} icon="plus" />
                                </ButtonGroup>
                                {/* </div>  */}
                            </Col>


                        </Row>
                    </div>
                    <div className='description-container'>
                        <textarea name="description" id="descBox" cols="40" rows="4" placeholder="Describe your idea..." maxLength={this.state.descCap}
                            value={this.state.description} onChange={this.handleInputChange} onFocus={this.handleEnterDesc}></textarea>
                    </div>
                    <div className='button-container'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.depOnly}
                                    onChange={this.handleDepChange}
                                    disableRipple={true}
                                    style={{ height: 12, margin: "0px" }}
                                />}
                            label={<span style={{ margin: "0px 0px 0px -8px", padding: "0px", fontWeight: 300, fontSize: 14 }}>{this.props.profile.department} Cluster only</span>}
                            style={{ margin: "0px", padding: "0px" }}
                        />
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <p className="form-message" style={this.state.messageStyle}>{this.state.message}</p>
                            <button type="button" name="submit-idea-button" className="submit-idea" onClick={this.handleSubmit}>SUBMIT<SendIcon style={{ height: 16, marginLeft: 8 }} /></button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className='new-idea-container' tabIndex="1" onBlur={this.handleCancelIdea}>
                {ideaFormTitle}
                {ideaFormBody}
                <Snackbar
                    id='idea-snackbar'
                    anchorOrigin={this.state.confirmationPosition}
                    open={this.state.confirmationOpen}
                    ////onRequestClose={this.hideConfirmation}
                    autoHideDuration={4000}
                    onClose={this.hideConfirmation}
                    snackbarcontentprops={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Your idea has been posted!</span>}
                />
            </div>
        );
    }
};


export default connect(state => ({
    profile: state.Auth.get('profile'),
}))(NewIdea);