let i18n = require("i18n");
let moment = require("moment");
const dateformat = require('dateformat');
// const appConfig = require('../../config/app')
// var debug = require('debug')(appConfig.APP_NAME + ":VIEW_HELPER.js");

module.exports = {

    __: function (val, b) {
        // debug(val)
        return i18n.__(val, b);
    },
    dateToStringSimple: function (date) {

        if (!date || typeof date != 'object')
            return null;
        return moment(date).format('MM-DD-YYYY h:mm:ss');

    },
    dateToStringDateSimple: function (date) {

        if (!date || typeof date != 'object')
            return null;
        return moment(date).format('MM-DD-YYYY');

    },
    dateToStringDate: function (date) {

        if (!date || typeof date != 'object')
            return null;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var month_ar;
        switch (month) {
            case 1:
                month_ar = "Jan";
                break;
            case 2:
                month_ar = "Feb";
                break;
            case 3:
                month_ar = "Mar";
                break;
            case 4:
                month_ar = "Apr";
                break;
            case 5:
                month_ar = "May";
                break;
            case 6:
                month_ar = "Jun";
                break;
            case 7:
                month_ar = "Jul";
                break;
            case 8:
                month_ar = "Aug";
                break;
            case 9:
                month_ar = "Sep";
                break;
            case 10:
                month_ar = "Oct";
                break;
            case 11:
                month_ar = "Nov";
                break;
            case 12:
                month_ar = "Dec";
                break;
            default:
                month_ar = "";
                break;

        }
        var date_ar = month_ar + " " + day + ", " + year;
        return date_ar;

    },
    monthNumberToStringMonth: function (month) {

        var month_ar;
        switch (month) {
            case 1:
                month_ar = "Jan";
                break;
            case 2:
                month_ar = "Feb";
                break;
            case 3:
                month_ar = "Mar";
                break;
            case 4:
                month_ar = "Apr";
                break;
            case 5:
                month_ar = "May";
                break;
            case 6:
                month_ar = "Jun";
                break;
            case 7:
                month_ar = "Jul";
                break;
            case 8:
                month_ar = "Aug";
                break;
            case 9:
                month_ar = "Sep";
                break;
            case 10:
                month_ar = "Oct";
                break;
            case 11:
                month_ar = "Nov";
                break;
            case 12:
                month_ar = "Dec";
                break;
            default:
                month_ar = "";
                break;

        }
        return month_ar;

    },
    numberPrettify: function (val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    dateToStringDateTime: function (date, lng) {
        if (!date)
            return ''
        moment.locale(lng)
        let newDate = moment(date).format('D MMM YYYY, h:mm:ss A');
        moment.locale('en')
        return newDate

    },


    dateToStringDateTimeBR: function (date, lng) {
        if (!date)
            return ''
        moment.locale(lng)
        let newDate = moment(date).format('D MMM YYYY<br>h:mm:ss A');
        moment.locale('en')
        return newDate

    },
    dateToStringTime: function (date, lng) {
        if (!date)
            return ''
        moment.locale(lng)
        let newDate = moment(date).format('h:mm:ss A');
        moment.locale('en')
        return newDate

    },



    timeDifferenceTwoDates: function(startDate,endDate,lng){


        let days	= 24*60*60,
            hours	= 60*60,
            minutes	= 60;

        let passed = 0, d=0, h, m, s;

        passed = Math.floor((endDate - startDate) / 1000);


        // Number of days passed
        d = Math.floor(passed / days);
        passed -= d*days;

        // Number of hours left
        h = Math.floor(passed / hours);
        passed -= h*hours;

        // Number of minutes left
        m = Math.floor(passed / minutes);
        passed -= m*minutes;

        if(lng == 'ar'){
            return (' '+d+' أيام '+h+' ساعات '+m+' الدقائق')
        }
        else{
            return (' '+d+' Days '+h+' Hours '+m+' minutes')
        }

    },

    KMDifference: function(startKM,endKM){


       return(endKM-startKM)

    },



    OR: function (a, b) {
        if (a)
            return a;
        else
            return b || '';
    },

    compare: function (lvalue, operator, rvalue, options) {

        var operators, result;

        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }

        operators = {
            '==': function (l, r) {
                return l == r;
            },
            '===': function (l, r) {
                return l === r;
            },
            '!=': function (l, r) {
                return l != r;
            },
            '!==': function (l, r) {
                return l !== r;
            },
            '<': function (l, r) {
                return l < r;
            },
            '>': function (l, r) {
                return l > r;
            },
            '<=': function (l, r) {
                return l <= r;
            },
            '>=': function (l, r) {
                return l >= r;
            },
            'typeof': function (l, r) {
                return typeof l == r;
            }
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    },

    inc: function (value, incValue, options) {
        return parseInt(value) + (typeof incValue === 'int' ? incValue : 1);
    },

    dec: function (value, incValue, options) {
        return parseInt(value) - (typeof incValue === 'int' ? incValue : 1);
    },

    '?': function (lvalue, operator, rvalue, value1, value2) {
        //eg {{? ../LNG '==' 'ar' tFullNameAr FullName}}

        if (arguments.length == 6) {
            var operators = {
                '==': function (l, r) {
                    return l == r;
                },
                '===': function (l, r) {
                    console.log(l, r)
                    return l === r;
                },
                '!=': function (l, r) {
                    return l != r;
                },
                '!==': function (l, r) {
                    return l !== r;
                },
                '<': function (l, r) {
                    return l < r;
                },
                '>': function (l, r) {
                    return l > r;
                },
                '<=': function (l, r) {
                    return l <= r;
                },
                '>=': function (l, r) {
                    return l >= r;
                },
                'typeof': function (l, r) {
                    return typeof l == r;
                }
            };

            if (!operators[operator]) {
                throw new Error("Handlerbars Helper '?' doesn't know the operator " + operator);
            }

            return operators[operator](lvalue, rvalue) ? value1 : value2
        } else if (arguments.length == 4) {

            return lvalue ? operator : rvalue

        } else {
            throw new Error("Handlerbars Helper '?' needs 3 or 5 parameters");
        }
    },

    notificationTimeAgo: function (CreatedOn) {

        let currentTime = new Date().getTime()
        if (CreatedOn) {
            CreatedOn = new Date(CreatedOn).getTime()

        }
        let dif = currentTime - CreatedOn

        /** Sec */
        dif = dif / 1000
        let sec = parseInt(dif)
        if (sec < 60)
            return 'Just now'

        /** Min */
        dif = dif / 60
        let min = parseInt(dif)
        if (min < 60)
            return `${min } min`

        /** Hr */
        dif = dif / 60
        let hour = parseInt(dif)
        if (hour < 24)
            return `${hour} hr` + (hour > 1 ? 's' : '')


        /** Day */
        dif = dif / 24
        let day = parseInt(dif)

        if (day < 30)
            return `${day } day` + (day > 1 ? 's' : '')
        /** Month */
        dif = dif / 30
        let month = parseInt(dif)
        if (month < 12)
            return `${month} Month` + (month > 1 ? 's' : '')

        /** year */
        dif = dif / 12
        let year = parseInt(dif)
        return `${year} Year` + (year > 1 ? 's' : '')

    },
    trim: function (text, limit) {
        if (text)
            return text.substr(0, limit) + (text.length > limit ? '...' : '')
        else return ''
    },

    json: function (obj) {
        if (obj)
            return (JSON.stringify(obj)).replace(/(['"])/g, '\\$1').replace(/\\n/g, "\\\n")
                .replace(/\\'/g, "\\\'")
                .replace(/\\"/g, '\\\"')
                .replace(/\\&/g, "\\\&")
                .replace(/\\r/g, "\\\r")
                .replace(/\\t/g, "\\\t")
                .replace(/\\b/g, "\\\b")
                .replace(/\\f/g, "\\\f")
        else
            return ''
    },

    currencyFormat: function(amount){
        return (amount.toFixed(2))
    },

    dateToChrome: function (date) {
        date = dateformat(date,"yyyy-mm-dd");
        return date;
    },
    countOne:function(number){
        return(parseInt(number)+1)
    },

    insertEmptyRow: function (AnswerCount,HighestAnswerCount) {
        let tr = ''
        for(let i=AnswerCount;i<HighestAnswerCount;i++){
            tr = tr.concat('<tr ><td >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td></tr>');
        }
        return tr;
    }


}