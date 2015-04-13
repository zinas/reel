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
  _getEmptyBlock: function () {
    var block = new BlockModel();
    block.value = 'Enter your text...';
    block.position.top = 40;
    block.position.left = 150;

    return block;
  },
  _getEmptySlide: function () {
    // Create an empty slide. The initial slide should be presented
    // in edit mode, before the user has editted anything
    var slide = new SlideModel();
    slide.addBlock(this._getEmptyBlock());

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
    return this.state.slide.updateBlock(block).save();
  },
  addBlock: function (block) {
    var slide = this.state.slide;
    return slide.addBlock(this._getEmptyBlock()).save().then((function () {
      this.setState({slide: slide});
    }).bind(this));
  },
  render: function() {
    var classString = "slide " + (this.props.editmode?'slide--editmode':'');

    return (
      <div className={classString}>
        <Controls editmode={this.props.editmode} onAddText={this.addBlock}/>
        {this.state.slide.blocks.map( (function (block, i) {
          return <Block key={block.id} model={block} editmode={this.props.editmode} onChange={this.updateBlock} onRemove={this.removeBlock} />;
        }).bind(this) )}
      </div>
    );
  }
});

module.exports = Slide;