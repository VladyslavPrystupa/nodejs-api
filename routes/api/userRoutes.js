const express = require('express');
const router = express.Router();
const jsonParser = express.json();

const { authenticate } = require('../../middlewares');

const { schemas } = require('../../models/usersModels');
const { validateBody } = require('../../utils');

const {
  register,
  login,
  getCurrent,
  logout,
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
module.exports = router;
