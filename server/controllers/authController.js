const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { sendPasswordResetEmail } = require('../services/emailService');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const authResponse = (res, user, statusCode = 200) => {
  res.status(statusCode).json({ success: true, token: signToken(user._id), user: publicUser(user) });
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
    });

    authResponse(res, user, 201);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    authResponse(res, user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential || !process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({ message: 'Google login is not configured' });
    }

    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || !payload.email_verified) {
      return res.status(401).json({ message: 'Unable to verify Google account' });
    }

    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email: payload.email }] });
    if (!user) {
      user = await User.create({
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
        googleId: payload.sub,
        role: 'user',
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    authResponse(res, user);
  } catch (error) {
    res.status(401).json({ message: 'Unable to sign in with Google' });
  }
};

exports.forgotPassword = async (req, res) => {
  const genericResponse = {
    message: 'If an account exists for that email, a password reset link has been sent.',
  };

  try {
    const email = req.body.email?.trim().toLowerCase();
    const user = email ? await User.findOne({ email }) : null;

    if (!user) return res.json(genericResponse);

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);
    return res.json(genericResponse);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to send password reset email' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Reset link is invalid or expired' });
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    authResponse(res, user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
