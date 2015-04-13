'use strict';

var React = require('react');

var Controls = React.createClass({

  addText: function () {
    this.props.onAddText();
  },

  showIncompleteAlert: function () {
    alert('This button is here only as an example.');
  },

  render: function() {
    return (
      <div className="slide__controls">
        <button onClick={this.addText} className="button--branding button--block">
          <i className="fa fa-font"></i> Add text
        </button>
        <button onClick={this.showIncompleteAlert} className="button--branding button--block">
          <i className="fa fa-picture-o"></i> Add image
        </button>
        <button onClick={this.showIncompleteAlert} className="button--branding button--block">
          <i className="fa fa-code"></i> Add code
        </button>
      </div>
    );
  }
});

module.exports = Controls;