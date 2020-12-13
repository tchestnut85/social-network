const { User, Thought } = require('../models');

const userController = {
    // GET all users
    getAllUsers(req, res) {
        User.find({})
            .select('-__v')
            .sort({ createdAt: 'desc' })
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // GET one user by ID
    getOneUser({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .sort({ createdAt: 'desc' })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with that ID.' });
                    return;
                }
                res.json(userData);
            });
    },

    // POST a new user
    createUser({ body }, res) {
        User.create(body)
            .then(userData => {
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },

    // POST to add a friend to a user's friendlist
    // /api/users/:userId/friends/:friendId
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with that ID.' });
                    return;
                }
                res.json({ message: `The user was added to your friend list.`, userData });
            })
            .catch(err => res.status(400).json(err));
    },

    // PUT - update a user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with that ID.' });
                    return;
                }
                res.json({ message: 'The user was updated.', userData });
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE a user and the user's associated thoughts
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with that ID.' });
                }
                return Thought.deleteMany(
                    { username: userData.username },
                    { new: true, runValidators: true }
                )
                    .then(thoughtData => {
                        res.json({ message: `The user ${userData.username} was deleted.`, userData, thoughtData });
                    });
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE a friend from a user's friendlist
    // /api/users/:userId/friends/:friendId
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with that ID.' });
                    return;
                }
                res.json({ message: "That user was removed from your friend list.", userData });
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;