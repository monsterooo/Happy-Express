const webpack = require('webpack');

webpack({
  mode: "development",
  
}, (err, stats) => { // Stats Object
  if (err || stats.hasErrors()) {
    // Handle errors here
  }
  // Done processing
});

