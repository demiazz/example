var Reflux = require('reflux');

var EhNotificationsActions = Reflux.createActions({
	'fetchMessages': { children: ['completed', 'failed'] },
	'readMessage': {}
});

EhNotificationsActions.fetchMessages.listen(function(url) {

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);

	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) return;
		if (xhr.status == 200) {
			this.completed(JSON.parse(xhr.responseText));
		} else {
			this.failed('Server error: '+xhr.status+' '+xhr.statusText);
		}
	}.bind(this);
	xhr.onerror = function() {
		this.failed('Network error');
	}.bind(this);
	xhr.send();
	
});

EhNotificationsActions.readMessage.listen(function(idx) {
	//post data to mark message as read
});

module.exports = EhNotificationsActions;