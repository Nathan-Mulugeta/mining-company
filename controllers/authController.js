const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateToken');

// @desc    Login
// @route   POST /auth
// @access  Public
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    res.status(401);
    throw new Error('Not authorized. User not active.');
  }

  const match = await foundUser.matchPassword(password);

  if (!match) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const accessToken = generateAccessToken(
    foundUser.username,
    foundUser.roles,
    foundUser._id.toString()
  );
  const refreshToken = generateRefreshToken(res, foundUser.username);

  // Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: 'None', //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  res.json({
    accessToken,
    firstName: foundUser.firstname,
    lastName: foundUser.lastname,
  });
};

// @desc    Refresh
// @route   GET /auth/refresh
// @access  Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: err.message });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) {
        res.status(401);
        throw new Error('Unauthorized');
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
            id: foundUser._id.toString(),
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const { firstname, lastname } = foundUser;
      res.json({ accessToken, firstName: firstname, lastName: lastname });
    }
  );
};

// @desc    Logout
// @route   POST /auth/logout
// @access  Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ message: 'Cookie cleared' });
};

module.exports = {
  login,
  refresh,
  logout,
};
