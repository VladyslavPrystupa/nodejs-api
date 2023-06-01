const express = require('express');
const router = express.Router();
const {
  get,
  getById,
  create,
  updById,
  removeById,
  updateStatus,
} = require('../../controller');

router.get('/', get);

router.get('/:id', getById);

router.post('/', create);

router.put('/:id', updById);

router.patch('/:contactId/favorite', updateStatus);

router.delete('/:id', removeById);

module.exports = router;
