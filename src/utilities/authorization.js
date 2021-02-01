const _ = require('underscore')
const i18n = require("i18n");


module.exports.getSideMenu = function (userType, url) {

    let menuList = [
        // {
        //     module: "Home",
        //     title: "Home",
        //     allow: [ 'ADMIN', 'DRIVER','ENGINEER'],
        //     url: '/',
        //     icon: 'nav-icon fas fa-tachometer-alt',
        // },

        {
            module: "Survey",
            title: "Survey",
            allow: ['ADMIN'],
            url: '/survey',
            icon: 'nav-icon fas fa-poll',
        },



        {
            module: "Category",
            title: "Category",
            allow: ['ADMIN'],
            url: '/category',
            icon: 'nav-icon fas fa-folder',
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
                },
                {
                    module: "Field",
                    title: "Fields",
                    allow: ['ADMIN'],
                    url: '/field',
                    icon: 'nav-icon fas fa-keyboard',
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

