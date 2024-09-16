import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import parsePaginationContact from '../utils/parsePaginationContact.js';
import parseSortContact from '../utils/parseSortContact.js';
import { parseContactFilterParams } from '../utils/filter/parseContactFilterParams.js';
/* import { sortField } from '../db/models/Contact.js'; */

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationContact(req.query);
  const { sortBy, sortOrder } = parseSortContact(req.query);
  // не зрозуміла різниця між двома підходами тому що працюють обидва
  /* const { sortBy, sortOrder } = parseSortContact(...req.query, sortField); */
  const filter = parseContactFilterParams(req.query);

  const data = await contactServices.getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully find contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactServices.getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, `Contact with contactId-${contactId} not found`);

    /* const error = new Error(`Contact with contactId-${contactId} not found`);
    error.status = 404;
    throw error;
 */
    /*  return res.status(404).send({
      message: `Contact with contactId-${contactId} not found`,
    }); */
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
    email = null,
    isFavourite = false,
    contactType,
  } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(
      400,
      'name, phoneNumber and contactType are required!!!',
    );
  }

  const newContact = await contactServices.createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Contact create successfully!!!',
    data: newContact,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { isNew, data } = await contactServices.updateContact(
    { _id: contactId },
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

  const result = await contactServices.updateContact(
    { _id: contactId },
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
  const contact = await contactServices.deleteContact({ _id: contactId });

  if (!contact) {
    throw createHttpError(404, `Contact with contactId-${contactId} not found`);
  }

  res.status(204).send();
};
