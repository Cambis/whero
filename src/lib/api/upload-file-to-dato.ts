import { SiteClient } from 'datocms-client';
import type { File } from 'formidable';
import mime from 'mime-types';

import type { DatoSingleAssetField, DatoUploadField } from './types';

/**
 * Uploads file to DatoCMS. Returns an object which can be used for asset fields.
 * @param file
 */
const uploadFileToDato = async (file: File | File[]): Promise<DatoSingleAssetField> => {
  const client = new SiteClient(process.env.DATO_MANAGEMENT_API_TOKEN, {
    environment: process.env.NEXT_DATOCMS_ENVIRONMENT || 'main',
  });

  // TODO: handle multi file uploads
  // if (Array.isArray(file)) {
  //   const fileArray = file as File[];
  //   const data = await Promise.all(Object.values(fileArray).map(f => uploadFileToDato(f)));
  // }

  const singleFile = file as File;
  const path = await client.createUploadPath(singleFile.filepath, {
    filename: `${singleFile.newFilename}.${mime.extension(singleFile.mimetype)}`,
  });

  const response: DatoUploadField = await client.uploads.create({
    path,
    author: 'Form handler',
    copyright: new Date().getFullYear().toString(),
    defaultFieldMetadata: {
      en: {
        alt: singleFile.originalFilename,
        title: singleFile.originalFilename,
        customData: {},
      },
    },
  });

  return { upload_id: response.id };
};

export default uploadFileToDato;
