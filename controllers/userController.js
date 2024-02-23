const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find()
        .populate('friends')
        .populate('thoughts');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate('friends')
        .populate('thoughts');
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user and associated apps
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update user 
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true , new: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
      const { friendId, userId } = req.params;
      try {
        const updatedUser = await User.findOne({ _id: userId });
        updatedUser.friends.push(friendId);
        await updatedUser.save();
        res.json(updatedUser);

      } catch (err) {
          res.status(500).json(err);
      }
    },

    async removeFriend(req, res) {
      try {
        const friend = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: { friendsId: req.params.friendsId } } },
          { runValidators: true, new: true }
        );

        if (!friend) {
          return res.status(404).json({ message: 'No friend with that username!' });
        }

        res.json(friend);
      } catch (err) {
        res.status(500).json(err);
      }
    }
}; 
