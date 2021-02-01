'use strict'

const appConfig = require('../configurations/appConfig.js')
const debug = require('debug')(appConfig.APP_NAME + ":CONTROLLER-USERS.js");
const i18n = require("i18n");
const activeDirectory = require('activedirectory');
const {gatekeeper} = require('../middlewares/index');
const Utils = require('../utilities');
const breadcrumbs = require('../utilities/breadcrumbs');
const moduleName = i18n.__('Users')
const base_url = '/users/';
const {textEmail} = require('../utilities/email');
const {CreateLogs} = require('../utilities/logs');
const ping = require('ping');

//for side bar activate class
let currentPage = 'Users';
let mainPage = 'Users';

module.exports = (Router, Models) => {


    Router
        .get('/login',
            (req, res, next) => {
                let username = req.flash('username')
                if (username && username != '')
                    username = username.replace('@psa.local', '')
                return res.render('login', {layout: '', userName: username, rurl: req.query.rurl})
            })

    Router
        .post('/login',
            (req, res, next) => {

                let username = req.body.userName;
                let password = req.body.password;
                let MFA = appConfig.MFA
                debug(username, "*****")

                if (!username || !password) {
                    req.flashE(req.__('Username and Password must be provided.')).then(() => {
                        res.redirect(base_url + 'login')
                    }).catch(e => {
                        next(e)
                    })
                } else {
                    Models
                        .User
                        .findOne(
                            {
                                where: {UserName: username, Active: true},
                                include: [
                                    {
                                        model: Models.User,
                                        as: 'UserCreatedBy'
                                    },
                                    {
                                        model: Models.User,
                                        as: 'UserUpdatedBy'
                                    }
                                ]
                            })
                        .then(UserResp => {
                            if (UserResp) {
                                if(UserResp.ADLogin){
                                    ping.sys.probe(appConfig.DOMAIN.url, function(isAlive){
                                        if(isAlive){
                                            let ad = new activeDirectory(appConfig.DOMAIN);
                                            //debug(ad)
                                            if (username.indexOf('@p') == -1)
                                                username += '@psa.local'
                                            if (username.indexOf('@psa.ac.ae') != -1)
                                                username = username.replace('@psa.ac.ae', '@psa.local')
                                            ad.authenticate(username, password, function (err, auth) {
                                                debug(err, auth)
                                                if (auth) {
                                                    req.session.UserName = username.replace('@psa.local', '')
                                                    if(MFA.ACTIVE){
                                                        if(typeof req.session.authCode != 'undefined' && req.body.authActive == 'true'){
                                                            if(req.body.authCode == req.session.authCode){
                                                                delete req.session.authCode
                                                                CreateLogs(Models,'login','success',username);
                                                                res.json({error: false, message: req.__('Login Successful.'), auth: false})
                                                            }
                                                            else{
                                                                if(req.body.resend == 'true'){
                                                                    textEmail({
                                                                        subject: req.__('Authentication code from PSA Transport '),
                                                                        data: {
                                                                            body: '<div style="direction: rtl;"><strong>مرحباً، ' + UserResp.FullNameAr + '</strong><br>' +
                                                                                req.__('Your Authentication Code is ')+ '<strong>'+req.session.authCode +'</storng>'
                                                                        },
                                                                        to: [ UserResp.Email]
                                                                    }).then(()=>{
                                                                        res.json({error: false, message: req.__('Authentication code send again'), auth: true})
                                                                    }).catch(e => console.error(e))
                                                                }
                                                                else{
                                                                    CreateLogs(Models,'login','failed',username);
                                                                    res.json({error: false, message: req.__('Authentication code is wrong'), auth: true})
                                                                }
                                                            }
                                                        }
                                                        else{
                                                            let authCode = Math.floor(1000 + Math.random() * 9000);
                                                            req.session.authCode = authCode;
                                                            debug('Authentication code is ',authCode)
                                                            textEmail({
                                                                subject: req.__('Authentication code from PSA Transport '),
                                                                data: {
                                                                    body: '<div style="direction: rtl;"><strong>مرحباً، ' + UserResp.FullNameAr + '</strong><br>' +
                                                                        req.__('Your Authentication Code is ')+ '<strong>'+authCode+'</storng>'
                                                                },
                                                                to: [ UserResp.Email]
                                                            }).then(()=>{
                                                                res.json({error: false, message: req.__('Please enter authentication code'), auth: true})
                                                            }).catch(e => console.error(e))
                                                        }
                                                    }
                                                    else{
                                                        CreateLogs(Models,'login','success',username);
                                                        res.json({error: false, message: req.__('Login Successful.'), auth: false})
                                                    }


                                                } else if (!auth || err.message == 'InvalidCredentialsError') {
                                                    res.json({error: true, message: req.__('Unauthorized, You dont have Permission.'), auth: false})
                                                } else {
                                                    debug(err)
                                                    return next(err)
                                                }
                                            });
                                        }
                                        else{
                                            res.json({error: true, message: req.__('Active Directory Server not reachable'), auth: false})
                                        }
                                    });

                                }
                                else {
                                    req.session.UserName = username

                                    let PasswordHash = Utils.crypto.getHash(password, UserResp.PasswordSalt)
                                    if (UserResp.Password === PasswordHash) {
                                        req.session.UserName = username
                                        if(MFA.ACTIVE){
                                            if(typeof req.session.authCode != 'undefined' && req.body.authActive == 'true'){
                                                if(req.body.authCode == req.session.authCode){
                                                    delete req.session.authCode
                                                    CreateLogs(Models,'login','success',username);
                                                    res.json({error: false, message: req.__('Login Successful.'), auth: false})
                                                }
                                                else{
                                                    if(req.body.resend == 'true'){
                                                        textEmail({
                                                            subject: req.__('Authentication code from PSA Transport '),
                                                            data: {
                                                                body: '<div style="direction: rtl;"><strong>مرحباً، ' + UserResp.FullNameAr + '</strong><br>' +
                                                                    req.__('Your Authentication Code is ')+ '<strong>'+req.session.authCode +'</storng>'
                                                            },
                                                            to: [ UserResp.Email]
                                                        }).then(()=>{
                                                            res.json({error: false, message: req.__('Authentication code send again'), auth: true})
                                                        }).catch(e => console.error(e))
                                                    }
                                                    else{
                                                        CreateLogs(Models,'login','failed',username);
                                                        res.json({error: false, message: req.__('Authentication code is wrong'), auth: true})
                                                    }
                                                }
                                            }
                                            else{
                                                let authCode = Math.floor(1000 + Math.random() * 9000);
                                                req.session.authCode = authCode;
                                                debug('Authentication code is ',authCode)
                                                textEmail({
                                                    subject: req.__('Authentication code from PSA Transport '),
                                                    data: {
                                                        body: '<div style="direction: rtl;"><strong>مرحباً، ' + UserResp.FullNameAr + '</strong><br>' +
                                                            req.__('Your Authentication Code is ')+ '<strong>'+authCode+'</storng>'
                                                    },
                                                    to: [ UserResp.Email]
                                                }).then(()=>{
                                                    res.json({error: false, message: req.__('Please enter authentication code'), auth: true})
                                                }).catch(e => console.error(e))
                                            }
                                        }
                                        else{
                                            CreateLogs(Models,'login','success',username);
                                            res.json({error: false, message: req.__('Login Successful.'), auth: false})
                                        }

                                    }
                                    else{
                                        res.json({error: true, message: req.__('Unauthorized, You dont have Permission.'), auth: false})
                                    }
                                }


                            } else {
                                req.flash('username', username)
                                req.flashE(req.__('Unauthorized, You don\'t have Permission.')).then(() => {
                                    res.redirect(base_url + 'login')
                                }).catch(e => {
                                    next(e)
                                })
                            }
                        })
                }

            })

    Router
        .get('/add',
            gatekeeper.authorization(['ADMIN']),
            (req, res, next) => {

                let isAdmin = false

                if (req.User.UserType === 'ADMIN')
                    isAdmin = true
                else
                    isAdmin = false

                let data = {
                    title: req.__('Add Users'),
                    breadcrumb: breadcrumbs.init(__filename, moduleName).add('Add Users'),
                    currentPage,
                    mainPage,
                    isAdmin,
                    User:{Active: true,ADLogin:true,Mode:'Add'}
            }
                return res.render('form', data)

            })

    Router
        .get('/',
            gatekeeper.authorization(['ADMIN']),
            async (req, res, next) => {
                var isAjaxRequest = req.xhr;

                let isAdmin = false
                if (req.User.UserType === 'ADMIN')
                    isAdmin = true
                else
                    isAdmin = false
                try {
                    if (!isAjaxRequest) {
                        let data = {
                            title: req.__('List Users'),
                            breadcrumb: Utils.breadcrumbs.init(__filename, moduleName).add('List Users'),
                            currentPage,
                            mainPage,
                        }
                        data.isAdmin = isAdmin
                        return res.render('list', data)
                    } else {

                        //debug(req.query)
                        var searchQuery = req.query.search ? req.query.search.value : '';

                        var draw = parseInt(req.query.draw);
                        var start = parseInt(req.query.start);
                        var length = parseInt(req.query.length);

                        let order = req.query.order ? req.query.order[0] : {columns: 'CreatedOn', dir: 'ASC'};
                        var orderCol = 'CreatedOn'
                        switch (parseInt(order.column)) {
                            case 0:
                                // orderCol = 'UserName' //bug in module on primary key
                                break;
                            case 1:
                                orderCol = 'FullName' + (req.language == 'ar' ? 'Ar' : 'En')
                                break;
                            case 2:
                                orderCol = Models.Sequelize.literal('UserCreatedBy.FullName' + (req.language == 'ar' ? 'Ar' : 'En'))
                                break;
                            case 3:
                                orderCol = 'UserType'
                                break;
                            case 4:
                                orderCol = 'CreatedOn'
                                break;
                            case 5:
                                orderCol = 'Active'
                                break;
                        }

                        let where = {
                            $or: [
                                {UserName: {$like: '%' + searchQuery + '%'}},
                                {['FullName' + (req.language == 'ar' ? 'Ar' : 'En')]: {$like: '%' + searchQuery + '%'}},
                                {UserType: {$like: '%' + searchQuery + '%'}},
                            ]
                        }




                        // if (!isAdmin)
                        //     where.$and = {$or: [{SectionID: sections}, {SectionID: null}]}

                        let respList = await Models.User.findAndCountAll(
                            {
                                where,
                                order: [
                                    [orderCol, order['dir']]
                                ],
                                limit: length,
                                offset: start,
                                include: [
                                    {
                                        model: Models.User,
                                        as: 'UserCreatedBy',
                                    }
                                ]
                            })


                        return res.json({
                            data: respList.rows,
                            "draw": draw,
                            "recordsTotal": respList.count,
                            "recordsFiltered": respList.count,
                        })
                    }
                } catch (e) {
                    next(e)
                }

            })

    Router
        .get('/:UserName/edit',
            gatekeeper.authorization(['ADMIN']),
            (req, res, next) => {
                let isAdmin
                if (req.User.UserType === 'ADMIN')
                    isAdmin = true
                else
                    isAdmin = false

                let data = {
                    title: req.__('Update Users'),
                    breadcrumb: breadcrumbs.init(__filename, moduleName).add('Update Users'),
                    currentPage:'Users',
                }
                let where = {
                    UserName: req.params.UserName
                }
                Models
                    .User
                    .findOne({
                        where: where
                    })
                    .then(UserResp => {
                        if (!UserResp)
                            // throw new NotFoundError()
                            next(new Error('404'))
                        else {
                            data.User = UserResp
                            data.User.Mode = 'Edit';
                            data.isAdmin = isAdmin
                            return res.render('form', data)
                        }
                    })
                    .catch(e => {
                        next(e)
                    })

            });
    Router
        .get('/:UserName/view',
            gatekeeper.authorization(['ADMIN', 'USER']),
            (req, res, next) => {

                let isAdmin
                if (req.User.UserType === 'ADMIN')
                    isAdmin = true
                else
                    isAdmin = false

                let data = {
                    title: req.__('View Users Profile'),
                    breadcrumb: breadcrumbs.init(__filename, moduleName).add('View Users Profile'),
                    currentPage,
                    mainPage,
                }
                let where = {
                    UserName: req.params.UserName
                }
                Models
                    .User
                    .findOne({
                        where: where
                    })
                    .then(UserResp => {
                        if (!UserResp)
                            // throw new NotFoundError()
                            next(new Error('404'))
                        else {
                            data.User = UserResp

                            data.isAdmin = isAdmin
                            return res.render('view', data)

                        }
                    })
                    .catch(e => {
                        next(e)
                    })

            })

    Router
        .post('/',
            gatekeeper.authorization(['ADMIN']),
            async (req, res, next) => {

                req.body.Active = req.body.Active || false
                req.body.UserCreatedUserName = req.User.UserName

                let UserResp = await Models.User.findOne({where: {UserName: req.body.UserName}})

                if (UserResp) {
                    UserResp.FullNameEn = req.body.FullNameEn
                    UserResp.FullNameAr = req.body.FullNameAr
                    UserResp.Email = req.body.Email
                    UserResp.Mobile = req.body.Mobile
                    UserResp.MilitaryNumber = req.body.MilitaryNumber
                    UserResp.UserType = req.body.UserType
                    UserResp.Active = (req.body.Active)?req.body.Active:false
                    UserResp.ADLogin = (req.body.ADLogin)?req.body.ADLogin:false
                    UserResp.UserUpdatedUserName = req.User.UserName

                    if(req.User.UserType == 'DRIVER'){
                        UserResp.LicenseNumber = req.body.LicenseNumber
                        UserResp.LicenseExpiryDate = req.body.LicenseExpiryDate
                        UserResp.LicenseIssueDate = req.body.LicenseIssueDate
                    }
                    if(req.body.Password !=''){
                        const {passwordSalt, passwordHash} = Utils.crypto.getHashSalt(req.body.Password)
                        UserResp.Password = passwordHash
                        UserResp.PasswordSalt = passwordSalt
                    }

                    await UserResp.save()
                        .then(async () => {
                            CreateLogs(Models,'user','edit',req.User.UserName,UserResp.UserName);
                            await req.flashS(req.__('User Updated Successfully.'))
                            return res.redirect(base_url)
                        })
                        .catch(async error => {
                            req.referer = base_url +req.body.UserName+ 'edit';
                            await req.flash('User', req.body)
                            next(error);
                        })
                } else{

                    delete req.body.Mode
                    delete req.body.EditUserName

                    if(req.body.Password !=''){
                        const {passwordSalt, passwordHash} = Utils.crypto.getHashSalt(req.body.Password)
                        req.body.Password = passwordHash
                        req.body.PasswordSalt = passwordSalt
                    }

                    await Models
                        .User
                        .create(req.body, {validate: true})
                        .then(async function (UserResp) {
                            CreateLogs(Models,'user','add',req.User.UserName,UserResp.UserName);
                            await req.flashS(req.__('User Created Successfully.'))
                            return res.redirect(base_url)
                        })
                        .catch(async error => {
                            req.referer = base_url + 'add';
                            await req.flash('User', req.body)
                            next(error);
                        })

                }


            });

    Router
        .put('/:UserName/status',
            gatekeeper.authorization(['ADMIN']),
            (req, res, next) => {

                Models
                    .User
                    .findOne({
                        where: {
                            UserName: req.params.UserName
                        }
                    })
                    .then(UserResp => {

                        if (!UserResp)
                            return next(new Error(404))

                        UserResp.Active = !UserResp.Active
                        UserResp
                            .save()
                            .then(() => {

                                if(UserResp.Active){
                                    CreateLogs(Models,'user','enable',req.User.UserName,UserResp.UserName);
                                    req.flashS(req.__('Status Enabled')).then(() => {
                                        res.redirect(base_url)
                                    }).catch(e => {
                                        next(e)
                                    })
                                }
                                else{
                                    CreateLogs(Models,'user','disable',req.User.UserName,UserResp.UserName);
                                    req.flashE(req.__('Status Disabled')).then(() => {
                                        res.redirect(base_url)
                                    }).catch(e => {
                                        next(e)
                                    })
                                }

                            })
                            .catch(e => {
                                next(e)
                            })
                    })
            })

    Router
        .get('/:UserName/ADUserAjax',
            (req, res, next) => {
                let ad = new activeDirectory(appConfig.DOMAIN);
                let username = req.params.UserName;
                if (username.indexOf('@p') == -1)
                    username += '@psa.local'
                if (username.indexOf('@psa.ac.ae') != -1)
                    username = username.replace('@psa.ac.ae', '@psa.local')

                ad.findUser(username,function (err, user) {
                    console.log(user)
                    if(user){
                        //console.log(user)
                        return res.send({FullNameEn:user.displayName,FullNameAr:user.description,Email:user.mail})
                    }
                    else {
                        return res.send(false)
                    }

                });
            });
    Router
        .get('/:UserName/CheckUserName',
            async (req, res, next) => {
                let user = await Models.User.findOne({where:{UserName:req.params.UserName}});
                if(user && user.UserName == req.params.UserName){
                    return res.send(true)
                }
                else{
                    return res.send(false)
                }
            });


    return Router
}