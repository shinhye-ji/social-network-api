const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
        type: String,
        unique: true,
        required: true,
        trimmed: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+\..+/, 'Must be a valid email.']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'thought',
        },
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema
  .virtual('friendCount')
  .get(function () {
    return this.friends.length;
  });

// Initialize User model
const User = model('user', userSchema);

const handleError = (err) => console.error(err);

User
  .create({
    username: 'minecraftLuvr69',
    email: 'georgejumper@gmail.com',
  })
  .then(result => console.log('Created new user', result))
  .catch(err => handleError(err));

module.exports = User;
