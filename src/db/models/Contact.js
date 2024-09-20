import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateOptions } from './hooks.js';
import { contactTypeList } from '../../constans/contacts.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: false,
      default: null,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactTypeList,
      required: true,
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', setUpdateOptions);
contactSchema.post('findOneAndUpdate', handleSaveError);

const ContactCollection = model('contact', contactSchema);

export const sortField = [
  'name',
  'phoneNumber',
  'email',
  'contactType',
  'isFavourite',
];

export default ContactCollection;
