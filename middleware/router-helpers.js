const { User, Course } = require('../models');

// Handler function to wrap each route.
exports.asyncHandler = (cb) => {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (error) {
        // Forward error to the global error handler
        next(error);
      }
    }
  }

/** Handler function to update or delete a resource depending on inputted action
* @param string - action that will be taken - can be 'update' or 'delete
*/ 
exports.actionHandler = function(action) {
  return async (req, res, next) => {
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
                // Take action based on parameter
                if (action === 'update') {
                  await course.update(req.body);
                  res.status(204).json();
                } else if (action === 'delete') {
                  await course.destroy(req.body);
                  res.status(204).json();
                }
            } else {
                res.status(403).json();
            }
        } else {
            res.status(404).json();
        }
    }  catch(error) {
        res.error = error;
        next();
    }
  }
};

// Function to check for validation errors, map them, and display them to user
exports.validationErrorHandler = (req, res) => {
  if (res.error.name === 'SequelizeValidationError' || res.error.name === 'SequelizeUniqueConstraintError') {
      const errors = res.error.errors.map(err => err.message);
      res.status(400).json({ errors });
  } else {
      throw res.error;
  }
};