const Contact = require('./schemas/contact');

const listOfContacts = async () => {
  return await Contact.find();
};

const getContactById = async id => {
  return await Contact.findOne({ _id: id });
};

const addContact = async (name, email, phone) => {
  return Contact.create({ name, email, phone });
};

const updContactById = async (id, name, email, phone) => {
  return await Contact.findOneAndUpdate(
    { _id: id },
    { name, email, phone },
    { new: true }
  );
};

const removeContact = async id => {
  return await Contact.findOneAndDelete({
    _id: id,
  });
};

const updateStatusContact = async (id, favorite) => {
  return await Contact.findByIdAndUpdate(id, favorite, {
    new: true,
  });
};

module.exports = {
  listOfContacts,
  getContactById,
  removeContact,
  addContact,
  updContactById,
  updateStatusContact,
};
