var Reflux = require('reflux');

var EhNotificationsActions = require('../actions/EhNotificationsActions.jsx');

var EhNotificationsStore = Reflux.createStore({
	listenables: [EhNotificationsActions],
	idx: 0,
	store: [],

	readMessage(idx) {
		for (let i in this.store) {
			if (this.store[i].idx == idx) {
				this.store[i].unread = false;
				this.trigger(this.store);
				return true;
			}
		}
		
		return false;
	},

	fetchMessagesCompleted(data) {
		data.forEach((item) => {
			this.store.unshift({
				idx: ++this.idx,
				date: item.date,
				text: item.text,
				important: item.important,
				type: item.type,
				unread: true
			});
		},this);
		this.trigger(this.store);
	},

	fetchMessagesFailed(error) {
		console.error(error);
	}
});

module.exports = EhNotificationsStore;