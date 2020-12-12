const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use the routes
app.use(require('./routes'));

// Connect to the MONGODB_URI database or the local DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network', {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// log the queries being executed
mongoose.set('debug', true);

// Start the app
app.listen(PORT, () => console.log(`App listening on port ${PORT}.`));