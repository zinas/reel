'use strict';

var React = require('react');

var Controls = React.createClass({

  render: function() {
    return (
      <div className="slide__controls">
        <button className="button--branding button--block"><i className="fa fa-font"></i> Add text</button>
        <button className="button--branding button--block"><i className="fa fa-picture-o"></i> Add image</button>
        <button className="button--branding button--block"><i className="fa fa-code"></i> Add code</button>
      </div>
    );
  }
});

module.exports = Controls;