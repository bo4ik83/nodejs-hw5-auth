import Contact from '../db/models/contact.js';
import createHttpError from 'http-errors';

export const createContact = async ({
  name,
  phoneNumber,
  email,
  isFavourite,
  contactType,
  userId,
}) => {
  try {
    const newContact = new Contact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId,
    });

    return await newContact.save();
  } catch (error) {
    console.error(error);
    throw createHttpError(500, 'Error creating contact');
  }
};

export const getContactsByUserId = async (userId) => {
  return Contact.find({ userId });
};

export const getContactByIdAndUser = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const updateContact = async (contactId, userId, updatedData) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, updatedData, {
    new: true,
  });
};

export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
