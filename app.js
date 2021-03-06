const path = require('path');
const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const { buildDirName } = require('./utils/config');
const webpackHelper = require('./utils/webpack');
const isProd = require('./utils/env');
const config = require('./webpack.config');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const compiler = webpack(config);

const app = express();

// webpack只在开发环境加载
if (!isProd) {
  app.use(
    middleware(compiler, {
      // webpack-dev-middleware options
      serverSideRender: true,
      publicPath: config.output.publicPath
    })
  );
}

app.use((req, res, next) => {
  const chunks = isProd ?
    JSON.parse(fs.readFileSync('./public/dist/manifest.json', 'utf-8')) :
    res.locals.webpackStats.toJson().assetsByChunkName;
  res.locals.chunks = chunks;
  res.locals.assets_pack = webpackHelper.assets_pack(chunks);
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
