'use strict';

var Database = require('../core/database');

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

Slide.prototype.addBlock = function (block) {
  this.blocks.push(block);
  return this;
};

Slide.prototype.updateBlock = function (id, block) {
  this.blocks[id] = block;
  return this;
};

Slide.prototype.removeBlock = function (block) {
  this.blocks = this.blocks.filter(function (obj) {
    return block.id !== obj.id;
  });
  return this;
};

Slide.prototype.save = function () {
  console.log('saving slide');
  return Database.saveSlide(this).then(function (result) {
    console.log('success', result);
  }, function (result) {
    console.log('error', result);
  });
};

Slide.prototype.remove = function () {
  return Database.removeSlide(this);
};

Slide.getById = function (id) {
  return Database.getSlide(id).then(function (slide) {
    return slide ? new Slide(slide) : null;
  });
}

module.exports = Slide;