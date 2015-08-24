'use strict';

import Dispatcher from './../dispatcher/Dispatcher';
import Basic from './Basic';

class Background extends Basic {
	constructor(alias, props={}) {
		return super('background',alias,props);
	}

	getDefaultProps() {
		return {
			src: null
		};
	}

	getInitialState() {
		return {
			binded: false,
			visible: false,
			loaded: false
		};
	}

	render() {
		this.listeners.onResizeEnd = this.onResizeEnd.bind(this);
	}

	bind() {
		if (this.state.binded) return;
		this.state.binded = true;
		Dispatcher.subscribe('window:resizeEnd', this.listeners.onResizeEnd);
	}

	unbind() {
		if (!this.state.binded) return;
		this.state.binded = false;
		Dispatcher.unsubscribe('window:resizeEnd', this.listeners.onResizeEnd);
	}

	onResizeEnd() {
		this.reset();
	}

	reset() {
		let _visible = this.root.offsetWidth > 0;

		if (_visible == this.state.visible) return;

		this.state.visible = _visible;

		if (this.state.visible && !this.state.loaded) this.load();
	}

	load() {
		if (this.props.src == null) return;
		if (this.state.loaded) return;

		let _image = new Image();
		_image.onload = this.onLoad.bind(this);
		_image.src = this.props.src;
	}

	onLoad() {
		this.root.style.backgroundImage = 'url('+this.props.src+')';
		this.root.classList.add('_loaded');
		this.state.loaded = true;

		this.unbind();

		Dispatcher.trigger('Background:loaded', {alias: this.alias});
	}

	getVisible() {
		return this.state.visible;
	}
	getLoaded() {
		return this.state.loaded;
	}
}

module.exports = Background;