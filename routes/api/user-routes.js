const router = require('express').Router();
const {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser
} = require('../../controllers/user-controller');

// User routes to GET all user and POST a user
router.route('/').get(getAllUsers).post(createUser);

// User routes to GET one user, PUT an updated user and DELETE a user
router.route('/:id').get(getOneUser).put(updateUser).delete(deleteUser);

module.exports = router;