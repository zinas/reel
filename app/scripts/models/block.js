'use strict';

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