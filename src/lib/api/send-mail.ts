import type { File, Files } from 'formidable';
import mime from 'mime-types';
import type { SentMessageInfo } from 'nodemailer';
import type { Attachment } from 'nodemailer/lib/mailer';

import type { IFormSubmission } from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_FROM, SMTP_TO } = process.env;

const flattenFiles = (file: File | File[]): Attachment[] => {
  if (Array.isArray(file)) return [].concat(...file.map(flattenFiles));

  const singleFile = file as File;
  return [
    {
      filename: `${singleFile.newFilename}.${mime.extension(singleFile.mimetype)}`,
      path: singleFile.filepath,
    },
  ];
};

/**
 * Submits email and attachments to reciever via SMTP.
 * @param fields
 * @param files
 */
const sendMail = async <FormSubmission extends IFormSubmission>(
  fields: FormSubmission,
  files: Files,
): Promise<SentMessageInfo> =>
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { recaptcha, honeyPot, ...parsedValues } = fields;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const attachments: Attachment[] = Object.values(files)
      .map((v) => flattenFiles(v))
      .flat();

    transporter
      .sendMail({
        from: SMTP_FROM,
        to: SMTP_TO,
        subject: `New ${parsedValues.formName.toUpperCase()} Submission Recieved ✔`,
        text: `
        ${parsedValues.formName.toUpperCase()} submission recieved from ${parsedValues.firstName}
        ${parsedValues.lastName}
        Sender's email is ${parsedValues.email}
        Recieved at ${Math.floor(Date.now() / 1000)}

        ${Object.entries(parsedValues)
          .map((e) => `${e[0]}: ${e[1]}`)
          .join('\n')}
        `,
        html: `
        <p>${parsedValues.formName.toUpperCase()} submission recieved from ${parsedValues.firstName}
        ${parsedValues.lastName}</p>
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
        `,
        attachments,
      })
      .then((info: SentMessageInfo) => {
        resolve(info);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });

export default sendMail;
