var React = require('react');

var EhNotificationsMessage = React.createClass({
	propTypes: {
		canHide: React.PropTypes.bool.isRequired, //show close button. If false messages will mark as read on unmount
		autoHide: React.PropTypes.bool.isRequired, //auto hide
		text: React.PropTypes.string.isRequired,
		type: React.PropTypes.number, //optional type number for class name
		date: React.PropTypes.string, //date for history
		nextCount: React.PropTypes.number //for important messages to show arrow and how many messages left
	},

	getDefaultProps() {
		return {
			canHide: true,
			autoHide: false,
			text: '',
			type: 0,
			date: '',
			nextCount: 0
		};
	},

	getInitialState() {
		return {
			active: true,
			visible: false,
			height: 0
		};
	},

	componentDidMount() {
		this.mounted = true;

		this.setState({
			visible: true,
			height: React.findDOMNode(this.refs['con']).offsetHeight
		});

		if (this.props.autoHide) setTimeout(this.hide, 10000);
	},

	componentWillUnmount() {
		if (!this.props.canHide) this.props.onRead();

		this.mounted = false;
	},

	render() {
		if (this.state.active) {
			var date = false;
			if (this.props.date != '') {
				date = (<time>{this.props.date}</time>);
			}
			var button = false;
			if (this.props.canHide) {
				button = (<span className={'eh-notifications-button'+((this.props.nextCount > 1)?' _count':'')} onClick={this.hide}>{(this.props.nextCount > 1)?('1/'+this.props.nextCount):''}</span>);
			}
			return (
				<div className={'eh-notifications-message'+(this.state.visible?' _visible':'')+((this.props.type != 0)?(' _type'+this.props.type):'')} 
					style={{height: this.state.height+'px'}}>
					<div ref="con" style={(this.state.height != 0)?{height: '100%'}:{}}>
						<span className="eh-notifications-message-icon"></span>
						<span className="eh-notifications-message-text">{this.props.text}{date}</span>
						{button}
					</div>
				</div>
			);
		} else {
			return false;
		}
	},

	hide() {
		if (!this.mounted || !this.state.active || !this.state.visible) return;

		this.setState({
			visible: false,
			height: 0
		});
		
		setTimeout(this.deactivate, (this.props.nextCount > 1)?0:500);
	},

	deactivate() {
		if (!this.mounted || !this.state.active) return;

		this.setState({active: false});
		this.props.onRead();
	}
});

module.exports = EhNotificationsMessage;