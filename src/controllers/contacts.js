import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
  // const data = await contactServices.getAllContacts({ contactType: 'home' });
  const data = await contactServices.getAllContacts({});

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
