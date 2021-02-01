'user strict'
var appConfig = require('../configurations/appConfig.js')
var debug = require('debug')(appConfig.APP_NAME + ":UTIL-NOTIFICATION.js");
var i18n = require('i18n')
var ioe = require('socket.io-emitter')({host: 'localhost', port: 6379});

module.exports = {

    create: async (Models, NotificationTemplate, URL, UserNames, NotificationCreatedUserName, SMS = false) => {

        let transaction
        NotificationTemplate = 'notification_templates>>' + NotificationTemplate

        try {
            i18n.setLocale('en')
            var data = {
                TitleEn: i18n.__mf('HELP DESK') + ' - ' + i18n.__mf(NotificationTemplate + '>>title'),
                TitleAr: '',
                BodyEn: i18n.__mf(NotificationTemplate + '>>body', {
                    URL,
                    FeedbackURL: URL.replace('/view', '/feedback')
                }) + i18n.__mf('Regards'),
                BodyAr: '',
                URL: URL,
                NotificationCreatedUserName: NotificationCreatedUserName
            }
            var nEng = {
                subject: data.TitleEn,
                body: data.BodyEn
            }
            i18n.setLocale('ar')
            data.TitleAr = i18n.__mf('HELP DESK') + ' - ' + i18n.__mf(NotificationTemplate + '>>title')
            data.BodyAr = i18n.__mf(NotificationTemplate + '>>body', {
                URL,
                FeedbackURL: URL.replace('/view', '/feedback')
            }) + i18n.__mf('Regards')
            var nAr = {
                subject: data.TitleAr,
                body: data.BodyAr
            }

            /**
             * DB Transaction started
             **/

            transaction = await Models.SequelizeDB.transaction();
            let notificationResp = await Models.Notification.create(data, {transaction})
            let nUsers = []
            for (let e = 0; e < UserNames.length; e++) {
                nUsers.push({
                    NotificationID: notificationResp.NotificationID,
                    Email: true,
                    PushNotification: false,
                    SMS,
                    UserName: UserNames[e]
                })
            }
            await Models.NotificationUser.bulkCreate(nUsers, {transaction})

            await transaction.commit()

            for (let e = 0; e < UserNames.length; e++) {
                let user = await Models.User.findOne({where: {UserName: UserNames[e]}, attributes: ['Language']})
                if (user.Language === 'en')
                    setTimeout(() => ioe.to(UserNames[e]).emit('message', nEng), 2000)
                if (user.Language === 'ar')
                    setTimeout(() => ioe.to(UserNames[e]).emit('message', nAr), 2000)
            }
            return true;
        } catch (e) {
            await transaction.rollback()
            debug(e)
            return false
        }

    },

    createPushNotification: async (Models, Message, URL, UserNames) => {

        try {
            let link = `<a href="${URL}">Click here</a>`

            for (let e = 0; e < UserNames.length; e++) {
                let user = await Models.User.findOne({where: {UserName: UserNames[e]}, attributes: ['Language']})
                if (user.Language === 'en')
                    setTimeout(() => ioe.to(UserNames[e]).emit('message', {
                        subject: Message,
                        body: Message + ' ' + link
                    }), 1000)
                if (user.Language === 'ar')
                    setTimeout(() => ioe.to(UserNames[e]).emit('message', {
                        subject: Message,
                        body: Message + ' ' + link
                    }), 1000)
            }
            return true;
        } catch (e) {
            debug(e)
            return false
        }

    },

    getTop5: async (Models, UserName) => {

        let List = await Models.SequelizeDB.query(`
                        SELECT TOP (5) [Notification].[NotificationID], [Notification].[TitleAr],[Notification].[TitleEn], [Notification].[CreatedOn], [NotificationUsers].[MarkRead]
                          FROM [Notifications] as [Notification] INNER join [NotificationUsers]  
                          ON [Notification].[NotificationID] = [NotificationUsers].[NotificationID] AND [NotificationUsers].[UserName] = N'${UserName}'
                          ORDER BY [Notification].[CreatedOn] DESC  
                `, {type: Models.Sequelize.QueryTypes.SELECT})

        let NotificationLength = await Models.Notification.count({
            include: [
                {
                    model: Models.NotificationUser,
                    where: {
                        UserName: UserName,
                        MarkRead: false
                    }
                }
            ]
        })
        return {List, NotificationLength}
    },

}