const router = require('express').Router();
const {
    getAllThoughts,
    getOneThought,
    createThought,
    addReaction,
    updateThought,
    deleteThought,
    removeOneReaction,
    removeAllReaction
} = require('../../controllers/thought-controller');

// Thought routes to GET all Thoughts and POST a Thought
router.route('/').get(getAllThoughts).post(createThought);

// Thought routes to GET one Thought, PUT an updated Thought and DELETE a Thought
router.route('/:id').get(getOneThought).put(updateThought).delete(deleteThought);

// POST to create a reaction and DELETE to remove all reactions from a thought
// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction).delete(removeAllReaction);

// DELETE to remove one reaction from a thought
router.route('/:thoughtId/reactions/:reactionId').delete(removeOneReaction);

module.exports = router;