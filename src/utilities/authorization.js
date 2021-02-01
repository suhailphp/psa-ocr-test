const _ = require('underscore')
const i18n = require("i18n");


module.exports.getSideMenu = function (userType, url) {

    let menuList = [
        {
            module: "Home",
            title: "Home",
            allow: [ 'ADMIN', 'DRIVER','ENGINEER'],
            url: '/',
            icon: 'nav-icon fas fa-tachometer-alt',
        },


        {
            module: "OCR",
            title: "Ocr test",
            allow: ['ADMIN'],
            url: '/ocr',
            icon: 'nav-icon fas fa-file',
            notification: '',
            subMenu: null
        },
        {
            module: "Users",
            title: "Users",
            allow: ['ADMIN'],
            url: '/users',
            icon: 'nav-icon fas fa-users',
            notification: '',
            subMenu: null
        },

        {
            module: "Settings",
            title: "Settings",
            allow: ['ADMIN'],
            url: null,
            icon: 'nav-icon fas fa-cogs',
            subMenu: [


                {
                    module: "Logs",
                    title: "User Logs",
                    allow: ['ADMIN'],
                    url: '/logs',
                    icon: 'nav-icon fas fa-list',
                }
            ]
        }
    ]
    return getMenu(userType, menuList)
}


function getMenu(userType, menuList) {
    let newMenu = []
    menuList.forEach(function (item, index) {
        if (item.subMenu) {
            if (_.find(item.allow, function (item) {
                return item == userType;
            }) == userType) {
                let Menu = item
                Menu.subMenu = getMenu(userType,item.subMenu)
                newMenu.push(Menu)
            }
        }
        else{
            if (_.find(item.allow, function (item) {
                return item == userType;
            }) == userType){
                newMenu.push(item)
            }
        }
    });

    return(newMenu)

}

