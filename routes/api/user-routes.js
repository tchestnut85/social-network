const router = require('express').Router();
const {
    getAllUsers,
    getOneUser,
    createUser,
    addFriend,
    updateUser,
    deleteUser,
    removeFriend
} = require('../../controllers/user-controller');

// User routes to GET all user and POST a user
router.route('/').get(getAllUsers).post(createUser);

// User routes to GET one user, PUT an updated user and DELETE a user
router.route('/:id').get(getOneUser).put(updateUser).delete(deleteUser);

// POST to add a friend to a user's friend list, and DELETE to remove a friend
// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;