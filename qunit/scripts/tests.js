(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./router');
require('./slider');

},{"./router":5,"./slider":6}],2:[function(require,module,exports){
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

var Router = {};

Router._routes = {};
Router._fallback = '/';
Router._current = {
  fullpath: '',
  page: '',
  params: [],
  query: {}
};
Router.atFallback = false;

Router.addRoute = function(route) {
  var path, params = [];
  route.page = this.getPageFromPath(route.when);
  route.params = this.getParamsFromPath(route.when);

  this._routes[route.id] = route;

  return this;
};

Router.fallback = function (url) {
  this._fallback = url;

  return this;
}

Router.go = function (obj, replace) {
  var url, i, query = this._current.query, tmp;
  replace = replace || false;
  if ( typeof obj === 'string') {
    url = '/#' + obj;
  }

  if ( typeof obj === 'object' ) {
    url = '/#' + this._routes[obj.id].when;
    if ( obj.params ) {
      for ( i in obj.params ) {
        url = url.replace(':'+i, obj.params[i]);
      }
    }

    if ( obj.query ) {
      for ( i in obj.query ) {
        query[i] = obj.query[i];
      }
    }
  }

  if ( Object.keys(query).length > 0 ) {
    url = url + '?';
    tmp = [];

    for ( i in query ) {
      tmp.push(i+'='+query[i]);
    }

    url = url + tmp.join('&');
  }

  if ( replace ) {
    history.replaceState(null, null, url);
  } else {
    history.pushState(null, null, url);
  }

  this.parseUrl();
};

Router.goToFallback = function () {
  if ( !this.atFallback ) {
    this.atFallback = true;
    this.go(this._fallback, true);
  } else {
    console.warn('Already at fallback. Escaping infinite loop');
  }
}

Router.parseUrl = function (url) {
  var fullpath, query, i, queryParams;
  url = url || window.location.href;
  fullpath = url.match(/\/#([^\?]*)\??/)?url.match(/\/#([^\?]*)\??/)[1]:'';

  if ( !fullpath ) {
    this.goToFallback();
    return;
  }
  query = url.match(/\?(.*)$/)?url.match(/\?(.*)$/)[1]:'';

  this._current.query = {};
  if ( query ) {
    queryParams = query.split('&');
    for ( i=0; i<queryParams.length; i++ ) {
      this._current.query[queryParams[i].split('=')[0]] = queryParams[i].split('=')[1];
    }
  }

  this.resolvePath(fullpath);
};

Router.resolvePath = function (fullpath) {
  var i, params;

  this._current.fullpath = fullpath;

  for ( i in this._routes ) {
    if ( this._routes.hasOwnProperty(i) && this.routeMatches(fullpath, this._routes[i]) ) {
      this.executeRoute(this._routes[i]);
      return;
    }
  }

  // No routes matches, go to fallback
  this.goToFallback();
};

Router.getPageFromPath = function (path) {
  return path.split('/:')[0];
};

Router.getParamsFromPath = function (path) {
  return path.split('/').filter(function (fragment) {
    if ( fragment.startsWith(':') ) {
      return fragment;
    }
  });
};

Router.routeMatches = function (path, route) {
  var params, paramsStr;
  if ( path.startsWith(route.page) ) {
    paramsStr = path.replace(route.page, '');
    paramsStr = paramsStr.startsWith('/')?paramsStr.substr(1, paramsStr.length):paramsStr;
    params = paramsStr.split('/');
    if (
        (paramsStr === '' && !route.params.length) ||
        (params.length === route.params.length)
      ) {
      return true;
    }
  }
  return false;
}

Router.executeRoute = function (route) {
  var params, i;

  this._current.page = route.page;
  this._current.params = this._current.fullpath.replace(route.page + '/', '').split('/');

  // Route resolved, so we can reset this flag
  this.atFallback = false;

  var parameters = this._current.params;
  parameters.push(this._current.query);
  route.resolve.apply(route.resolve, parameters);
};

Router.run = function () {
  this.parseUrl();
  return this;
};

Router.current = function () {
  return this._current;
};

window.addEventListener('popstate', (function(event) {
  Router.parseUrl();
}));


module.exports = Router;

},{}],4:[function(require,module,exports){
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

},{"../core/database":2}],5:[function(require,module,exports){
var Router = require('../../app/scripts/core/router');

QUnit.module('Router');

// Setting up testing routes and helpers
Router
  .addRoute({
    id: 'routeNoParams',
    when: '/routeNoParams',
    resolve: function (query) {
      resolved = 'routeNoParams';
    }
  })
  .addRoute({
    id: 'routeOneParam',
    when: '/routeOneParam/:param1',
    resolve: function (param1, query) {
      resolved = 'routeOneParam';
    }
  })
  .addRoute({
    id: 'routeTwoParams',
    when: '/routeTwoParams/:param1/:param2',
    resolve: function (param1, param2, query) {
      resolved = 'routeTwoParams';
    }
  })
  .fallback('/routeTwoParams/2/3');

var
  resolved = '',
  url1 = 'http://www.dummy.com/#/nonExistentRoute/withParam',
  url2 = 'http://www.dummy.com/#/routeNoParams',
  url3 = 'http://www.dummy.com/#/routeOneParam/1/2',
  url4 = 'http://www.dummy.com/#/routeTwoParams/1/2';


QUnit.test( 'Testing url: '+url1, function( assert ) {
  Router.parseUrl(url1);
  assert.equal(Router.current().page, '/routeTwoParams', 'Undeclared url falls back to the default route');
  assert.equal(Router.current().params[1], '3', 'Parsed correct second parameter of fallback');
  assert.equal(resolved, 'routeTwoParams', 'Route callback called correctly');
});

QUnit.test( 'Testing url: '+url2, function( assert ) {
  Router.parseUrl(url2);
  assert.equal(Router.current().page, '/routeNoParams', 'Parsed correct url without params');
  assert.equal(resolved, 'routeNoParams', 'Route callback called correctly');
});

QUnit.test( 'Testing url: '+url3, function( assert ) {
  Router.parseUrl(url3);
  assert.notEqual(Router.current().page, '/routeOneParam', 'Wrong count of parameters should go to fallback, even if the rest of the path matches');
});

QUnit.test( 'Testing url: '+url4, function( assert ) {
  Router.parseUrl(url4);
  assert.equal(Router.current().page, '/routeTwoParams', 'Parsed correct url without 2 params');
  assert.equal(Router.current().params[0], '1', 'Parsed correct first parameter');
  assert.equal(Router.current().params[1], '2', 'Parsed correct second parameter');
  assert.equal(resolved, 'routeTwoParams', 'Route callback called correctly');
});

},{"../../app/scripts/core/router":3}],6:[function(require,module,exports){
var Slide = require('../../app/scripts/models/slide');

QUnit.module('Slide ActiveRecord');
QUnit.test('A sample test', function( assert ) {
  assert.ok( true, 'This test is not implemented. Only here as a placeholder, to demo how unit testing for a second module would be implemented');
});

},{"../../app/scripts/models/slide":4}]},{},[1]);
