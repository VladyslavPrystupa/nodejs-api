const { HttpError } = require('../utils');
const { Contact } = require('../models/contactsModels');

const get = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find({ owner }, '-createdAt -updatedAt', {
      skip,
      limit,
    }).populate('owner', 'email subscription');

    res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error.message);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      throw new HttpError(404, `Contact not found`);
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      data: { contact },
    });
  } catch (error) {
    next(error.message);
  }
};

const create = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const contact = await Contact.create({ ...req.body, owner });

    res.status(201).json({
      status: 'success',
      code: 201,
      data: { contact },
    });
  } catch (error) {
    next(error.message);
  }
};

const updById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!contact) {
      throw new HttpError(404, `Contact not found`);
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      data: { contact },
    });
  } catch (error) {
    next(error.message);
  }
};

const removeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedContact = await Contact.findByIdAndRemove(id);
    if (!removedContact) {
      throw new HttpError(404, `Contact not found`);
    }

    res.json({
      status: 'success',
      code: 200,
      data: removedContact,
    });
  } catch (error) {
    next(error.message);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!contact) {
      throw new HttpError(404, `Contact not found`);
    }

    res.json({
      status: 'success',
      code: 200,
      data: { contact },
    });
  } catch (error) {
    next(error.message);
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
