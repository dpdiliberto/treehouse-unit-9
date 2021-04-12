const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-handler');

// Construct a router instance
const router = express.Router();

// Route that gets a list of users
router.get('/', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser;
    console.log(user);
    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

// Router that creates a new user
router.post('/', asyncHandler(async(req, res) => {
    try { 
        const userReq = req.body;
        await User.create( req.body );
        res.status(201).json({"message": "User successfully created!"});
    } catch(error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router;