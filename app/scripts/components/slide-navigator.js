'use strict';

var React = require('react');
var Database = require('../core/database');
var Router = require('../core/router');

/**
 * Navigation for all the slides. Can go to next/previous, can toggle edit mode and create new slides
 */
var SlideNavigator = React.createClass({
  _updateState: function () {
    // TODO Need to remove Database reference from component. Change to Slide.getAll()
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
  addSlide: function () {
    Router.go({
      id: 'slide',
      params: {id: this.state.totalSlides + 1}
    });
  },
  render: function() {
    return (
      <ul className="nav">
        <li className="nav__item">
          <button
            onClick={this.previous}
            disabled={!this.state.hasPrevious}
            className="button--branding">
              <i className="fa fa-arrow-left"></i> Previous
          </button>
        </li>
        <li className="nav__item">
          <button
            onClick={this.next}
            disabled={!this.state.hasNext}
            className="button--branding">
              Next <i className="fa fa-arrow-right"></i>
          </button>
        </li>
        <li className="nav__item">
          <button
            onClick={this.edit}
            className="button--branding">
              <i className="fa fa-pencil"></i> Toggle Edit Mode
          </button>
        </li>
        <li className="nav__item">
          <button
            onClick={this.addSlide}
            className="button--branding">
              <i className="fa fa-plus"></i> New Slide
          </button>
        </li>
      </ul>
    );
  }
});

module.exports = SlideNavigator;