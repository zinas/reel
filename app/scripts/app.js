var Router = require('./core/router');

Router
  .addRoute({
    id: 'slide',
    when: '/slides/:id',
    resolve: require('./controllers/slide').render
  })
  // Just a testing route to fill the db with some slides
  .addRoute({
    id: 'warmupDb',
    when: '/warmup',
    resolve: function () {
      var SlideModel = require('./models/slide');
      var BlockModel = require('./models/block');

      var blockA = new BlockModel();
      var slideA = new SlideModel();

      blockA.value = "My first slide";
      blockA.position = {top: 50, left: 50};

      slideA.addBlock(blockA).save();

      var blockB = new BlockModel();
      var slideB = new SlideModel();

      blockB.value = "My second slide";
      blockB.position = {top: 120, left: 120};

      slideB.addBlock(blockB).save();
    }
  })
  .fallback('/slides/1')
  .run();