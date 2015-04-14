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
      blockA.position = {top: 150, left: 150};

      slideA.addBlock(blockA).save();

      var blockB = new BlockModel();
      var blockB1 = new BlockModel();
      var slideB = new SlideModel();

      blockB.value = "My second slide - part1";
      blockB.position = {top: 150, left: 150};

      blockB1.value = "My second slide - part2";
      blockB1.position = {top: 250, left: 150};

      slideB.addBlock(blockB).addBlock(blockB1).save();

      var blockC = new BlockModel();
      var slideC = new SlideModel();

      blockC.value = "My third slide";
      blockC.position = {top: 150, left: 150};

      slideC.addBlock(blockC).save();

    }
  })
  .fallback('/slides/1')
  .run();