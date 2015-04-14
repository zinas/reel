'use strict';

/**
 * Simple structure to hold data for a block.
 * A unique id is generated upon construction
 */
function Block() {
  var now = new Date();
  this.id = now.getTime() + parseInt(Math.random()*10000);
  this.type = 'html';
  this.value = '';
  this.position = {
    top: 0,
    left: 0
  };

  return this;
};

module.exports = Block;