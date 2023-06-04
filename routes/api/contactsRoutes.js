const express = require('express');
const jsonParser = express.json();

const { authenticate } = require('../../middlewares');

const { schemas } = require('../../models/contactsModels');
const { validateBody } = require('../../utils');

const router = express.Router();
const {
  get,
  getById,
  create,
  updById,
  removeById,
  updateStatus,
} = require('../../controllers/contacts');

router.use(authenticate);

router.get('/', get);

router.get('/:id', getById);

router.post('/', jsonParser, validateBody(schemas.joiContactsSchema), create);

router.put(
  '/:id',
  jsonParser,
  validateBody(schemas.joiContactsSchema),
  updById
);

router.patch(
  '/:id/favorite',
  jsonParser,
  validateBody(schemas.joiUpdateContactsSchema),
  updateStatus
);

router.delete('/:id', removeById);

module.exports = router;
