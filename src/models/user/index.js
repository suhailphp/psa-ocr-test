'use strict';
const appConfig = require('../../configurations/appConfig.js')
const debug = require('debug')(appConfig.APP_NAME + ':Model:User')
const Moment = require('moment');
const Joi = require('joi');

module.exports = (SequelizeDB, DataTypes) => {

    let User =
        SequelizeDB.define(
            'User',
            {
                UserName: {
                    type: DataTypes.STRING,
                    unique: true,
                    primaryKey: true,
                    schema: Joi.string().min(2).max(30).required().label('User Name')
                },
                FullNameEn: {
                    type: DataTypes.STRING,
                    description: 'User`s full name',
                    allowNull: false,
                    schema: Joi.string().required().label('Full Name English')
                },
                FullNameAr: {
                    type: DataTypes.STRING,
                    description: 'User`s full name Arabic',
                    allowNull: false,
                    schema: Joi.string().required().label('Full Name Arabic')
                },
                UserType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    schema: Joi.string().required().label('User Type')
                },
                Email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    schema: Joi.string().required().label('User Type')
                },
                Mobile: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    schema: Joi.string().allow('').regex(/^(971)\d{9}$/gm).required().min(12).max(12).label('Mobile Number')
                },
                Language: {
                    type: DataTypes.STRING(2),
                    allowNull: false,
                    defaultValue: () => 'ar'
                },
                ADLogin: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                    schema: Joi.boolean().label('Active Directory Login')
                },

                Password: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                },
                PasswordSalt: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                },

                LicenseNumber:{
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                LicenseIssueDate:{
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                LicenseExpiryDate:{
                    type: DataTypes.DATE,
                    allowNull: true,
                },

                Active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                    schema: Joi.boolean().label('Active')
                },
                CreatedOn: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW
                },
                UpdatedOn: {
                    type: DataTypes.DATE,
                    allowNull: true
                }
            }
        );

    User.associate = models => {

        /**
         * With Users Table
         */
        models
            .User
            .belongsTo(models.User, {
                // onDelete: "CASCADE",
                as: 'UserCreatedBy',
                foreignKey: {
                    name: 'UserCreatedUserName',
                    allowNull: true
                }
            });
        models
            .User
            .belongsTo(models.User, {
                // onDelete: "CASCADE",
                as: 'UserUpdatedBy',
                foreignKey: {
                    name: 'UserUpdatedUserName',
                    allowNull: true
                }
            });



    };


    return User;
};

