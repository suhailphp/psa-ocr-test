'use strict'

const appConfig = require('../configurations/appConfig.js')
const debug = require('debug')(appConfig.APP_NAME + ":CONTROLLER-VehicleType.js");
const i18n = require("i18n");
const {gatekeeper} = require('../middlewares/index');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const {createWorker} = require('tesseract.js');
const worker =  createWorker();




const Utils = require('../utilities');
const breadcrumbs = require('../utilities/breadcrumbs');
const moduleName = i18n.__('Ocr')
const base_url = '/ocr/';



let currentPage = 'OCR';

module.exports = (Router, Models) => {
    // options are csrfProtection, parseForm



    Router
        .get('/',
            gatekeeper.authorization(['ADMIN']),
            async (req, res, next) => {

                let data = {
                    title: req.__('OCR'),
                    breadcrumb: Utils.breadcrumbs.init(__filename, moduleName).add('view OCR'),
                    currentPage,
                    CurrentDate: new Date()
                }

                res.render('home',data)



            })

    Router
        .get('/process',
            gatekeeper.authorization(['ADMIN']),
            async (req, res, next) => {

                let data = {
                    title: req.__('OCR'),
                    breadcrumb: Utils.breadcrumbs.init(__filename, moduleName).add('view OCR'),
                    currentPage,
                    CurrentDate: new Date()
                }

                try{
                    let fileData = await readFile('./files/img_2.png')

                    await worker.load();
                    await worker.loadLanguage('eng+ara');
                    await worker.initialize('eng+ara');
                    // await worker.setParameters({
                    //     tessjs_create_pdf: '1',
                    // });
                    const {data: {text}} = await worker.recognize(fileData);
                    await worker.terminate();
                    data.text = text
                    res.render('form', data)
                }
                catch (error){
                    console.log('some error ->'+error)
                    res.send(error.message)
                }



            })


    return Router
}