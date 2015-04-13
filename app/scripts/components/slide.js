'use strict';

var React = require('react');
var Block = require('../components/block');
var Controls = require('../components/controls');

var BlockModel = require('../models/block');
var SlideModel = require('../models/slide');

var Database = require('../core/database');

var Slide = React.createClass({

  _updateSlideState: function (id) {
    return SlideModel.getById(id).then((function (slide) {
      if ( slide ) {
        console.log('found slide', slide);
        this.setState({slide: slide});
      } else {
        console.log('empty slide')
        this.setState({slide: this._getEmptySlide()});
      }
    }).bind(this));
  },
  _getEmptySlide: function () {
    // Create an empty slide. The initial slide should be presented
    // in edit mode, before the user has editted anything
    var slide = new SlideModel();
    var block = new BlockModel();
    block.value = 'Slide text goes here...';
    block.position.top = 50;
    block.position.left = 50;
    slide.addBlock(block);

    return slide;
  },

  getInitialState: function () {
    // initially render an emtpy slide, with placeholder text
    return {slide: this._getEmptySlide()};
  },
  componentDidMount: function () {
    this._updateSlideState(this.props.id);
  },
  componentWillReceiveProps : function (nextProps) {
    this._updateSlideState(nextProps.id);
  },
  removeBlock: function (block) {
    this.state.slide.removeBlock(block).save();
  },
  updateBlock: function (block) {
    console.log('updating... ', block, this.state.slide);
    return this.state.slide.updateBlock(block).save();
  },
  render: function() {
    var classString = "slide " + (this.props.editmode?'slide--editmode':'');

    return (
      <div className={classString}>
        <Controls editmode={this.props.editmode} />
        {this.state.slide.blocks.map( (function (block, i) {
          return <Block key={block.id} model={block} editmode={this.props.editmode} onChange={this.updateBlock} onRemove={this.removeBlock} />;
        }).bind(this) )}
      </div>
    );
  }
});

module.exports = Slide;