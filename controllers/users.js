const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');
const { nanoid } = require('nanoid');

const { User } = require('../models/usersModels');

const { HttpError, sendMail } = require('../utils');

const { JWT_SECRET, PROJECT_URL } = process.env;

const dirAvatarPath = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw new HttpError(409);
    }

    const verificationToken = nanoid(10);
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, {
      s: '250',
    });

    const verifyEmail = {
      to: email,
      subject: 'Verify your email',
      html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${verificationToken}">Click to verify</a>`,
    };

    await sendMail(verifyEmail);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user === null || !user.verify) {
      throw HttpError(401, 'Email or password is incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      throw HttpError(401, 'Email or password is incorrect');
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
    await User.findByIdAndUpdate(user._id, { token });

    return res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.status(204).json({ message: 'logout success' });
  } catch (error) {
    return next(error);
  }
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: oldPath, originalname } = req.file;

    const fileName = `${_id}_${originalname}`;
    const avatarNewPath = path.join(dirAvatarPath, fileName);

    const image = await Jimp.read(oldPath);
    await image
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .write(oldPath);

    await fs.rename(oldPath, avatarNewPath);

    const avatarURL = path.join('avatars', fileName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (err) {
    return next(err);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new HttpError(404, `User not found`);
    }
    await User.findByIdAndUpdate(user._id, {
      verife: true,
      verificationToken: null,
    });
    res.status(200).json({ message: 'Verification successful' });
  } catch (err) {
    return next(err);
  }
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, `Email not found`);
    }

    if (user.verify) {
      throw HttpError(400, `Verification has already been passed`);
    }

    const verifyEmail = {
      to: email,
      subject: 'Verify your email',
      html: `<a href="${PROJECT_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to verify email</a>`,
    };

    await sendMail(verifyEmail);

    res.status(200).json({
      message: 'Verification email sent',
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verify,
  resendVerifyEmail,
};
