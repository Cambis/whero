import { useState, useRef } from 'react';

import cn from 'classnames';
import { Formik, FormikHelpers } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';

import { Container } from 'components';
import { FORM_COPY } from 'lib/constants';
import { IFormStatusProps, IFormStatus } from 'lib/types';

import { IContactForm } from './types';

const ContactForm = (): JSX.Element => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formStatus, setFormStatus] = useState<IFormStatus>({
    message: '',
    type: '',
  });

  const initialValues: IContactForm = {
    formName: 'contact',
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    recaptcha: '',
    honeyPot: '',
  };

  const formStatusProps: IFormStatusProps = {
    success: {
      message: FORM_COPY.SUCCESS,
      type: 'success',
    },
    error: {
      message: FORM_COPY.ERROR,
      type: 'error',
    },
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(1, FORM_COPY.TOO_SHORT)
      .max(50, FORM_COPY.TOO_LONG)
      .required(FORM_COPY.REQ_FIRST_NAME),
    lastName: Yup.string()
      .min(1, FORM_COPY.TOO_SHORT)
      .max(50, FORM_COPY.TOO_LONG)
      .required(FORM_COPY.REQ_LAST_NAME),
    email: Yup.string().email(FORM_COPY.INVALID_EMAIL).required(FORM_COPY.REQ_EMAIL),
    message: Yup.string().max(100, FORM_COPY.TOO_LONG),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (
        values: IContactForm,
        { resetForm, setStatus, setSubmitting }: FormikHelpers<IContactForm>,
      ) => {
        setStatus(undefined);
        const token = await recaptchaRef.current.executeAsync();
        const data = new FormData();

        Object.keys(values).forEach((k) => {
          data.append(k, values[k]);
        });

        data.set('recaptcha', token);

        await fetch('/api/forms/notifications', {
          method: 'POST',
          headers: new Headers({
            Accept: 'application/json',
          }),
          body: data,
        })
          .then((res) => {
            if (res.status >= 400 && res.status < 600) {
              resetForm({});
              recaptchaRef.current.reset();
              setFormStatus(formStatusProps.error);
            } else {
              res.json().then((apiData) => {
                setFormStatus(formStatusProps.success);
                data.append('token', apiData?.token);

                fetch('/api/forms/submissions', {
                  method: 'POST',
                  headers: new Headers({
                    Accept: 'application/json',
                  }),
                  body: data,
                });
              });
            }
          })
          .catch(() => {
            resetForm({});
            recaptchaRef.current.reset();
            setFormStatus(formStatusProps.error);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <section>
          <Container>
            {!!formStatus && formStatus.type && (
              <div
                className={cn('p-4 text-left text-2xl', {
                  'border-red-500 text-red-600': formStatus.type === 'error',
                })}
              >
                {formStatus.message}
              </div>
            )}
            {!!formStatus && formStatus.type !== 'success' && (
              <form
                name="contact"
                onSubmit={handleSubmit}
                className="flex flex-wrap justify-between text-left"
              >
                {/* ====== ROBOTS ====== */}
                <label htmlFor="contact-honeyPot" className="hidden" hidden>
                  Don&apos;t fill this out if you&apos;re human:
                  <input
                    id="contact-honeyPot"
                    type="text"
                    name="honeyPot"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.honeyPot || ''}
                  />
                </label>

                {/* ====== FIRST NAME ====== */}
                <fieldset className="mb-4 w-full px-4 lg:w-1/2">
                  <label htmlFor="contact-firstName">
                    <span className="block w-full">
                      First name
                      <sup>*</sup>
                    </span>
                    <input
                      id="contact-firstName"
                      className={cn('form-input w-full rounded-lg px-4 py-3', {
                        'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500':
                          errors.firstName && touched.firstName && errors.firstName,
                      })}
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstName || ''}
                    />
                  </label>

                  <div className="text-red-600">
                    {errors.firstName && touched.firstName && errors.firstName}
                  </div>
                </fieldset>

                {/* ====== LAST NAME ====== */}
                <fieldset className="mb-4 w-full px-4 lg:w-1/2">
                  <label htmlFor="contact-lastName">
                    <span className="block w-full">
                      Last name
                      <sup>*</sup>
                    </span>
                    <input
                      id="contact-lastName"
                      className={cn('form-input w-full rounded-lg px-4 py-3', {
                        'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500':
                          errors.lastName && touched.lastName && errors.lastName,
                      })}
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastName || ''}
                    />
                  </label>

                  <div className="text-red-600">
                    {errors.lastName && touched.lastName && errors.lastName}
                  </div>
                </fieldset>

                {/* ====== EMAIL ====== */}
                <fieldset className="mb-4 w-full px-4 lg:w-1/2">
                  <label htmlFor="contact-email">
                    <span className="block w-full">
                      Email
                      <sup>*</sup>
                    </span>
                    <input
                      id="contact-email"
                      className={cn('form-input w-full rounded-lg px-4 py-3', {
                        'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500':
                          errors.email && touched.email && errors.email,
                      })}
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email || ''}
                    />
                  </label>

                  <div className="text-red-500">
                    {errors.email && touched.email && errors.email}
                  </div>
                </fieldset>

                {/* ====== MESSAGE ====== */}
                <fieldset className="mb-4 w-full px-4">
                  <label htmlFor="contact-message">
                    <span className="block w-full">Message</span>
                    <textarea
                      id="contact-message"
                      className={cn('form-textarea w-full rounded-lg px-4 py-3', {
                        'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500':
                          errors.message && touched.message && errors.message,
                      })}
                      name="message"
                      placeholder="Message"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.message || ''}
                    />
                  </label>

                  <div className="text-red-600">
                    {errors.message && touched.message && errors.message}
                  </div>
                </fieldset>

                {/* ====== ReCAPTCHA ====== */}
                <fieldset>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  />
                  <div className="text-red-600">
                    {errors.recaptcha && touched.recaptcha && errors.recaptcha}
                  </div>
                </fieldset>

                {/* ====== SUBMIT ====== */}
                <fieldset className="w-full text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'mr-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
                      {
                        'disabled:bg-slate-500': isSubmitting,
                      },
                    )}
                  >
                    {FORM_COPY.SUBMIT}
                  </button>
                </fieldset>
              </form>
            )}
          </Container>
        </section>
      )}
    </Formik>
  );
};

export default ContactForm;
