import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import parsePaginationContact from '../utils/parsePaginationContact.js';
import parseSortContact from '../utils/parseSortContact.js';
import { parseContactFilterParams } from '../utils/filter/parseContactFilterParams.js';
/* import { sortField } from '../db/models/Contact.js'; */

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationContact(req.query);

  const { sortBy, sortOrder } = parseSortContact(req.query);
  /* const { sortBy, sortOrder } = parseSortContact(...req.query, sortField); */
  const filter = parseContactFilterParams(req.query);
  const { id: userId } = req.user;

  const data = await contactServices.getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter: { ...filter, userId },
  });

  res.json({
    status: 200,
    message: 'Successfully find contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const contact = await contactServices.getContact({ id: contactId, userId });

  if (!contact) {
    throw createHttpError(404, `Contact with contactId-${contactId} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully find contact ${contactId}`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  const {
    name,
    phoneNumber,
    email = req.body.email || null,
    isFavourite = req.body.isFavourite || false,
    contactType,
  } = req.body;
  const { id: userId } = req.user;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(
      400,
      'name, phoneNumber and contactType are required!!!',
    );
  }

  const newContact = await contactServices.createContact({
    ...req.body,
    email,
    isFavourite,
    userId,
  });

  res.status(201).json({
    status: 201,
    message: 'Contact create successfully!!!',
    data: newContact,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const { isNew, data } = await contactServices.updateContact(
    { _id: contactId, userId },
    req.body,
    { upsert: true },
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Contact upsert successfully',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;

  const result = await contactServices.updateContact(
    { _id: contactId, userId },
    req.body,
  );

  if (!result) {
    throw createHttpError(404, `Contact with contactId-${contactId} not found`);
  }
  res.status(200).json({
    status: 200,
    message: 'Contact patched successfully',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const contact = await contactServices.deleteContact({
    _id: contactId,
    userId,
  });

  if (!contact) {
    throw createHttpError(404, `Contact with contactId-${contactId} not found`);
  }

  res.status(204).send();
};
