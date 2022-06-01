export interface IFormSubmission {
  formName: string;
  firstName: string;
  lastName: string;
  email: string;
  recaptcha: string;
  honeyPot?: string;
}

export interface IFormStatus {
  message: string;
  type: string;
}

export interface IFormStatusProps {
  [key: string]: IFormStatus;
}
