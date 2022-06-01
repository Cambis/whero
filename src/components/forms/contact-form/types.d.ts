import { IFormSubmission } from 'lib/types';

export interface IContactForm extends IFormSubmission {
  message: string;
}
