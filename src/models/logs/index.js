'use strict';
const appConfig = require('../../configurations/appConfig.js')
const debug = require('debug')(appConfig.APP_NAME + ':Model:User')
const Moment = require('moment');
const Joi = require('joi');


module.exports = (SequelizeDB, DataTypes) => {

    let Logs =
        SequelizeDB.define(
            'Logs',
            {
                LogsID: {
                    type: DataTypes.INTEGER,
                    autoIncrement:true,
                    primaryKey: true
                },
                TargetID: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                Type:{
                    type: DataTypes.STRING
                },
                Mode:{
                    type: DataTypes.STRING,
                    allowNull: true
                },
                Info: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                CreatedOn: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW
                }
            }
        );

    Logs.associate = models => {

        models
            .Logs
            .belongsTo(models.User, {
                // onDelete: "CASCADE",
                as: 'User',
                foreignKey: {
                    name: 'UserName',
                    allowNull: true
                }
            });


    };


    return Logs;
};

