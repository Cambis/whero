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
                className={cn(
                  'Alert',
                  { 'Alert--success': formStatus.type === 'success' },
                  { 'Alert--error': formStatus.type === 'error' },
                )}
              >
                {formStatus.message}
              </div>
            )}
            {!!formStatus && formStatus.type !== 'success' && (
              <form
                name="contact"
                onSubmit={handleSubmit}
                className="Grid u-flex u-flexWrap u-flexAlignItemsStretch"
              >
                {/* ====== ROBOTS ====== */}
                <label htmlFor="contact-honeyPot" className="u-hiddenVisually" hidden>
                  Don’t fill this out if you’re human:
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
                <fieldset className="Grid-cell u-md-width1of2">
                  <label
                    htmlFor="contact-firstName"
                    className={cn('Input', {
                      'has-error': errors.firstName && touched.firstName && errors.firstName,
                    })}
                  >
                    <span className="Input-label is-required">
                      First name
                      <sup>*</sup>
                    </span>
                    <input
                      id="contact-firstName"
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstName || ''}
                    />
                  </label>

                  <div className="Input-note">
                    {errors.firstName && touched.firstName && errors.firstName}
                  </div>
                </fieldset>

                {/* ====== LAST NAME ====== */}
                <fieldset className="Grid-cell u-md-width1of2">
                  <label
                    htmlFor="contact-lastName"
                    className={cn('Input', {
                      'has-error': errors.lastName && touched.lastName && errors.lastName,
                    })}
                  >
                    <span className="Input-label is-required">
                      Last name
                      <sup>*</sup>
                    </span>
                    <input
                      id="contact-lastName"
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastName || ''}
                    />
                  </label>

                  <div className="Input-note">
                    {errors.lastName && touched.lastName && errors.lastName}
                  </div>
                </fieldset>

                {/* ====== EMAIL ====== */}
                <fieldset className="Grid-cell">
                  <label
                    htmlFor="contact-email"
                    className={cn('Input', {
                      'has-error': errors.email && touched.email && errors.email,
                    })}
                  >
                    <span className="Input-label is-required">
                      Email
                      <sup>*</sup>
                    </span>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email || ''}
                    />
                  </label>

                  <div className="Input-note">{errors.email && touched.email && errors.email}</div>
                </fieldset>

                {/* ====== MESSAGE ====== */}
                <fieldset className="Grid-cell">
                  <label
                    htmlFor="contact-message"
                    className={cn('Textarea', {
                      'has-error': errors.message && touched.message && errors.message,
                    })}
                  >
                    <span className="Input-label">Message</span>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="Message"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.message || ''}
                    />
                  </label>

                  <div className="Input-note">
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
                  <div className="Input-note">
                    {errors.recaptcha && touched.recaptcha && errors.recaptcha}
                  </div>
                </fieldset>

                {/* ====== SUBMIT ====== */}
                <fieldset className="Grid-cell u-md-width1of2 u-textCenter u-md-textRight">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn('Button Button--primary Button--large', {
                      'is-disabled': isSubmitting,
                    })}
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
