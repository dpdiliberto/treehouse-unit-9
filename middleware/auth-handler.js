'use strict';
const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.authenticateUser = async(req, res, next) => {
    let message;
    const credentials = auth(req);
    console.log('Hi 1');

    if (credentials) {
        const user = await User.findOne({where: {emailAddress: credentials.name} });
        console.log('Hi 2');
        console.log(credentials);

        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            console.log(`${credentials.pass}, ${user.password}`);
            console.log('Hi 3');

            if (authenticated) {
                console.log(`Authenication successful for email address: ${credentials.name}`);
                req.currentUser = user;
                console.log('Hi 4');
            } else {
                message = `Authentication failed for email address: ${credentials.name}`;
            }
        } else {
            message = `User not found for email address: ${credentials.name}`;
        }
    } else {
        message = `Auth header not found`;
    }

    if (message) {
        res.status(401).json({message: message});
    } else {
        next();
    }
}