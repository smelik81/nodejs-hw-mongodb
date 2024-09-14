import ContactCollection from '../db/models/Contact.js';
import calculatePaginationParams from '../utils/calculatePaginationParams.js';

export const getAllContacts = async ({ page, perPage }) => {
  const skip = (page - 1) * perPage;
  const contacts = await ContactCollection.find().skip(skip).limit(perPage);
  const count = await ContactCollection.find().countDocuments();

  const paginationData = calculatePaginationParams({ count, page, perPage });

  return {
    data: contacts,
    page,
    perPage,
    totalItems: count,
    ...paginationData,
  };
};

export const getContactById = (contactId) =>
  ContactCollection.findById(contactId);

export const createContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (filter, payload, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(filter, payload, {
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = (contactId) =>
  ContactCollection.findOneAndDelete(contactId);

/* export const getAllContacts = (filters = {}) => ContactCollection.find(filters);
 export const getAllContacts = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
}; */

/* export const getContactById = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};
 */
