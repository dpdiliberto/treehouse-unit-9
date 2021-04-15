const express = require('express');
const db = require('../models');
const User = db.User;
const { asyncHandler, validationErrorHandler } = require('../middleware/router-helpers');
const { authenticateUser } = require('../middleware/auth-handler');

// Construct a router instance
const router = express.Router();

// Route that gets a list of users
router.get('/', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser;

    // Respond with firstName, lastName, emailAddress of authenticated user
    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

// Router that creates a new user
router.post('/', asyncHandler(async(req, res, next) => {
    try { 
        // Create new user based on request body
        await User.create( req.body );
        res.status(201).location('/').end();
    } catch(error) {
        res.error = error;
        next();
    }
}), validationErrorHandler);

module.exports = router;