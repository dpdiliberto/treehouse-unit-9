'use strict';
const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Function for authenticating user
exports.authenticateUser = async(req, res, next) => {
    let message;
    const credentials = auth(req);

    // Confirm credentials have been set
    if (credentials) {
        // If credentials exist, find the corresponding user
        const user = await User.findOne({where: {emailAddress: credentials.name} });

        // Confirm corresponding user exists
        if (user) {
            // Compare the user's password to the authenticated user's password
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);

            // Confirm passwords match
            if (authenticated) {
                // Authentication is successful authenticated user is set to request's current user
                console.log(`Authenication successful for email address: ${credentials.name}`);
                req.currentUser = user;
            } else {
                message = `Authentication failed for email address: ${credentials.name}`;
            }
        } else {
            message = `User not found for email address: ${credentials.name}`;
        }
    } else {
        message = `Auth header not found`;
    }

    // If there is an error send 401 error and message
    if (message) {
        res.status(401).json({message: 'Access denied'});
    } else {
        next();
    }
}