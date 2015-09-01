var React = require('react');
var Reflux = require('reflux');

var EhNotifications = require('./components/EhNotifications.jsx');
var EhNotificationsActions = require('./actions/EhNotificationsActions.jsx');
var EhNotificationsStore = require('./stores/EhNotificationsStore.jsx');

var App = React.createClass({
	mixins: [Reflux.connect(EhNotificationsStore, 'notificationsStore')],

	getDefaultProps() {
		return {
			notificationsUrl: ''
		};
	},

	getInitialState() {
		return {
			notificationsStore: null,
			showHistory: false
		};
	},

	componentDidMount() {
		if (this.props.notificationsUrl != '') {
			EhNotificationsActions.fetchMessages(this.props.notificationsUrl); 

			setInterval(() => {
				EhNotificationsActions.fetchMessages(this.props.notificationsUrl); 
			}, 30000);
		}
	},

	render() {
		var importantUnreadLen = (this.state.notificationsStore != null) ? (this.state.notificationsStore.reduce((sum, item) => { return (item.important && item.unread)?(sum + 1):sum; }, 0)) : 0;

		return (
			<header className="header">
				<EhNotifications store={this.state.notificationsStore} showHistory={this.state.showHistory} 
					onReadMessage={this.onReadMessage} onNavigateToHistory={this.onNavigateToHistory} />
				<div className={'counter'+((this.state.showHistory || importantUnreadLen > 0)?' _active':'')+(this.state.showHistory?' _history':'')} 
					onClick={(this.state.showHistory || importantUnreadLen > 0)?this.toggleHistory:false}>
					<span>{(importantUnreadLen > 99)?'99+':importantUnreadLen}</span>
				</div>
			</header>
		);
	},

	toggleHistory() {
		this.setState({
			showHistory: !this.state.showHistory
		});
	},

	onReadMessage(idx) {
		//mark message as read
		EhNotificationsActions.readMessage(idx);
	},

	onNavigateToHistory() {
		
	}
});

React.render(
	<App notificationsUrl={document.getElementById('app').getAttribute('data-url')} />,
	document.getElementById('app')
);