const express = require('express');
const jsonParser = express.json();

const router = express.Router();
const {
  get,
  getById,
  create,
  updById,
  removeById,
  updateStatus,
} = require('../../controllers/contscts');

router.get('/', get);

router.get('/:id', getById);

router.post('/', jsonParser, create);

router.put('/:id', jsonParser, updById);

router.patch('/:contactId/favorite', jsonParser, updateStatus);

router.delete('/:id', removeById);

module.exports = router;
