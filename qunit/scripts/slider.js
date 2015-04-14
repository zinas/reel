(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Slide = require('../../app/scripts/models/slide');

console.log('slide', Slide);

QUnit.test( "slide example", function( assert ) {
  var value = "hello";
  assert.equal( value, "hello", "We expect value to be hello" );
});

},{"../../app/scripts/models/slide":3}],2:[function(require,module,exports){
'use strict';
const KEY = 'reel.slides';

var Database = {}, Storage = {};

Storage.get = function () {
  var item = localStorage.getItem(KEY);
  return JSON.parse(item);
};

Storage.set = function (value) {
  var item = JSON.stringify(value);
  localStorage.setItem(KEY, item);
};

if ( !Storage.get() ) {
  Storage.set([]);
}

Database.saveSlide = function (slide) {
  return new Promise(function (resolve, reject) {
    var slides = Storage.get(), index = -1, i;

    for ( i = 0; i < slides.length; i++ ) {
      if ( slides[i].id === slide.id ) {
        index = i;
      }
    }

    if ( index > -1 ) {
      slides[index] = slide;
    } else {
      slides.push(slide);
    }

    resolve(slides);
    Storage.set(slides);
  });
};

Database.removeSlide = function (slide) {
  return new Promise(function (resolve, reject) {
    var slides = Storage.get();
    slides = slides.filter(function (obj) {
      return slide.id !== obj.id;
    });
    resolve(slides);
    Storage.set(slides);
  });
};

Database.getSlide = function (id) {
  return new Promise(function (resolve, reject) {
    var slides = Storage.get(), slide;
    if ( slides[id] ) {
      resolve(slides[id]);
      return;
    }

    slide = slides.filter(function (obj) {
      return id === obj.id;
    });
    if ( slide[0] ) {
      resolve(slide[0]);
      return;
    }

    resolve(null);
  });
};

Database.getSlides = function () {
  return new Promise(function (resolve, reject) {
    resolve(Storage.get());
  });
}

module.exports = Database;

},{}],3:[function(require,module,exports){
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

},{"../core/database":2}]},{},[1]);
