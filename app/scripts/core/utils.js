'use strict';

var Utils = {};

/**
 * Debouncing functionality, copied from UnderscoreJS
 *
 * @param  {Function} func      function to debouce
 * @param  {Number}   wait      time to wait before calling
 * @param  {Boolean}  immediate make the first call immediate and then start the timer
 * @return {null}
 */
Utils.debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

module.exports = Utils;