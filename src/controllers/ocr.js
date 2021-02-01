'use strict'

const appConfig = require('../configurations/appConfig.js')
const debug = require('debug')(appConfig.APP_NAME + ":CONTROLLER-OCR.js");
const i18n = require("i18n");
const {gatekeeper} = require('../middlewares/index');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const Tesseract = require('tesseract.js');
const worker =  Tesseract.createWorker(
    {logger: m => console.log(m)}
);




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

                    let fileData = await readFile('./files/testDoc.jpg')

                    // Tesseract.detect(fileData, { logger: m => console.log(m) })
                    //     .then(({ data }) => {
                    //         console.log(data);
                    //     });


                    debug('START');
                    await worker.load();
                    debug('LOADED');
                    await worker.loadLanguage('eng+ara');
                    debug('LANGUAGE loadLanguage');
                    await worker.initialize('eng+ara');
                    debug('LANGUAGE initialize');
                    const resData = await worker.recognize(fileData);
                    debug('DATA GOT');
                    //await worker.terminate();

                    //console.log(resData.data.blocks)
                    data.text = resData.data.hocr
                    data.lines = resData.data.blocks[0].page.blocks[0].paragraphs[0].lines
                    //res.send(resData.data.blocks[0].page.blocks[0].paragraphs[0].lines[0].text)

                    //for pdf
                    // const { data:pdfData } = await worker.getPDF('Tesseract OCR Result');
                    // fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(pdfData));
                    // console.log('Generate PDF: tesseract-ocr-result.pdf');
                    //end pdf
                    res.render('form', data)
                }
                catch (error){
                    //await worker.terminate();
                    console.log('some error ->'+error)
                    res.send(error.message)
                }



            })


    return Router
}