'use strict'

const appConfig = require('../configurations/appConfig.js')
const debug = require('debug')(appConfig.APP_NAME + ":CONTROLLER-VehicleType.js");
const i18n = require("i18n");
const activeDirectory = require('activedirectory');
const {gatekeeper} = require('../middlewares/index');

let dateformat = require('dateformat');


const Utils = require('../utilities');
const breadcrumbs = require('../utilities/breadcrumbs');
const moduleName = i18n.__('Ocr')
const base_url = '/ocr/';



let mainPage = 'OCR';

module.exports = (Router, Models) => {
    // options are csrfProtection, parseForm



    Router
        .get('/',
            gatekeeper.authorization(['ADMIN']),
            async (req, res, next) => {

                res.send('hai')

            })










    return Router
}