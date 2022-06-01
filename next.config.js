// eslint-disable-next-line @typescript-eslint/no-var-requires
/** @type {import('next').NextConfig} */

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs');

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const reportURI =
  process.env.NODE_ENV === 'production' ? `report-uri ${process.env.SENTRY_REPORT_URI};` : '';

const csp = `
  default-src 'self';
  object-src 'none';
  base-uri 'self';
  connect-src 'self'
    https://graphql-listen.datocms.com
    https://sentry.io
    https://*.sentry.io
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://www.bugherd.com
    https://bugherd-attachments.s3.amazonaws.com
    wss://ws.pusherapp.com
    https://screenshots.bugherd.com
    https://sessions.bugsnag.com
    https://sockjs.pusher.com;
  img-src 'self' data:
    https://www.datocms-assets.com/
    https://www.googletagmanager.com
    https://ssl.gstatic.com
    https://www.gstatic.com
    https://bugherd-attachments.s3.amazonaws.com/
    https://d2iiunr5ws5ch1.cloudfront.net/;
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://www.google.com
    https://www.googletagmanager.com
    https://tagmanager.google.com
    https://www.google-analytics.com
    https://ssl.google-analytics.com
    https://d2iiunr5ws5ch1.cloudfront.net/
    https://d2wy8f7a9ursnm.cloudfront.net/
    https://www.bugherd.com
    https://bugherd-attachments.s3.amazonaws.com
    wss://ws.pusherapp.com
    https://screenshots.bugherd.com
    https://sockjs.pusher.com
    https://www.google.com/recaptcha/
    https://www.gstatic.com/recaptcha/;
  frame-src
    https://www.google.com;
  frame-ancestors 'self';
  style-src 'self' 'unsafe-inline'
    https://tagmanager.google.com
    https://fonts.googleapis.com
    d2iiunr5ws5ch1.cloudfront.net;
  font-src 'self' data:
    https://fonts.gstatic.com
    https://www.bugherd.com
    https://d2iiunr5ws5ch1.cloudfront.net
    https://www.google.com/recaptcha/
    https://recaptcha.google.com/recaptcha/;
  ${reportURI}
  `;

const nextConfig = {
  images: {
    domains: ['www.datocms-assets.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: `Content-Security-Policy${
              process.env.NODE_ENV === 'development' ? '-Report-Only' : ''
            }`,
            value: csp.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
let moduleExports = nextConfig;

if (!!SENTRY_DSN && !!process.env.SENTRY_AUTH_TOKEN && process.env.NODE_ENV === 'production') {
  moduleExports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
}

module.exports = moduleExports;
