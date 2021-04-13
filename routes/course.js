const express = require('express');
const { User, Course } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
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
router.post('/', authenticateUser, asyncHandler(async(req, res) => {
    try {

        console.log(req.body);
        // Create new course based on request body
        await Course.create( req.body );
        console.log('Hello');
        res.status(201).json({message: 'Course created'});
    } catch(error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// Route that updates a course
router.put('/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const id = req.params.id;

        // Query course based on id parameter
        let course = await Course.findOne({ 
            where: {
                id: id
            },
            include: {
                model: User
            }
        });

        // Check if course exists to delete it or respond with 404
        if (course) {

            // Create variables for the authenticated user's id and for the course's user id
            const authUserId = req.currentUser.dataValues.id
            const courseUserId = course.dataValues.User.dataValues.id;

            // Confirm authenticated user matches course's user
            if (authUserId === courseUserId){
                await course.update(req.body);
                res.status(204).json({message: 'Course updated'});
            } else {
                res.status(403).json({message: 'You do not have permission to update this course'});
            }
        } else {
            console.log('Hello');
            res.status(404).json({message: 'Course does not exist'});
        }
    } catch(error){
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        }
    }
}));

// Route that updates a course
router.delete('/:id', authenticateUser, asyncHandler(async(req, res) => {
    const id = req.params.id;

    // Query course based on id parameter
    let course = await Course.findOne({ 
        where: {
            id: id
        },
        include: {
            model: User
        }
    });

    // Check if course exists to delete it or respond with 404
    if (course) {

        // Create variables for the authenticated user's id and for the course's user id
        const authUserId = req.currentUser.dataValues.id
        const courseUserId = course.dataValues.User.dataValues.id;

        // Confirm authenticated user matches course's user
        if (authUserId === courseUserId){
            await course.destroy(req.body);
            res.status(204).json({message: 'Course deleted'});
        } else {
            res.status(403).json({message: 'You do not have permission to delete this course'});
        }
    } else {
        res.status(404).json({message: 'Course does not exist'});
    }
}));

module.exports = router;

