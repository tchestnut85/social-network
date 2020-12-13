const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: 'You must enter a username.',
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: 'You must enter an email address.',
            match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
            trim: true
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dayjs(createdAtVal).format('MMM DD, YYYY h:mm a')
        }
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// total count of friends a user has
UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;