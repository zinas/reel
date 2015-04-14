'use strict';

/**
 * Simple routing solution.
 * @type {Object}
 */
var Router = {};

// 'Private' properties
Router._routes = {};
Router._fallback = '/';
Router._current = {
  fullpath: '',
  page: '',
  params: [],
  query: {}
};
Router.atFallback = false;

/**
 * Declares a new route, to check against when trying to match a url
 *
 * route: {
 *   id: unique string id for the route
 *   when: pattern to use for mapping, params are denoted by : (eg. /myroute/:myparam)
 *   resolve: callback, when route is matched. Params are passed as arguments
 * }
 * @param  {Object} route The new route
 * @return {Route}      Return self to allow chaining
 */
Router.addRoute = function(route) {
  var path, params = [];
  route.page = this.getPageFromPath(route.when);
  route.params = this.getParamsFromPath(route.when);

  this._routes[route.id] = route;

  return this;
};

/**
 * Set the fallback to go to, when no route matches
 * @param  {String} url Specific url to navigate to (eg. /myroute/5)
 * @return {Route}      Return self to allow chaining
 */
Router.fallback = function (url) {
  this._fallback = url;

  return this;
}

/**
 * Navigate to another url. Uses History API to manipulate state.
 *
 * Examples (both equivelant)
 * Router.go('/myroute/5');
 * Router.go({id: 'myroute', params[5]});
 *
 * @param  {Object} obj     Either a url as a string, or a route object
 * @param  {Boolen} replace Whether to replace the state or push a new one
 * @return {null}
 */
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

/**
 * Wrapper to go directly yo fallback url
 *
 * @return {null}
 */
Router.goToFallback = function () {
  if ( !this.atFallback ) {
    this.atFallback = true;
    this.go(this._fallback, true);
  } else {
    console.warn('Already at fallback. Escaping infinite loop');
  }
}

/**
 * Parse a url, extracting the path and the query parameters
 *
 * @param  {String} url url to parse. If null, gets browser location
 * @return {null}
 */
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

  //TODO this should be decoupled from parseUrl
  this.resolvePath(fullpath);
};

/**
 * Matches the current parsed url with the available routes
 * and executes the callback for the route matched.
 *
 * @param  {String} fullpath path to check
 * @return {null}
 */
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

/**
 * Given a path, it returns the page name (ie. the part without params)
 * For example, given: /myroute/:id/:param2 it will return /myroute
 *
 * @param  {String} path url to parse
 * @return {String}      the page
 */
Router.getPageFromPath = function (path) {
  return path.split('/:')[0];
};

/**
 * Given a path, it returns an array with the param names
 * For example, given: /myroute/:id/:param2 it will return [':id', ':param2']
 *
 * @param  {String} path url to parse
 * @return {Array}       params array
 */
Router.getParamsFromPath = function (path) {
  return path.split('/').filter(function (fragment) {
    if ( fragment.startsWith(':') ) {
      return fragment;
    }
  });
};

/**
 * Tries to match a given path with an existing route
 * Both the first part of the url must match, and the number of parameters
 *
 * @param  {String} path  Path to match
 * @param  {Object} route Existing route
 * @return {Boolean}      Whether they match
 */
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

/**
 * Runs a specific route and sets the router params accordingly
 *
 * @param  {Object} route route to execute
 * @return {null}
 */
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

/**
 * Runs the router, trying to match the current url
 * Use this after adding all routes, to initialize your app properly
 *
 * @return {Router} return self to allow chaining
 */
Router.run = function () {
  this.parseUrl();
  return this;
};

/**
 * Expose properties of the current route
 *
 * @return {Object} current route
 */
Router.current = function () {
  return this._current;
};

// Run the router everytime the browser state (location) changes
window.addEventListener('popstate', (function(event) {
  Router.parseUrl();
}));

module.exports = Router;