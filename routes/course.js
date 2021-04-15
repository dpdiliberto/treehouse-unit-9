const express = require('express');
const { User, Course } = require('../models');
const { asyncHandler, actionHandler, validationErrorHandler } = require('../middleware/router-helpers');
const { authenticateUser } = require('../middleware/auth-handler');

// Construct a router instance
const router = express.Router();

// Route that gets a list of courses
router.get('/', asyncHandler(async(req, res) => {
    //Query for all courses
    const courses = await Course.findAll({
        include: {
            model: User
        }
    });
    res.status(200).json(courses);
}));

// Route that retrieves a course by id
router.get('/:id', asyncHandler(async(req, res) => {
    const id = req.params.id;

    // Query course based on request parameter
    const course = await Course.findOne({ 
        where: {id: id },
        include: {
            model: User
        }
    });
    res.status(200).json(course);
}));

// Route that creates a new course
router.post('/', authenticateUser, asyncHandler(async(req, res, next) => {
    try {
        // Create new course based on request body
        const course = await Course.create( req.body );
        res.status(201).location(`/course/${course.id}`).end();
    }  catch(error) {
        res.error = error;
        next();
    }
}), validationErrorHandler);

// Route that updates a course
router.put('/:id', authenticateUser, actionHandler('update'), validationErrorHandler);

// Route that updates a course
router.delete('/:id', authenticateUser, actionHandler('delete'), validationErrorHandler);

module.exports = router;

