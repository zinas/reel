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