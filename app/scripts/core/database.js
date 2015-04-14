'use strict';
const KEY = 'reel.slides';

var
 /**
  * Simple DB substitute. Stores everything as a string in localstorage.
  * Uses ES6 promises to return data, to mock asynchronous data
  *
  * @type {Object}
  */
  Database = {},

  /**
   * Basic wrapper over local storage
   * @type {Object}
   */
  Storage = {};

/**
 * Get from localstorage
 * @return {Object} parses the json string stored
 */
Storage.get = function () {
  var item = localStorage.getItem(KEY);
  return JSON.parse(item);
};

/**
 * Save to localstorage
 * @param {Object} value converts to string and saves
 */
Storage.set = function (value) {
  var item = JSON.stringify(value);
  localStorage.setItem(KEY, item);
};

if ( !Storage.get() ) {
  Storage.set([]);
}

/**
 * Adds of updates a slide. This is decided based on the slide.id property
 *
 * @param  {Slide}   slide slide to save
 * @return {Promise}
 */
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

/**
 * Deletes a slide. This is decided based on the slide.id property
 *
 * @param  {Slide}   slide slide to delete
 * @return {Promise}
 */
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

/**
 * Returns a slide.
 *
 * First checks if the id is an index in the array of slides and return by slide position.
 * If not, it tries to match against slide.id
 *
 * @param  {String}   id position or id of the slide
 * @return {Promise}
 */
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

/**
 * Returns all slides
 * @return {Promise} The parameter passed is the array of slides
 */
Database.getSlides = function () {
  return new Promise(function (resolve, reject) {
    resolve(Storage.get());
  });
}

module.exports = Database;