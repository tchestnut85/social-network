const { Thought, User } = require('../models');

const thoughtController = {
    // GET all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .sort({ createdAt: 'desc' })
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // GET one thought by ID
    getOneThought({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ createdAt: 'desc' })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No Thought found with that ID.' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // POST a new Thought
    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought found with that ID.' });
                    return;
                }
                res.json({ message: 'Your thought was posted!', thoughtData });
            })
            .catch(err => res.status(400).json(err));
    },

    // POST to add a reaction
    // /api/thoughts/:thoughtId/reactions
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought found with that ID.' });
                    return;
                }
                res.json({ message: 'Your reaction was added to this thought.', thoughtData });
            })
            .catch(err => res.status(400).json(err));
    },

    // PUT - update a Thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No Thought found with that ID.' });
                    return;
                }
                res.json({ message: 'Your thought was updated.', thoughtData });
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE a Thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No Thought found with that ID.' });
                    return;
                }
                return User.findOneAndUpdate(
                    { username: thoughtData.username },
                    { $pull: { thoughts: { id: req.params.id } } },
                    { new: true, runValidators: true }
                )
                    .then(thoughtData => {
                        res.json({ message: 'Your thought was deleted.', thoughtData });
                    });
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE to remove one reaction from a thought
    // /api/thoughts/:thoughtId/reactions/:reactionId
    removeOneReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No reaction found with that ID.' });
                    return;
                }
                res.json({ message: 'Your reaction was removed from the thought.', thoughtData });
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE to remove all reactions from a thought
    // /api/thoughts/:thoughtId/reactions/:reactionId
    removeAllReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: req.body } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No reaction found with that ID.' });
                    return;
                }
                res.json({ message: 'All reactions removed from this thought.', thoughtData });
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = thoughtController;