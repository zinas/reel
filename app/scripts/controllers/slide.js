'use strict';

var React = require('react');
var Slide = require('../components/slide');
var SlideNavigator = require('../components/slide-navigator');

var SlideController = {};

SlideController.render = function (id, query) {
  var
    mountNode = document.getElementById('app'),
    editmode = !!(query.editmode && query.editmode !== 'false' && query.editmode !== '0');

  var div = (
      <div className="wrapper">
        <Slide id={id-1} editmode={editmode} />
        <SlideNavigator currentSlide={parseInt(id)} editmode={editmode} />
      </div>
    );

  React.render(div, mountNode);
};

module.exports = SlideController;