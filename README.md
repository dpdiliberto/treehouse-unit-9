#  User and Course REST API
A REST API to provide the ability to view and add users, and view, add, update, and delete the courses associated with given users. The API requires users to log in to retrieve user information, and to update and delete courses on their account.

## How to use
1. Run `npm install` in order to install the project's dependencies
2. Run `npm run seed` to seed / initialize user and course data in the database
3. Run `npm start` and access the API using http://localhost:5000

## Routes
### Users
* GET /api/users - returns the currently authenticated user
* POST /api/users - creates a new user

### Courses
* GET /api/courses - returns a list of all courses, as well as the user that owns the course
* GET /api/courses/:id - returns the corresponding course, as well as the user that owns that course
* POST /api/courses - creates a new course
* PUT /api/courses/:id - updates the corresponding course
* DELETE /api/courses/:id - deletes the corresponding course
