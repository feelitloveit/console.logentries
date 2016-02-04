module = angular.module('VskoRemoteErrorLogger', [ 'ng' ]);
module.factory('stackTraceService', require('./js/stackTraceService.js'));
module.factory('vskoLogger', require('./js/errorLogService.js'));
module.exports = module;
