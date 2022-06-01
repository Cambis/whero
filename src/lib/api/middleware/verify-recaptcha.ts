/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction } from 'express';
import type { NextApiResponse } from 'next';

import {
  NextApiMiddlewareHandler,
  FormidableNextApiRequest,
  RecaptchaResponse,
} from 'lib/api/types';

/**
 * Verifies recaptcha
 *
 * @param req
 * The incoming request object
 * @param res
 * The outgoing response object
 * @param next
 * A function that is used to advance the request
 */
const verifyRecaptcha: NextApiMiddlewareHandler = async <T = any>(
  req: FormidableNextApiRequest,
  res: NextApiResponse<T>,
  next: NextFunction,
): Promise<void> => {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_RECAPTCHA_SECRET_KEY}&response=${req.fields.recaptcha}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      method: 'POST',
    },
  );

  const data: RecaptchaResponse = await response.json();

  if (!data.success) {
    next(new Error('Bot detected [recaptcha]'));
  }

  next();
};

export default verifyRecaptcha;
