import { SiteClient } from 'datocms-client';

import { getFormSubmissionModel } from 'lib/api';

import type { IFormSubmission, DatoGenericItemField, DatoSingleAssetField } from './types';

/**
 * Creates a new instance of a model from a users form submission.
 *
 * Maps parameter formName to model based FORM_MODEL_IDS constant
 * @param values
 * @returns Response
 */
const submitDataToDato = async <FormSubmission extends IFormSubmission>(
  values: FormSubmission,
  attachments: DatoSingleAssetField[],
): Promise<DatoGenericItemField> => {
  const client = new SiteClient(process.env.DATO_MANAGEMENT_API_TOKEN, {
    environment: process.env.NEXT_DATOCMS_ENVIRONMENT || 'main',
  });

  const itemType = await getFormSubmissionModel(values.formName);

  return new Promise((resolve, reject) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { formName, recaptcha, honeyPot, ...parsedValues } = values;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const content = `
      <p>Submission recieved from ${parsedValues.firstName} ${parsedValues.lastName}</p>
      </br>
      <p>Sender's email is ${parsedValues.email}</p>
      </br>
      </br>
      </br>
      <p>Recieved at ${Math.floor(Date.now() / 1000)}</p>
      </br>
      </br>
      </br>
      ${Object.entries(parsedValues)
        .map((e) => `<p>${e[0]}: ${e[1]}</p>`)
        .join('\n')}
    `;

    client.items
      .create({
        itemType: itemType.id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        values: JSON.stringify(values),
        content,
        attachments,
      })
      .then((res: DatoGenericItemField) => {
        resolve(res);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export default submitDataToDato;
