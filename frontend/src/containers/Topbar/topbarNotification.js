import React, { Component } from 'react';
import { Popover, Modal } from 'antd';
import { connect } from 'react-redux';
import IntlMessages from '../../components/utility/intlMessages';
import TopbarDropdownWrapper from './topbarDropdown.style';


class TopbarNotification extends Component {
	constructor(props) {
		super(props);
		this.handleVisibleChange = this.handleVisibleChange.bind(this);
		this.hide = this.hide.bind(this);
		this.state = {
			visible: false,
			notifications: []
		};
	}
	onClick(dataSet, status, reason, id) {
		this.setState({ visible: false })
		var title = dataSet + ' has been ' + status;
		var content;
		if (status === 'rejected') {
			content = 'Reason: ' + reason
			Modal.error({
				title: title,
				content: content,
			});
		} else if (status === 'accepted') {
			content = dataSet + ' is now viewable under the stories tab.'
			Modal.success({
				title: title,
				content: content,
			});
		}
		var headersValue = {
			'Accept': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/x-www-form-urlencoded',
		}
		var formBody = 'id=' + id
		fetch('http://35.182.224.114:3000/updateNotifications', { method: 'POST', headers: headersValue, mode: 'cors', body: formBody })
			.then((response) => response.json())
			.then(responseJson => this.setState({ submited: true }))
			.catch((error) => {
				console.error(error);
			});
		this.getNotifications()
	}
	setNote(notifications) {
		if (notifications === []) {
			this.setState({ notification: [] })
			return;
		}
		var noteArray = [];
		for (var i = 0; i < notifications.length; i++) {
			var properties = notifications[i].subTitle.split('-');
			var newNote = {
				id: notifications[i].id,
				name: 'Data Mapping',
				notification: notifications[i].title,
				title: properties[1],
				status: properties[0],
				reason: properties[2]
			}
			noteArray.push(newNote)
		}
		this.setState({ notifications: noteArray })
	}
	getNotifications() {
		var query = 'http://35.182.224.114:3000/getNotifications?email=' + this.props.profile.email + '&receipt=delivered'
		fetch(query, { method: 'GET', mode: 'cors' })
			.then((response) => response.json())
			.then(responseJson => this.setNote(responseJson.id))
			.catch((error) => {
				console.error(error);
			});
	}
	componentDidMount() {
		this.getNotifications();
	}
	hide() {
		this.setState({ visible: false });
	}
	handleVisibleChange() {
		this.setState({ visible: !this.state.visible });
	}
	viewAll() {
		window.location.href = '/dashboard/user/settings'
	}
	render() {
		const content = (
			<TopbarDropdownWrapper className="topbarNotification">
				<div className="isoDropdownHeader">
					<h3>
						<IntlMessages id="sidebar.notification" />
					</h3>
				</div>
				<div className="isoDropdownBody" >
					{this.state.notifications.map(notification => (
						<a className="isoDropdownListItem" onClick={() => { this.onClick(notification.title, notification.status, notification.reason, notification.id) }} key={notification.id} >
							<h5>{notification.name}</h5>
							<p>{notification.notification}</p>
						</a>
					))}
				</div>
				<a className="isoViewAllBtn" onClick={() => { this.viewAll() }}>
					<IntlMessages id="topbar.viewAll" />
				</a>
			</TopbarDropdownWrapper>
		);
		return (
			<Popover
				content={content}
				trigger="click"
				visible={this.state.visible}
				onVisibleChange={this.handleVisibleChange}
				placement="bottomLeft"
			>
				<div className="isoIconWrapper">
					<i
						className="ion-android-notifications"
					/>
					<span>{this.state.notifications.length}</span>
				</div>
			</Popover>
		);
	}
}

export default connect(state => ({
	...state.App.toJS(),
	profile: state.Auth.get('profile'),
}))(TopbarNotification);
