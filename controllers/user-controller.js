const { User } = require('../models');

const userController = {
    // GET all users
    getAllUsers(req, res) {
        User.find({})
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .sort({ field: 'desc' })
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // GET one user by ID
    getOneUser({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .sort({ field: 'desc' })
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
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with that ID.' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },

    // PUT - update a user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with that ID.' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE a user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with that ID.' });
                }
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE a friend from a user's friendlist
    // /api/users/:userId/friends/:friendId
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with that ID.' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;