const Driver = require('../models/Driver');
const Manager = require('../models/Manager');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /users
// @access  Private
const getAllUsers = async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select('-password').lean();

  //   If no users
  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' });
  }

  res.json(users);
};

// @desc    Create new user
// @route   POST /users
// @access  Private
const createNewUser = async (req, res) => {
  const { username, password, firstName, lastName, roles, phone } = req.body;

  // Confirm data
  if (!username || !password || !firstName || !lastName || !roles) {
    res.status(400);
    throw new Error('Please fill out the required fields');
  }

  // Check for duplicate username
  const duplicate = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    res.status(409);
    throw new Error('Duplicate username');
  }

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password, firstname: firstName, lastname: lastName }
      : { username, password, firstname: firstName, lastname: lastName, roles };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    //created
    if (!phone)
      throw new Error('Phone number is required to create this user.');

    try {
      let profileCreation;
      if (roles && roles.includes('Manager')) {
        profileCreation = await Manager.create({
          user: user._id,
          phone,
        });
      } else if (roles && roles.includes('Driver')) {
        profileCreation = await Driver.create({
          user: user._id,
          phone,
        });
      }

      if (!profileCreation) {
        // If the creation of Manager/Driver profile fails, roll back user creation
        await User.findByIdAndDelete(user._id);

        res.status(400);
        throw new Error('Failed to create manager/driver profile');
      }

      // Both user and profile creation successful
      res.status(201).json({ message: `New user '${username}' created` });
    } catch (error) {
      // Handle any errors during profile creation
      if (user) {
        await User.findByIdAndDelete(user._id);
      }

      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data received');
  }
};

// @desc    Update a user
// @route   PATCH /users
// @access  Private
const updateUser = async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    res.status(400);
    throw new Error('All fields except password are required');
  }

  // Does the user exist to update?
  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  // Check for duplicate
  const duplicate = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(409);
    throw new Error('Duplicate username');
  }

  // Check if the incoming values are different from the existing user
  const isUpdated =
    user.username !== username ||
    JSON.stringify(user.roles) !== JSON.stringify(roles) ||
    user.active !== active;

  if (!isUpdated && !password) {
    res.status(204).end();
    console.log('Nothing new to update');
    return;
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
};

// @desc    Delete a user
// @route   DELETE /users
// @access  Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    res.status(400);
    throw new Error('User ID Required');
  }

  // Does the user still have assigned notes?
  //   const note = await Note.findOne({ user: id }).lean().exec();
  //   if (note) {
  //     return res.status(400).json({ message: 'User has assigned notes' });
  //   }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const result = await user.deleteOne();

  const reply = `Username ${user.username} with ID ${user._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
