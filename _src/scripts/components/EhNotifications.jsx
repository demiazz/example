var React = require('react');

var EhNotificationsMessage = require('./EhNotificationsMessage.jsx');

var EhNotifications = React.createClass({
	
	propTypes: {
		onReadMessage: React.PropTypes.func, //callback when message marks as read
		onNavigateToHistory: React.PropTypes.func, //callback when history button clicked
		showHistory: React.PropTypes.bool, //toggle history view
		historyLen: React.PropTypes.number //how many messages show in history
	},

	getDefaultProps() {
		return {
			onReadMessage: null,
			onNavigateToHistory: null,
			showHistory: false,
			historyLen: 5
		};
	},

	getInitialState() {
		return {
			
		};
	},

	render() {
		if (this.props.store == null) {
			return false;
		} else {
			var importantUnreadLen = (this.props.store != null) ? (this.props.store.reduce((sum, item) => { return (item.important && item.unread)?(sum + 1):sum; }, 0)) : 0;
			
			if (this.props.showHistory) {
				return (
					<div className="eh-notifications">
						<div className="eh-notifications-group _history">
							{this.props.store.filter((item) => { return (item.important && item.unread); }).slice(0,this.props.historyLen).map((message, i) => {
								return (
									<EhNotificationsMessage key={message.idx} text={message.text} type={message.type} date={message.date} canHide={false}
										onRead={this.onReadMessage.bind(this,message.idx)} />
								);
							}, this)}
							<div className="eh-notifications-link" onClick={this.props.onNavigateToHistory}>История уведомлений</div>
						</div>
					</div>
				);
			} else {
				return (
					<div className="eh-notifications">
						{this.props.store.filter((item) => { return (!item.important && item.unread); }).map((message, i) => {
							return (
								<EhNotificationsMessage key={message.idx} text={message.text} autoHide={true} 
									onRead={this.onReadMessage.bind(this,message.idx)} />
							);
						}, this)}
						{(() => {
							if (importantUnreadLen > 0) {
								return (
									<div className={'eh-notifications-group'+((importantUnreadLen>1)?' _count':'')}>
										{this.props.store.filter((item) => { return (item.important && item.unread); }).slice(0,1).map((message, i) => {
											return (
												<EhNotificationsMessage key={message.idx} text={message.text} type={message.type} nextCount={importantUnreadLen} autoHide={false} 
													onRead={this.onReadMessage.bind(this,message.idx)} />
											);
										}, this)}
									</div>
								);
							}
						})()}
					</div>
				);
			}
		}
	},

	onReadMessage(idx) {
		if (this.props.onReadMessage != null) this.props.onReadMessage(idx);
	}
});

module.exports = EhNotifications;