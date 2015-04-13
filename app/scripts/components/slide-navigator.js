'use strict';

var React = require('react');
var Database = require('../core/database');
var Router = require('../core/router');

var SlideNavigator = React.createClass({
  _updateState: function () {
    Database.getSlides().then((function (slides) {
      this.setState({
        hasPrevious: this.props.currentSlide > 1 ? true : false,
        hasNext: this.props.currentSlide < slides.length ? true : false,
        totalSlides: slides.length
      });

    }).bind(this));
  },
  propTypes: {
    currentSlide: React.PropTypes.number,
    editmode: React.PropTypes.bool
  },
  getInitialState: function () {
    return {
      hasPrevious: this.props.currentSlide > 1 ? true : false,
      hasNext: false,
      totalSlides: this.props.currentSlide
    };
  },
  componentDidMount: function () {
    this._updateState();
  },
  componentWillReceiveProps : function (nextProps) {
    this._updateState();
  },
  next: function () {
    Router.go({
      id: 'slide',
      params: {id: this.props.currentSlide + 1}
    });
  },
  previous: function () {
    Router.go({
      id: 'slide',
      params: {id: this.props.currentSlide - 1}
    });
  },
  edit: function () {
    Router.go({
      id: 'slide',
      params: {id: this.props.currentSlide},
      query: {editmode: !this.props.editmode}
    });
  },
  add: function () {
    Router.go({
      id: 'slide',
      params: {id: this.state.totalSlides + 1},
      query: {editmode: !this.props.editmode}
    });
  },
  render: function() {
    return (
      <div className="navigation">
        <button
          onClick={this.previous}
          disabled={!this.state.hasPrevious}
          className="navigation__button navigation__button--previous">
            Previous
        </button>
        <button
          onClick={this.next}
          disabled={!this.state.hasNext}
          className="navigation__button navigation__button--next">
            Next
        </button>
        <button
          onClick={this.edit}
          className="navigation__button navigation__button--editmode">
            Edit
        </button>
        <button
          onClick={this.add}
          className="navigation__button navigation__button--add">
            Add new
        </button>
      </div>
    );
  }
});

module.exports = SlideNavigator;