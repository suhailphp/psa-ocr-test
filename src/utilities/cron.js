'use strict'
const CronJob = require('cron').CronJob;
const appConfig = require('../configurations/appConfig.js')
const debug = require('debug')(appConfig.APP_NAME + ":CRON.js");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const {sendSMS} = require('../modules/SMS')
const i18n = require('i18n')

module.exports = {
    start: (Models) => {
        console.log('cron.start')
        const job = new CronJob('*/5  * * * * *', async function () {

            try {

                job.stop();
                debug('work stop');
                await findSMSJob(Models)
                await findJob(Models)
                job.start();
                debug('work start');
                return

            }
            catch (e) {
                console.error(e)
                job.start()

            }

        });

        job.start();

    },

    startGarbageCollector: () => {

        const job = new CronJob('00 00 03 * * *', async function () {

            try {

                job.stop()
                const d = new Date();
                console.log('Garbage Collector at:', d);

                var deleteFolderRecursive = async function(path) {
                    if( fs.existsSync(path) ) {
                        fs.readdirSync(path).forEach( async function(file,index){
                            var curPath = path + "/" + file;
                            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                                await deleteFolderRecursive(curPath);
                            } else { // delete file
                                fs.unlinkSync(curPath);
                            }
                        });
                        fs.rmdirSync(path);
                    }
                };
                await deleteFolderRecursive(appConfig.FILES_TEMP_PATH)
                await fs.mkdirSync(appConfig.FILES_TEMP_PATH)
                job.start()

            } catch (e) {
                console.error(e)
                job.start()
            }

        });

        job.start();
    }
}

var findJob = async (Models) => {
    try {
        let notificationResp = await Models.Notification.findOne({
            where: {},
            include: [{

                model: Models.NotificationUser,
                include: [{model: Models.User}],
                where: {
                    IsEmailSent: false
                }
            }]
        })

        let data = {to: ''}
        if (!notificationResp) {
            return
        }

        for (let c = 0; c < notificationResp.NotificationUsers.length; c++) {

            if (notificationResp.NotificationUsers[c].User.Language === 'ar') {
                data.subject = notificationResp.TitleAr
                data.body = notificationResp.BodyAr
            } else {
                debug('en')
                data.subject = notificationResp.TitleEn
                data.body = notificationResp.BodyEn
            }

            data.to = notificationResp.NotificationUsers[c].User.Email

            await sendEmail(data)

            notificationResp.NotificationUsers[c].IsEmailSent = true;
            notificationResp.NotificationUsers[c].EmailSentOn = new Date();
            await notificationResp.NotificationUsers[c].save()
        }

    } catch (e) {
        throw e
    }
}

var findSMSJob = async (Models) => {
    try {
        let notificationResp = await Models.Notification.findOne({
            where: {},
            include: [{
                model: Models.NotificationUser,
                include: [{model: Models.User}],
                where: {
                    IsSMSSent: false,
                    SMS: true
                }
            }]
        })

        if (!notificationResp) {
            return
        }

        for (let c = 0; c < notificationResp.NotificationUsers.length; c++) {

            let message
            if (notificationResp.NotificationUsers[c].User.Language === 'ar') {
                i18n.setLocale('ar')
                message = notificationResp.TitleAr
            } else {
                i18n.setLocale('en')
                message = notificationResp.TitleEn
            }

            let mobile = notificationResp.NotificationUsers[c].User.Mobile
            if (
                /^(00971|971|\+971)\d{9}$/gm.test(mobile)
            ) {
                let smsResp = await sendSMS(mobile, message)
                notificationResp.NotificationUsers[c].SMSReference = smsResp.MessageId;
                notificationResp.NotificationUsers[c].IsSMSSent = true;
                notificationResp.NotificationUsers[c].SMSSentOn = new Date();
            }else{
                notificationResp.NotificationUsers[c].SMS = false;
            }
            await notificationResp.NotificationUsers[c].save()
        }

    } catch (e) {
        throw e
    }
}


var sendEmailDummy = async () => {

    return new Promise(function (resolve) {
        setTimeout(function () {
            debug('email sent')
            resolve()
        }, 5000)
    });
}
const configTransport = {
    host: appConfig.EMAIL['HOST'],
    port: appConfig.EMAIL['PORT'],
    secure: false,
    tls: {rejectUnauthorized: false},
    authMethod: 'ntlm',
    auth: {
        user: appConfig.EMAIL['USERNAME'],
        pass: appConfig.EMAIL['PASSWORD']
    }
}

async function sendEmail(data) {
    debug(data)
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(configTransport);

        let mailOptions = {
            from: appConfig.EMAIL['SENDER'],
            to: data.to,
            subject: data.subject,
            html: data.body
        };

        // await  sendEmailDummy()
        // return;
        let info = await transporter.sendMail(mailOptions)

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (e) {
        console.error('Email ex', e)
        throw e
    }
}

