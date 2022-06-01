/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction } from 'express';
import { IncomingForm, Fields, Files } from 'formidable';
import type { NextApiResponse } from 'next';

import type { NextApiMiddlewareHandler, FormidableNextApiRequest } from 'lib/api/types';

type FormidableData = {
  err: any;
  fields: Fields;
  files: Files;
};

/**
 * A function that parses incoming form data from a FormData object.
 * Adds two fields to the request object:
 * files - contains file type fields,
 * fields - contains non-file type fields.
 *
 * @param req
 * The incoming request object
 * @param res
 * The outgoing response object
 * @param next
 * A function that is used to advance the request
 */
const useFormidable: NextApiMiddlewareHandler = async <T = any>(
  req: FormidableNextApiRequest,
  res: NextApiResponse<T>,
  next: NextFunction,
): Promise<void> => {
  const data = await new Promise<FormidableData>((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      if (err) reject({ err });

      resolve({ err, fields, files });
    });
  });

  req.fields = data.fields;
  req.files = data.files;

  next();
};

export default useFormidable;
