# reel
Since this exercise is part of an evaluation of my coding skills, I tried to use as little as possible of ready made code and libraries. Even if in a normal scenario I would opt for using something that already exists, than creating my own, in this case I created a very basic version of everything I needed. A good example is the Router, where I chose to create my own solution.

The only exceptions were React, which was explicitely mentioned in the exercise, as well as any automation and testing tools.

I tried to keep the code as DRY as possible. Also, spread out inside the code, you will notice how I definitely prefer conventions over configuration and how I prefer breaking everything into as small pieces as possible (call them modules/components/classes/whatever) with as little functionality as possible (preferable, sticking to the single responsibility principle)

### Creating the project
After searching a bit which setup to use, I ended up using the react-gulp-browserify yeoman generator (https://github.com/randylien/generator-react-gulp-browserify). Made sense to jump start the project and have the original tools and dependencies set in place, without wasting time.

## Technical Notes
### Installation and running
- Clone the git repo
- npm install
- gulp serve

Originally, there will be no slides, but you can add your own. There is also a "warmup" script, adding 3 slides. Just navigate to /#/warmup manually. If you have already added some slides, the 3 will be appended to the end.

### Routing
A custom solution was implemented for the Router. I chose to go for a singleton, which means you can only have one router per application. A brief documentation of the router follows.

#### Defining routes
```javascript
Router.addRoute({
    id: 'my-route-id', // any unique string
    when: '/myroute/:param1/:param2',
    resolve: function (param1, param2) {
      // this function wil be executed if url matches this route
      // arguments are passed in the same order as in the "when" property
    }
});
```

#### Manupulating the url
```javascript
Router.go('/myroute/5/1?count=3');
// or
Router.go({
  id: 'my-route-id',
  params: [5, 1],
  query: {'count': '3'}
});
```

#### Getting the current state
```javascript
// Assume the url /myroute/5/1?count=3
Router.current().params // [5, 1]
Router.current().query.count // 3
Router.current().page // /myroute
```
