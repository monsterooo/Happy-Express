const isObject = require('is-object');
const { buildDirName } = require('./config');
const isProd = require('./env');

const normalizeAssets = (assets) => {
  if (isObject(assets)) {
    return Object.values(assets);
  }
 
  return Array.isArray(assets) ? assets : [assets];
}

const assets_pack = chunks => name => {
  const assets = [];
  const jsTemplate = '<script type="text/javascript" src="##"></script>';
  const cssTemplate = '<link rel="stylesheet" href="##"></link>';

  if (isProd) {
    const cssName = chunks[`${name}.css`];
    const jsName = chunks[`${name}.js`];
    if (cssName) assets.push(cssTemplate.replace('##', `${buildDirName}/${cssName}`));
    if (jsName) assets.push(jsTemplate.replace('##', `${buildDirName}/${jsName}`));
  } else {
    normalizeAssets(chunks[name])
      .filter(path => path.endsWith('.css'))
      .forEach(path => assets.push(cssTemplate.replace('##', `${buildDirName}/${path}`)));
    normalizeAssets(chunks[name])
      .filter(path => path.endsWith('.js'))
      .forEach(path => assets.push(jsTemplate.replace('##', `${buildDirName}/${path}`)));
  }
  return assets.join('');
}

module.exports = {
  assets_pack,
};