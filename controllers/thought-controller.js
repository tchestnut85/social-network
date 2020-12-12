const { Thought } = require('../models');

const thoughtController = {
    // GET all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ field: 'desc' })
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
            .sort({ field: 'desc' })
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
            .then(thoughtData => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: thoughtData._id } },
                    { new: true }
                );
            })
            .then(thoughtData => {
                res.json(thoughtData);
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
                res.json(thoughtData);
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
                res.json(thoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE a Thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No Thought found with that ID.' });
                }
                res.json(thoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE to remove a reaction
    // /api/thoughts/:thoughtId/reactions
    removeReaction(req, res) {

    }
};

module.exports = thoughtController;