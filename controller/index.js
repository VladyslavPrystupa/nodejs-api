const {
  listOfContacts,
  getContactById,
  addContact,
  updContactById,
  removeContact,
  updateStatusContact,
} = require('../service');

const { HttpError, JoiSchema } = require('../utils');

const get = async (req, res, next) => {
  try {
    const results = await listOfContacts();
    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await getContactById(id);

    if (!result) {
      throw HttpError(404, 'Not found');
    }

    res.json({
      status: 'success',
      code: 200,
      data: { contact: result },
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { error } = JoiSchema.validate(req.body);
    if (error) {
      throw HttpError(400, 'missing required name field');
    }
    const { name, phone, email } = req.body;

    const result = await addContact(name, email, phone);

    res.status(201).json({
      status: 'success',
      code: 201,
      data: { task: result },
    });
  } catch (error) {
    next(error);
  }
};

const updById = async (req, res, next) => {
  try {
    const { error } = JoiSchema.validate(req.body);
    if (error) {
      throw HttpError(400, 'missing required fields');
    }
    const { id } = req.params;
    const { name, phone, email } = req.body;
    const result = await updContactById(id, name, email, phone);

    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.json({
      status: 'success',
      code: 200,
      data: { contact: result },
    });
  } catch (error) {
    next(error);
  }
};

const removeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await removeContact(id);

    if (!deletedContact) {
      throw HttpError(404, 'Not found');
    }

    res.json({
      status: 'success',
      code: 200,
      data: deletedContact,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { error } = JoiSchema.validate(req.body);
    if (error) {
      throw HttpError(400, 'missing field favorite');
    }
    const { id } = req.params;
    const result = await updateStatusContact(id, req.body);

    if (!result) {
      throw HttpError(404, 'Not found');
    }

    res.json({
      status: 'success',
      code: 200,
      data: { contact: result },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  getById,
  create,
  updById,
  removeById,
  updateStatus,
};
