import createHttpError from 'http-errors';
import {
  getContactsByUserId,
  getContactByIdAndUser,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getContactsByUserId(req.user._id);

    res.status(200).json({
      status: 200,
      message: 'Contacts retrieved successfully!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const contact = await getContactByIdAndUser(
      req.params.contactId,
      req.user._id,
    );

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Contact retrieved successfully!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const updatedContact = await updateContact(
      req.params.contactId,
      req.user._id,
      req.body,
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber) {
      throw new createHttpError(400, 'Name and Phone Number are required');
    }

    const newContact = await createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: req.user._id,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: newContact,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const deletedContact = await deleteContact(
      req.params.contactId,
      req.user._id,
    );

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
