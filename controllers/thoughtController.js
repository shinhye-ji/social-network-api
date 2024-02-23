const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getThoughts(req, res) {
    try {
      const thought = await Thought.find();
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      await thought.save();

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createThought(req, res) {
    try {
      const { userId } = req.params;
      const { thoughtText } = req.body;

      const thought = await Thought.create({ thoughtText });

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'Thought created, but no user with this ID.' });
      };

      user.thoughts.push(thought._id); 

      await user.save();

      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user and associated apps
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      const user = User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with this ID.'});
      }

      res.json({ message: 'User and associated thoughts have been deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update user 
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true , new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },


    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true , new: true }
            );
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            };
            res.json(thought);
        } catch(err) {
            res.status(500).json(err)
        }
    },

    async deleteReaction(req, res) {
        try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }

        res.json({ message: 'User and associated reactions deleted!' })
        } catch(err) {
            res.status(500).json(err)
        }
    }
};