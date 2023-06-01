const bcrypt = require('bcrypt');

const { HttpError, userRegisterSchema, userLoginSchema } = require('../utils');

const { getCurrentUser, addUser } = require('../service/models/usersModels');

async function register(req, res, next) {
  const { name, email, password, subscription } = req.body;
  const newUser = {
    name,
    email,
    password,
    subscription,
  };

  try {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const currentUser = await getCurrentUser(newUser.email);
    if (currentUser !== null) {
      throw HttpError(409, 'Email already exists');
    }

    newUser.password = await bcrypt.hash(newUser.password, 10);

    addUser(newUser);

    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const user = await getCurrentUser(email);

    if (user === null) {
      throw HttpError(401, 'Email or password is incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      throw HttpError(401, 'Email or password is incorrect');
    }

    return res.status(200).json({
      user: {
        email,
        password,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
