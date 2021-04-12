const express = require('express');
const { User, Course } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');

// Construct a router instance
const router = express.Router();

// Route that gets a list of courses
router.get('/', asyncHandler(async(req, res) => {
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
    const course = await Course.findOne({ 
        where: {
            id: id
        },
        include: {
            model: User
        }
    });
    res.status(200).json(course);
}));

// Route that creates a new course
router.post('/', asyncHandler(async(req, res) => {
    try {
        await Course.create(req.body);
        res.location('/');
        res.status(201).json({message: 'Course created'});
    } catch(error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        }
    }
}));

// Route that updates a course
router.put('/:id', asyncHandler(async(req, res) => {
    try {
        const id = req.params.id;
        let course = await Course.findOne({ 
            where: {
                id: id
            }
        });
        if (course) {
            await course.update(req.body);
            res.status(204).json({message: 'Course updated'});
        } else {
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
router.delete('/:id', asyncHandler(async(req, res) => {
    const id = req.params.id;
    let course = await Course.findOne({ 
        where: {
            id: id
        }
    });
    if (course) {
        await course.destroy(req.body);
        res.status(204).json({message: 'Course deleted'});
    } else {
        res.status(404).json({message: 'Course does not exist'});
    }
}));

module.exports = router;

