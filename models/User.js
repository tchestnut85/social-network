const { Schema, model } = require('mongoose');

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
        ]
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
// UserSchema.virtual('friendCount').get(function () {
//     return this.friends.reduce((total, friends) => total + friends.length + 1, 0);
// });

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;