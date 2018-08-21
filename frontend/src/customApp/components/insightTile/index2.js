import React, { Component } from 'react';
import Card from '../../../containers/Uielements/Card/card.style';
import Button from '../../../components/uielements/button';
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';
import PinButton from './pinButton';
import Chart from './chart';
import { Modal } from 'antd';
const { updateUser } = authAction;

export class Tile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hover: false,
            dashboards: this.props.profile.dashboards,
            visible: false,
            confirmLoading: false,
            savePinPopup: false,
            dashboardIndex: 0,
            type: this.props.type,
            tileVisibility: true,
            popUpvisible: false

        };

    }
    mouseOver() {
        this.setState({ hover: true });
    }
    mouseOut() {
        this.setState({ hover: false });
    }
    // removes pins from a dashboard, by editing the tile section
    removePin = () => {
        this.setState({
            tileVisibility: false
        })
        var tileList;
        const tileIndex = this.props.tileIndex;
        var dashboard = this.props.dashboard;
        tileList = dashboard.tiles;
        var dashboardIndex = this.state.dashboards.indexOf(dashboard)
        if (typeof tileList === 'string') {
            tileList = JSON.parse(tileList)
        }
        var newTileList = [];
        for (let i = 0; i < tileList.length; i++) {
            (i !== tileIndex) && newTileList.push(tileList[i]);
        }

        fetch(`http://35.182.255.76/dashboard/${dashboard._id}`, {
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.props.jwt}`
            },
            method: "PUT",
            body: `tiles=${JSON.stringify(newTileList)}`,
        })
            .then((response) => response.json())
            .then(responseJson => {
                if (responseJson.n === 1 && responseJson.nModified === 1 && responseJson.ok === 1) {
                    var newDashboards = this.state.dashboards
                    newDashboards[dashboardIndex].tiles = newTileList;
                    this.setState({ dashboard: newDashboards })
                    this.props.updateUser()
                    this.props.updateDash(newTileList, dashboardIndex);
                }
            })
            .catch((error) => {
                // displays server error
                console.log(error);
            })
    }
    // determines which type of button (and functionality) to an insight tile based on where it is being rendered
    renderType = () => {
        if (this.props.type !== 'dash') {
            return (
                <PinButton table={this.props.table} updateDash={this.props.updateDash} updateUser={this.props.updateUser} />
            )
        } else {
            return (
                <Button icon="close" type="button" onClick={this.removePin} ghost />
            )
        }
    }
    componentWillUnmount() {
        this.setState({
            visible: false,
            confirmLoading: false,
            title: '',
            error: 0,
            savePinPopup: false,
            dashboardIndex: 0,
            type: this.props.type,
            tileVisibility: true
        })
    }

    close() {
        this.setState({
            popUpvisible: !this.state.popUpvisible
        })
    }
    popUP() {
        if (this.state.popUpvisible) {
            if (this.props.table.graph === 'multiBar' && this.props.table.options.xAxis[0].data.length < 30) {
                this.props.table.options.xAxis[0].axisLabel.interval = 0
            } else if (this.props.table.graph === 'multiBar' && this.props.table.options.xAxis[0].data.length > 30 && this.props.table.options.xAxis[0].data.length < 100) {
                this.props.table.options.xAxis[0].axisLabel.interval = 1
            } else if (this.props.table.graph === 'multiBar' && this.props.table.options.xAxis[0].data.length > 100) {
                this.props.table.options.xAxis[0].axisLabel.interval = 5
            }
        }

        return (
            <Modal
                title="Deep Dive"
                visible={this.state.popUpvisible}
                onCancel={this.close.bind(this)}
                maskClosable={true}
                width={'90%'}
                closable={true}
                bodyStyle={{ height: '100%' }}
                footer={[]}
            >
                <Card
                    title={(this.props.type !== 'dash') ? this.props.table.title : `${this.props.table.tableName}: ${this.props.table.title}`}
                    bordered={true}
                    extra={
                        <PinButton table={this.props.table} updateDash={this.props.updateDash} updateUser={this.props.updateUser} />
                    }
                >
                    <Chart table={this.props.table} eChartStyle={{ width: '100%', height: 480 }} />
                </Card>
            </Modal>
        )
    }
    render() {
        return (
            <Card
                title={(this.props.type !== 'dash') ? this.props.table.title : `${this.props.table.tableName}: ${this.props.table.title}`}
                bordered={true}
                extra={
                    this.renderType()
                }
            >
                {this.popUP()}
                <div onClick={() => { this.setState({ popUpvisible: !this.state.popUpvisible }) }} >
                    <Chart table={this.props.table} />
                </div>
            </Card>
        );
    }
}
export default connect(
    state => ({
        profile: state.Auth.get('profile'),
        jwt: state.Auth.get('idToken')
    }),
    { updateUser }
)(Tile);