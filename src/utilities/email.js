'use strict'
const appConfig = require('../configurations/appConfig.js')
// const debug = require('debug')(appConfig.APP_NAME + ":EMAIL.js");
const nodemailer = require("nodemailer");
const nodemailerNTLMAuth = require('nodemailer-ntlm-auth');
// const Handlebars = require('handlebars');
// const fs = require('fs');
// const path = require('path');
// const i18next = require('i18next');
// const Backend = require('i18next-node-fs-backend');
// const {readdirSync, lstatSync} = require('fs');
// const {join} = require('path')

// i18next
//     .use(Backend)
//     .init({
//         // initImmediate: false,
//         // preload: readdirSync(join(__dirname, '../locales')).filter((fileName) => {
//         //     const joinedPath = join(join(__dirname, '../locales'), fileName)
//         //     const isDirectory = lstatSync(joinedPath).isDirectory()
//         //     return isDirectory
//         // }),
//         backend: {
//             loadPath: join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
//             // addPath: join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
//             jsonIndent: 4,
//         },
//         interpolation: {
//             escapeValue: false
//         },
//         fallbackLng: ['ar', 'en'],
//         ns: ['translation'],
//         namespace: "transaction",
//         defaultNS: 'translation',
//         lng: 'ar',
//         // debug: true,
//         // saveMissing: true,
//         // updateMissing: true,
//         // appendNamespaceToMissingKey: true,
//         // saveMissingTo: "all",
//         // saveMissingPlurals: false,
//         // whitelist: ['ar', 'en'],
//         // react: {
//         //     wait: false
//         // }
//     })

// Handlebars.registerHelper('t', function (object, options) {
//     return i18next.t(object)
// })


module.exports = {
    sendEmailWithoutTemplate,
    // send: sendEmailWithTemplate
}


const configTransport = {
    host: appConfig.EMAIL['HOST'],
    port: appConfig.EMAIL['PORT'],
    secure: false,
    tls: {rejectUnauthorized: false},
    auth: {
        type: 'custom',
        method: 'NTLM',
        user: appConfig.EMAIL['USERNAME'],
        pass: appConfig.EMAIL['PASSWORD']
    },
    customAuth: {
        NTLM: nodemailerNTLMAuth
    }
}

async function sendEmailWithoutTemplate({to, cc, bcc, subject, body, /*attachments*/}) {

    try {
        // for (let t of to)
        //     if (!local.validateEmail(t))
        //         throw new Error('Invalid Email Address')
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(configTransport);

        let mailOptions = {
            from: appConfig.EMAIL['SENDER'],
            to,
            cc,
            bcc,
            subject,
            html: body
        };
        // if (attachments.length)
        //     mailOptions.attachments = attachments

        let info = await transporter.sendMail(mailOptions)

        console.log("Message sent: %s", info.messageId, ` To: ${info.accepted}, Time: ${info.messageTime}ms `);
        transporter.close()
        return

    } catch (e) {
        throw e
    }
}


// async function sendEmailWithTemplate({to, cc, bcc, subject, data, template}) {
//
//     try {
//         let body, attachments = []
//         if (template) {
//             if (['text', 'table'].indexOf(template) >= 0) {
//                 let html = await local.compile(template)
//
//                 if (data.lng === 'ar') {
//                     await i18next.changeLanguage('ar')
//                     data.dir = 'rtl'
//                 } else {
//                     await i18next.changeLanguage('en')
//                     data.lng = 'en'
//                     data.dir = 'ltr'
//                 }
//
//                 body = html(data)
//             } else {
//                 throw new Error(`Invalid template name (${template}) provided`)
//             }
//         } else {
//             body = data.body
//         }
//         if (data.attachments) {
//             for (let attachment of data.attachments) {
//                 attachments.push({filename: attachment.fileName, content: fs.createReadStream(attachment.filePath)})
//             }
//         }
//
//         return await sendEmailWithoutTemplate({to, cc, bcc, subject, body, attachments})
//     } catch (e) {
//         throw e
//     }
// }


// const local = {
//     validateEmail: function (emailAddress) {
//         //let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//         //return re.test(emailAddress);
//         return true;
//     },
//
//     compile: async function (fname) {
//         try {
//             const tempPath = path.join(__dirname, `../views/mail_templates/min/${fname}.hbs`)
//             const exists = await fs.existsSync(tempPath)
//
//             if (!exists) {
//                 new Error('Template not exist')
//             }
//
//             const source = await fs.readFileSync(tempPath, 'utf8')
//             return Handlebars.compile(source.toString());
//
//         } catch (e) {
//             throw e
//         }
//     },
//
//     loadPartial: (fname) => {
//         const tempPath = path.join(__dirname, `../views/mail_templates/min/${fname}.hbs`)
//         const exists = fs.existsSync(tempPath)
//
//         if (!exists) {
//             new Error('Partial not exist')
//         }
//
//         const source = fs.readFileSync(tempPath, 'utf8')
//
//         return source.toString()
//     }
// }

// Handlebars.registerPartial('user-info', local.loadPartial('user-info'));
// Handlebars.registerPartial('footer', local.loadPartial('footer'));
