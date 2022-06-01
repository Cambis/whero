# Whero - NextJS 12.x DatoCMS Boilerplate

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## What Is Included

- Docker
- Typescript
- ESLint
- Prettier
- Stylelint
- Sentry issue tracking
- Bugherd integration
- Strict content security policy
- Security headers
- Mailcatcher
- Sitemap generation
- Automatic environment configuration for Github Codespaces
- Github actions
- Semantic versioning
- Husky and lint-staged
- And much more!

## Installation

Generate a new repository using the [Use this template](https://github.com/Cambis/whero/generate) function in Github.

In the package.json change the project name to an appropiate name for your project.
Also a good idea to search for all uses of `whero` and change them to a short version of you app name. These changes are in the docker files, mainly the sync config.

Finally, reset the version number inside the package.json to 0.1.0.

## Getting Started
If you are developing this project with codespaces (recommended), you can skip straight [this section](#running-the-project).

### Prerequisites

- [Docker-Compose](https://docs.docker.com/compose/install/)
- [Docker-Sync](https://docker-sync.readthedocs.io/en/latest/getting-started/installation.html) (for MacOSX only)

### Docker World

This project uses three custom docker images for development inside `./docker`.

```sh
tukutuku (web) # An alpine image that contains node
kaihopu (mailcatcher) # An alpine image that contains mailcatcher
```

### Set up environment variables

First, copy the example graphql types:
```bash
cp src/templates/graphql.ts.example src/lib/graphql.ts
```

In your DatoCMS' project, go to the **Settings** menu at the top and click **API tokens**.

Then click **Read-only API token** and copy the token.

Copy the `.env.example` file in this directory to `.env` (if it hasn't been created already):

```bash
cp .env.example .env
```

Then set each variable on `.env`:

- `NEXT_DATOCMS_API_TOKEN` should be the API token you just copied.
- `NEXT_DATOCMS_PREVIEW_SECRET` can be any random string (but avoid spaces), like `MY_SECRET` - this is used for the Preview Mode](https://www.datocms.com/docs/next-js/setting-up-next-js-preview-mode).

Your `.env` file should look like this:

```bash
NEXT_DATOCMS_API_TOKEN=...
NEXT_DATOCMS_PREVIEW_SECRET=...
...
```

### Running the Project

First, run the development server:

#### Codespaces

```bash
docker-compose up
```

#### Linux

```bash
docker-compose build
docker-compose run --rm --no-deps --entrypoint="" web yarn
docker-compose up
```

#### MacOSX

```bash
docker-compose build
docker-sync start
docker-compose -f docker-compose.yml -f docker-compose-dev.yml run --rm --no-deps --entrypoint="" web yarn
docker-sync-stack start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

If you are redirected to `pages/static/index.tsx` you will need to run the default migrations.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Directory Structure

```bash
src
├── components # Contains JSX elements
│   ├── {component} # Name of JSX element
│   │   ├── {component}.tsx # Contains the definition of the element
│   │   ├── index.ts # Exports the element
│   │   └── types.d.ts # Contains the type definitions for the element
│   └── index.ts # Imports/exports all the JSX elements
├── graphql # Contains GraphQL queries
│   ├── {record_type} # Record to be queried
│   │   ├── {recordQuery}.gql # Contains the actual query definition
│   │   └── {recordFields}.fragment.gql # Fragment containing the queryable fields of a record
└── lib # Shared/global functions go here
├── pages # Pages go here
│   ├── api
│   │   └── {function}.ts
│   ├── _app.tsx
│   └── index.tsx
└── styles # Styles go here
    └── globals.css
```

## Migrations

This project uses DatoCMS migrations to track content type changes and updates. For more information check the [DatoCMS documentation](https://www.datocms.com/docs/scripting-migrations/scripting-migrations-with-the-datocms-cli).

First exec into the web container while it is running:

```bash
docker-compose exec web /bin/sh # Linux/codespaces
docker-compose -f docker-compose.yml -f docker-compose-dev.yml exec web /bin/sh # MacOSX
```

Create a new migration with the included template:

```bash
dato new migration 'create my pages etc' --migrationTemplate=./src/templates/defaultPageMigration.js
```

Run the migration on a new environment:

```bash
dato migrate --destination=feature-my-new-migration
```

Log into DatoCMS and promote the new environment.

## Linting

This project uses Prettier, ESLint, Stylelint and Husky.

Husky will lint all staged files in commits. To skip husky add the `--no-verify` flag to your git command.

_Deploys must pass lint testing before release._

You can run linting manually:

```bash
# Assuming your project is currently running...
docker-compose exec web yarn lint # Linux/Codespaces
docker-compose -f docker-compose.yml -f docker-compose-dev.yml exec web yarn lint # Mac
```

Most basic lint errors can be fixed via:

```bash
# Assuming your project is currently running...
docker-compose exec web yarn lint:fix # Linux/Codespaces
docker-compose -f docker-compose.yml -f docker-compose-dev.yml exec web yarn lint:fix # Mac
```

Check the `package.json` to see additional scripts

### Stylelint

Since Stylelint 14.x VSCode has required extra configuration to make it work with the official extension. Inside your `.vscode/settings.json` you should have this:

```json
{
  "css.validate": false,
  "scss.validate": false,
  "stylelint.validate": ["css", "less", "postcss", "scss"]
}
```

This tells VSCode to use the extension to validate css/scss.

If you are running this project in codespaces this should be already configured for you.

## Form Submissions

Ensure you have these fields in your .env:
Consult the vercel instance for the recaptcha keys.

```sh
SMTP_PORT=1025
SMTP_HOST=mailcatcher
SMTP_USERNAME=user
SMTP_PASSWORD=password
SMTP_TO=bar@example.com
SMTP_FROM=foo@example.com

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_RECAPTCHA_SECRET_KEY=

NEXT_CORS_ALLOWLIST=http://localhost:3000, http://127.0.0.1:3000

# `openssl rand -base64 48`
NEXT_JWT_SECRET=
```

The base example form lies with `pages/static/contact/index.tsx`

All forms should submit to `pages/api/forms/notifications`

The form will only send data to DatoCMS in production mode.

Local submissions are caught by mailcatcher, open [http://localhost:1080](http://localhost:1080) with your browser to see the results.

Form submission is divied between two endpoints, `/api/forms/notfications` and `/api/forms/submissions` respectively.
The former is used to notify admins of submissions via email, the latter is used to store submissions in DatoCMS.

### Form Submission Models

Each form must have its own submission model in DatoCMS. These models are used to track submissions. The naming convention is `submission_<FORM_NAME>`.
Each model must contain the following fields:

```ts
interface SubmissionModel {
  firstName: string; // Single-line string
  lastName: string; // Single-line string
  email: string; // Single-line string
  content: string; // Multiple-paragraph text
  attachements?: File[]; // Asset gallery
  values: any; // JSON
}
```

### Middleware

The form endpoints use express-style middleware to modify and validate each incoming request, they are called using the `runMiddleware()` function. Each function must extend the `NextApiMiddlewareHandler` function type.

### JWT Authentication

The `submissions` endpoint is protected by a JWT token. This token is generated from the `NEXT_JWT_SECRET` .env variable. Tokens are generated and authenticated internally only.

## Content Security Policy

This project employs a content security policy. which is update inside of `next.config.js`. Due to the static generation of the site there is currently no robust way to employ a strict content security policy with hashes or noncing.

## Sentry

This project is preconfigured to run on Sentry. To configure, first create a project in Sentry, then use the provided dsn to fill these .env values:

```bash
SENTRY_DSN=you-dsn-goes-here
NEXT_PUBLIC_SENTRY_DSN=you-dsn-goes-here
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project-name
SENTRY_REPORTING_URI=
SENTRY_AUTH_TOKEN= # not neccessary for local
```

Then update the project name in `sentry.properties` to the name of the project in Sentry.

## Bugherd

This project is preconfigured to run with Bugherd. To configure, first create a project in Bugherd and add the provided api key to the .env:

```bash
NEXT_PUBLIC_BUGHERD_KEY=you-key-goes-here
```

## Sitemap

This project uses [next-sitemap](https://www.npmjs.com/package/next-sitemap) to generate sitemap at post-build time. Configuration is located inside `next-sitemap.js`, consult the next-sitemap repository for the configuration options.
