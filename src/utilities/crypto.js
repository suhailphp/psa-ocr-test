'use strict'
const crypto = require('crypto');


module.exports = {
    getHash: (password, salt) => {
        return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    },
    getHashSalt: (password) => {
        let passwordSalt = crypto.randomBytes(16).toString('hex');
        let passwordHash = crypto.pbkdf2Sync(password, passwordSalt, 1000, 64, `sha512`).toString(`hex`);
        return {passwordSalt, passwordHash}
    },
}