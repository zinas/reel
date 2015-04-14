'use strict';

var React = require('react');
var Block = require('../components/block');
var Controls = require('../components/controls');

var BlockModel = require('../models/block');
var SlideModel = require('../models/slide');

var Database = require('../core/database');

/**
 * Component for rendering a single slide. Also rendering other components
 * for the controls and for every single one of the blocks
 */
var Slide = React.createClass({

  // Slide data exist in the state, since the change ofter. Slide id is a property
  _updateSlideState: function (id) {
    return SlideModel.getById(id).then((function (slide) {
      if ( slide ) {
        this.setState({slide: slide});
      } else {
        this.setState({slide: this._getEmptySlide()});
      }
    }).bind(this));
  },
  _getEmptyBlock: function () {
    var block = new BlockModel();
    block.value = '';
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
    var slide = this.state.slide;
    return slide.removeBlock(block).save().then((function () {
      this.setState({slide:slide});
    }).bind(this));
  },
  updateBlock: function (block) {
    var slide = this.state.slide;
    return slide.updateBlock(block).save().then((function () {
      this.setState({slide:slide});
    }).bind(this));
  },
  addBlock: function (block) {
    var slide = this.state.slide;
    return slide.addBlock(this._getEmptyBlock()).save().then((function () {
      this.setState({slide: slide});
    }).bind(this));
  },
  handleDelete: function () {
    var slide = this.state.slide;
    slide.remove().then((function () {
      this._updateSlideState(this.props.id);
    }).bind(this));
  },
  render: function() {
    var classString = "slide " + (this.props.editmode?'slide--editmode':'');

    return (
      <div className={classString}>
        <Controls editmode={this.props.editmode} onAddText={this.addBlock} onDelete={this.handleDelete} />
        {this.state.slide.blocks.map( (function (block, i) {
          return <Block key={block.id} model={block} editmode={this.props.editmode} onChange={this.updateBlock} onRemove={this.removeBlock} />;
        }).bind(this) )}
      </div>
    );
  }
});

module.exports = Slide;