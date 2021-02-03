'use strict'

const appConfig = require('../configurations/appConfig.js')
const debug = require('debug')(appConfig.APP_NAME + ":CONTROLLER-OCR.js");
const i18n = require("i18n");
const {gatekeeper} = require('../middlewares/index');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const Tesseract = require('tesseract.js');
// const worker =  Tesseract.createWorker(
//     {logger: m => console.log(m)}
// );
const PSM = Tesseract.PSM
const OEM = Tesseract.OEM



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

                let fileData = await readFile('./files/test.png')

                // let timeout = 0
                // for(let i=1;i<=20;i++){
                //     if(i%5 == 0){
                //         timeout = timeout+30000
                //         setTimeout(() => { doWorker(fileData,i); }, timeout);
                //     }
                //     else{
                //         setTimeout(() => { doWorker(fileData,i); }, timeout);
                //     }
                // }



                try{
                    let worker =  Tesseract.createWorker(
                        //{logger: m => console.log(m)}
                    );

                    await worker.load();
                    await worker.loadLanguage('eng+ara');
                    await worker.initialize('eng+ara');

                    // await worker.loadLanguage('eng');
                    // await worker.initialize('eng');


                    await worker.setParameters({
                        // tessedit_ocr_engine_mode:OEM.TESSERACT_ONLY,
                        // tessedit_pageseg_mode:PSM.AUTO_ONLY,
                        // tessjs_create_hocr: '0',
                        // tessjs_create_tsv:'0',
                        // tessjs_create_box:'0',
                        // tessjs_create_unlv:'0',
                        // tessjs_create_osd:'0',
                    });

                    const resData = await worker.recognize(fileData,
                        //{logger: m => console.log(m)}
                    );

                    debug('DATA GOT ');
                    //await worker.terminate();

                    data.text = resData.data.hocr
                    data.lines = resData.data.blocks[0].page.blocks[0].paragraphs[0].lines

                    //console.log(resData.data.blocks)
                    console.log(resData.data.text)
                    // data.layout= null
                    // //res.render('hocr', data)
                    res.render('form', data)
                }
                catch (error){
                    //await worker.terminate();
                    console.log('some error ->'+error)
                    //res.send(error.message)
                }



            })


    async function doWorker(fileData,id=0){

        try{

            debug('Start ' +id);
            fs.unlink('./eng.traineddata', (err) => {

            });

            fs.unlink('./ara.traineddata', (err) => {

            });

            let worker =  Tesseract.createWorker(
                //{logger: m => console.log(m)}
            );

            // Tesseract.detect(fileData, { logger: m => console.log(m) })
            //     .then(({ data }) => {
            //         console.log(data);
            //     });

           // const scheduler = createScheduler();

            await worker.load();
            await worker.loadLanguage('eng+ara');
            await worker.initialize('eng+ara');

            // await worker.loadLanguage('eng');
            // await worker.initialize('eng');


            await worker.setParameters({
                tessedit_ocr_engine_mode:OEM.TESSERACT_ONLY,
                tessedit_pageseg_mode:PSM.AUTO_ONLY,
                tessjs_create_hocr: '0',
                tessjs_create_tsv:'0',
                tessjs_create_box:'0',
                tessjs_create_unlv:'0',
                tessjs_create_osd:'0',
            });

            const resData = await worker.recognize(fileData,
                //{logger: m => console.log(m)}
                );

            debug('DATA GOT ' +id);
            //await worker.terminate();

            //console.log(resData.data.blocks)
            console.log(resData.data.text)




            // data.text = resData.data.hocr
            // data.lines = resData.data.blocks[0].page.blocks[0].paragraphs[0].lines

            //res.send(resData.data.blocks[0].page.blocks[0].paragraphs[0].lines[0].text)

            //for pdf
            // const { data:pdfData } = await worker.getPDF('Tesseract OCR Result');
            // fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(pdfData));
            // console.log('Generate PDF: tesseract-ocr-result.pdf');
            //end pdf

            // data.layout= null
            // //res.render('hocr', data)
            // res.render('form', data)
        }
        catch (error){
            //await worker.terminate();
            console.log('some error ->'+error)
            //res.send(error.message)
        }
    }


    return Router
}