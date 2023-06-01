const bcrypt = require('bcrypt');

const { getCurrentUser, addUser } = require('../service/models/usersModels');

async function register(req, res, next) {
  const { name, email, password } = req.body;
  const newUser = {
    name,
    email,
    password,
  };

  try {
    const currentUser = await getCurrentUser(newUser.email);
    if (currentUser !== null) {
      return res.status(409).json({ message: 'User already exists' });
    }

    newUser.password = await bcrypt.hash(newUser.password, 10);

    addUser(newUser);

    return res.status(201).end();
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await getCurrentUser(email);

    if (user === null) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    res.json({ token: 'TOKEN' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
