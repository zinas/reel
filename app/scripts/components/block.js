'use strict';

var React = require('react');
var Utils = require('../core/utils');
var Drag = require('../vendor/dom-drag/dom-drag');

var Block = React.createClass({
  _setupDnD: function () {
      var
        handle = React.findDOMNode(this.refs.handle),
        block = React.findDOMNode(this.refs.wholeBlock);

      Drag.init(handle, block);

      block.onDragEnd = (function (x, y) {
        console.log('block', x, y);
        this.state.model.position.top = y;
        this.state.model.position.left = x;

        this.props.onChange(this.state.model);
      }).bind(this);
  },

  getInitialState: function () {
    return {
      model: this.props.model,
      value: this.props.model.value,
      top: this.props.model.position.top,
      left: this.props.model.position.left
    };
  },

  componentDidMount: function () {
    this.updateSlideContent = Utils.debounce((function () {
      this.props.onChange(this.state.model);
    }).bind(this), 400);

    if ( this.props.editmode ) {
      this._setupDnD();
    }
  },

  componentWillReceiveProps: function () {
    if ( this.props.editmode ) {
      this._setupDnD();
    }
  },

  handleChange: function (event) {
    this.setState({value: event.target.value});
    this.state.model.value = event.target.value;
    this.updateSlideContent();
  },

  render: function() {
    var styles = {
      top: this.state.top + 'px',
      left: this.state.left + 'px'
    };

    return (
      <div ref="wholeBlock" className="slide__block" style={styles}>
        <div ref="handle" className="button button--branding slide__moveit"><i className="fa fa-arrows"></i></div>
        <div className="button button--danger slide__removeit"><i className="fa fa-minus"></i></div>
        <div className="slide__content">{this.state.value}</div>
        <input className="slide__input" type="text" onChange={this.handleChange} value={this.state.value} />
      </div>
    );
  }
});

module.exports = Block;