'use strict';

var React = require('react');

var Controls = React.createClass({

  addText: function () {
    this.props.onAddText();
  },

  showIncompleteAlert: function () {
    alert('This button is here only as an example.');
  },

  deleteSlide: function () {
    if ( confirm('Are you sure you want to delete this slide?') ) {
      this.props.onDelete();
    }
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
        <button onClick={this.deleteSlide} className="button--danger button--block">
          <i className="fa fa-trash-o"></i> Delete slide
        </button>
      </div>
    );
  }
});

module.exports = Controls;