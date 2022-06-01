declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      NEXT_DATOCMS_API_TOKEN: string;
      NEXT_DATOCMS_PREVIEW_SECRET: string;
      NEXT_DATOCMS_ENVIRONMENT?: string | undefined
      DATO_MANAGEMENT_API_TOKEN?: string
      NEXT_BASIC_AUTH: string
      NEXT_JWT_SECRET: string
      SMTP_PORT: number
      SMTP_HOST: string
      SMTP_USERNAME: string
      SMTP_PASSWORD: string
      SMTP_TO: string
      SMTP_FROM: string
      NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string
      NEXT_RECAPTCHA_SECRET_KEY: string
      NEXT_CORS_ALLOWLIST: string
      NEXT_PUBLIC_GOOGLE_TAG_MANGER_ID: string
      NEXT_PUBLIC_BUGHERD_KEY: string
      SENTRY_DSN: string
      NEXT_PUBLIC_SENTRY_DSN: string
      SENTRY_ORG: string
      SENTRY_PROJECT: string
      SENTRY_REPORT_URI: string
      SENTRY_AUTH_TOKEN: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
