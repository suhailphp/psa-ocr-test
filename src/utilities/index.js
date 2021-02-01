'use strict';

const Fs = require('fs');
var appConfig = require('../configurations/appConfig');
var debug = require('debug')(appConfig.APP_NAME + ':Util.index')
const path = require('path');

Fs.readdirSync(__dirname)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== 'index.js'))
    .forEach((file) => {
        debug('module.exports', file)
        module.exports[file.replace('.js', '')] = require(path.join(__dirname, file))

    });
