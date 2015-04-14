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

#### Browser compatibility
Only latest Chrome

### Component breakdown
#### Block
Block represents a piece of content that can be added in any slide. Block is intended to hold different types of data, but for the purpose of this exercise, only the text type is implemented. Ideally, more types can be added, like image, video, code snippet, rich text etc. etc.

A block has a value and also a position. Which means it can be moved around in the slide, by dragging. This is only available in editmode.

#### Slide
This is the main component used. One slide is equivelant to a whole page and it can hold multiple Blocks. A slide can be in editmode, which is a state that propagates to its child components. Based on the best practices of React, this is the parent component that handles state, so that state manipulation doesn't become too spread and difficult to handle

#### Controls
Another child component of Slide. It gives you the ability to add more blocks to the specific slide and also to delete it.

#### Navigator
This is the main navigation. Next/Previous, handling the editmode flag and adding new slides. This is not slide specific, so it doesn't belong as a child of the Slide.

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

### Data handling
Based on the exercise, data should persist only in the client. I chose to go with saving them in localstorage for simplicity 
and speed of development. I like the idea of models for data and the concept of ActiveRecords, so I implemented a very simple solution like that. 

Even though localstorage is synchronous, I used ES6 Promises to make it asynchronous. This, combined with the fact that the Slide ActiveRecord doesn't access the data directly but thougnt the Database singleton, makes it very simple to switch from localstorage to any other solution, including a server-side database.

There is also a model for Block, but it is more of a structure to hold data, rather than anything else.

#### Using the ActiveRecord
```javascript
var slide = new Slide();
var block = new Block();
block.value = "this is the slide text";

// Chaining is used for ActiveRecord. Also, persistance happens only when calling save() explicitely
slide.addBlock(block).save();

var anotherBlock = new Block();
anotherBlock.value = "other text";
anotherBlock.position.top = 200;
anotherBlock.position.left = 200;

// save() is intelligent enough to understand between adding a slide or updating the existing one
slide.addBlock(anotherBlock).save();

// updating and removing blocks is again intelligent enough
block.value = 'updated text';
slide.updateBlock(block).removeBlock(anotherBlock).save();

// and finally deleting the slide alltogether
slide.remove();

// Finding a slide is simple enough as well. I am using a static function for that
Slide.getById(3).then(function (slide) {
    // the result passed is already an active record, so the following is possible
    var block = new Block();
    block.value = 'some text';
    slide.addBlock(block).save().then(function () {
        // all done
    });
});
```
