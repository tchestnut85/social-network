const router = require('express').Router();
const {
    getAllThoughts,
    getOneThought,
    createThought,
    updateThought,
    deleteThought
} = require('../../controllers/thought-controller');

// Thought routes to GET all Thoughts and POST a Thought
router.route('/').get(getAllThoughts).post(createThought);

// Thought routes to GET one Thought, PUT an updated Thought and DELETE a Thought
router.route('/:id').get(getOneThought).put(updateThought).delete(deleteThought);

// router.route().post('/thoughts/:thoughtId/reactions')

module.exports = router;