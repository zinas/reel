(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Router = require('../../app/scripts/core/router');

console.log('router', Router);

QUnit.test( "test example for router", function( assert ) {
  var value = "hello";
  assert.equal( value, "hello", "We expect value to be hello" );
});

},{"../../app/scripts/core/router":2}],2:[function(require,module,exports){
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
  this.go(this._fallback, true);
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

},{}]},{},[1]);
