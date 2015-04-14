'use strict';

var Database = require('../core/database');

/**
 * A simple Active Record to hold data for a slide.
 * It only persists data if you call save() explicitely
 * @param {Object} slide initialized a new slide with these values
 */
function Slide(slide) {
  if ( slide ) {
    this.id = slide.id;
    this.blocks = slide.blocks;
  } else {
    var now = new Date();
    this.id = now.getTime() + parseInt(Math.random()*10000);
    this.blocks = [];
  }
};

/**
 * Adds another block to the slide
 * @param {Block} block
 */
Slide.prototype.addBlock = function (block) {
  this.blocks.push(block);
  return this;
};

/**
 * Replaces a specific block by id
 * @param  {String} id    id of the block (not the position in the array)
 * @param  {Block}  block New value
 * @return {Slide}        Return self to allow chaining
 */
Slide.prototype.updateBlock = function (id, block) {
  this.blocks[id] = block;
  return this;
};

/**
 * Remove a specific block.
 * Matches the block using the block.id property
 * @param  {Block}  block The block to remove
 * @return {Slide}        Return self to allow chaining
 */
Slide.prototype.removeBlock = function (block) {
  this.blocks = this.blocks.filter(function (obj) {
    return block.id !== obj.id;
  });
  return this;
};

/**
 * Persists the data, works both for adding a new slide and updating an existing one
 *
 * @return {Promise}
 */
Slide.prototype.save = function () {
  return Database.saveSlide(this).then(function (result) {
    console.log('success', result);
  }, function (result) {
    console.log('error', result);
  });
};

/**
 * Deletes the slide entirely
 * @return {Promise}
 */
Slide.prototype.remove = function () {
  return Database.removeSlide(this);
};

/**
 * 'Static' method to search by id
 * (id in this case means order of the slide, eg. get the third slide)
 * @param  {String} id order of the slide
 * @return {Slide}     instance of the slide found or null
 */
Slide.getById = function (id) {
  return Database.getSlide(id).then(function (slide) {
    return slide ? new Slide(slide) : null;
  });
}

module.exports = Slide;