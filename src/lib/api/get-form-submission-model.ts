import { SiteClient } from 'datocms-client';

import type { DatoGenericItemField } from './types';

const getFormSubmissionModel = async (formName: string): Promise<DatoGenericItemField> => {
  const client = new SiteClient(process.env.DATO_MANAGEMENT_API_TOKEN, {
    environment: process.env.NEXT_DATOCMS_ENVIRONMENT || 'main',
  });

  return new Promise((resolve, reject) => {
    client.itemType
      .find(`submission_${formName}`)
      .then((res: DatoGenericItemField) => {
        resolve(res);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export default getFormSubmissionModel;
