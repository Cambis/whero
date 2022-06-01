import type { NextFunction } from 'express';
import type { Fields, Files } from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';

export { IFormSubmission } from 'components/forms/types';

export type Request = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  recaptcha: string;
  honeyPot?: string;
};

export type DynamoRecord = {
  TableName: string;
  Item: {
    formId: string;
    formData: string;
    created: number;
  };
};

/* eslint-disable camelcase */
export type RecaptchaResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: [];
};

export type DatoSingleAssetField = {
  upload_id: string;
};
/* eslint-enable camelcase */

export type DatoGenericItemField = {
  id: string;
};

export type DatoUploadField = DatoGenericItemField;

export type FormidableNextApiRequest = NextApiRequest & {
  fields?: Fields;
  files?: Files;
  token?: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type NextApiMiddlewareHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  next: NextFunction,
) => Promise<void> | void;
/* eslint-enable @typescript-eslint/no-explicit-any */
