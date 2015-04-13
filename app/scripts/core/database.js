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