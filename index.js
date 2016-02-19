var isNode = require('./js/isNode.js');
if (isNode) {
  exports = module.exports = require('./js/nodeLogging');
} else {
  exports = module.exports = require('./js/browserLogging');
}
