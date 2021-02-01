'use strict'
var i18n = require("i18n");
var path = require('path');

Array.prototype.add = function (title, link, active, _translate = true) {
    this.push({title: _translate ? i18n.__(title) : title, link: link || '#', active: active || false})
    return this;
}

module.exports = {
    init: function (fileName, moduleName, _translate = true) {
        if (!fileName && !moduleName)
            return []

        var controllerPath = '/' + path.basename(fileName).replace('.js', '');

        var breadCrumb = [
            {title: _translate ? i18n.__(moduleName) : moduleName, link: controllerPath, active: true}
        ]
        return breadCrumb;

    },
}