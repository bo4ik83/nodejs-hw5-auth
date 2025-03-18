import Contact from '../db/models/contact.js';

export const getAllContacts = async () => {
  return await Contact.find({});
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContact = async (contactData) => {
  const newContact = new Contact(contactData);
  return await newContact.save();
};

export const patchContact = async (contactId, updateData) => {
  const patchedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  return patchedContact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);

  return deletedContact;
};

export const getContactByPhoneNumber = async (phoneNumber) => {
  return Contact.findOne({ phoneNumber });
};
