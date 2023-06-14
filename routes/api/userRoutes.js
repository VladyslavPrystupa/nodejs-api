const express = require('express');
const router = express.Router();
const jsonParser = express.json();

const { authenticate, upload } = require('../../middlewares');

const { schemas } = require('../../models/usersModels');
const { validateBody } = require('../../utils');

const {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
} = require('../../controllers/users');

router.post(
  '/register',
  jsonParser,
  validateBody(schemas.joiRegisterSchema),
  register
);

router.post('/login', jsonParser, validateBody(schemas.joiLoginSchema), login);

router.get('/current', authenticate, getCurrent);

router.post('/logout', authenticate, logout);

router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);

module.exports = router;
