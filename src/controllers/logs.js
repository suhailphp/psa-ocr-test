'use strict'

const appConfig = require('../configurations/appConfig.js')
const debug = require('debug')(appConfig.APP_NAME + ":CONTROLLER-VehicleType.js");
const i18n = require("i18n");
const activeDirectory = require('activedirectory');
const {gatekeeper} = require('../middlewares/index');

let dateformat = require('dateformat');


const Utils = require('../utilities');
const breadcrumbs = require('../utilities/breadcrumbs');
const moduleName = i18n.__('Logs')
const base_url = '/logs/';


//for side bar activate class
let currentPage = 'Logs';
let mainPage = 'Settings';

module.exports = (Router, Models) => {
    // options are csrfProtection, parseForm





    Router
        .get('/',
            gatekeeper.authorization(['ADMIN']),
            async (req, res, next) => {

                let data = {
                    title: req.__('Logs'),
                    breadcrumb: Utils.breadcrumbs.init(__filename, moduleName).add('view Logs'),
                    currentPage,
                    mainPage,
                    CurrentDate:new Date()
                }

                return res.render('list', data)

            })



    Router
        .get('/table/:From/:To',
            gatekeeper.authorization(['ADMIN']),
            async (req, res, next) => {

                let From = dateformat(req.params.From,"yyyy-mm-dd")+' 00:00:00.000';
                let To = dateformat(req.params.To,"yyyy-mm-dd")+' 23:59:59.999';
                return res.render('table',{layout:null,From,To})

            })



    Router
        .get('/tableData/:From/:To',
            gatekeeper.authorization(['ADMIN']),
            async (req, res, next) => {

                let From = dateformat(req.params.From,"yyyy-mm-dd")+' 00:00:00.000';
                let To = dateformat(req.params.To,"yyyy-mm-dd")+' 23:59:59.999';

                let searchQuery = req.query.search ? req.query.search.value : '';

                let draw = parseInt(req.query.draw);
                let start = parseInt(req.query.start);
                let length = parseInt(req.query.length);

                let order = req.query.order ? req.query.order[0] : {columns: 'CreatedOn', dir: 'DESC'};
                let orderCol = 'CreatedOn'
                switch (parseInt(order.column)) {

                    case 0:
                        orderCol = 'Type'
                        break;
                    case 1:
                        orderCol = Models.Sequelize.literal('User.FullName' + (req.language == 'ar' ? 'Ar' : 'En'))
                        break;
                    case 2:
                        orderCol = 'CreatedOn'
                        break;

                }

                let where = {
                    CreatedOn: {
                        $between: [From, To]
                    }
                }

                //debug(where)

                let respList = await Models.Logs.findAndCountAll(
                    {
                        where:where,
                        order: [
                            [orderCol, order['dir']]
                        ],
                        limit: length,
                        offset: start,
                        include: [
                            {
                                model: Models.User,
                                as: 'User',
                            }
                        ]
                    })


                return res.json({
                    data: respList.rows,
                    "draw": draw,
                    "recordsTotal": respList.count,
                    "recordsFiltered": respList.count,
                })
            })







    return Router
}