#!/bin/bash

set -x
cd $1

docker_build() {
  docker-compose build
  docker-compose run --rm --no-deps web echo "Dependencies installed!"
  docker-compose down
}

copy_example_files() {
  echo "Checking for dev files..."

  if [[ ! -f ".env" ]]; then
    echo "Creating example .env..."
    touch .env

    # DatoCMS
    echo NEXT_DATOCMS_API_TOKEN=${NEXT_DATOCMS_API_TOKEN} >> .env
    echo NEXT_DATOCMS_PREVIEW_SECRET= >> .env
    echo NEXT_DATOCMS_ENVIRONMENT= >> .env
    echo DATO_MANAGEMENT_API_TOKEN=${DATO_MANAGEMENT_API_TOKEN} >> .env
    echo -e "" >> .env

    # Basic auth
    echo NEXT_BASIC_AUTH=foo:bar >> .env
    echo -e "" >> .env

    # SMTP
    echo SMTP_PORT=1025 >> .env
    echo SMTP_HOST=mailcatcher >> .env
    echo SMTP_USERNAME=user >> .env
    echo SMTP_PASSWORD=password >> .env
    echo SMTP_TO=bar@example.com >> .env
    echo SMTP_FROM=foo@example.com >> .env
    echo -e "" >> .env

    # Google
    echo NEXT_PUBLIC_GOOGLE_TAG_MANGER_ID=${NEXT_PUBLIC_GOOGLE_TAG_MANGER_ID} >> .env
    echo NEXT_RECAPTCHA_SECRET_KEY=${NEXT_RECAPTCHA_SECRET_KEY} >> .env
    echo NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY} >> .env
    echo -e "" >> .env

    # Internal security
    echo NEXT_CORS_ALLOWLIST=http://localhost:3000, http://127.0.0.1:3000, https://${CODESPACE_NAME}-3000.githubpreview.dev >> .env
    echo -e "" >> .env
    echo NEXT_JWT_SECRET=$(openssl rand -base64 48) >> .env
    echo -e "" >> .env

    # Sentry
    echo NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN} >> .env
    echo SENTRY_DSN=${SENTRY_DSN} >> .env
    echo -e "" >> .env
 
    # Additional scripts
    echo NEXT_PUBLIC_BUGHERD_KEY=${NEXT_PUBLIC_BUGHERD_KEY} >> .env
  fi

  # Create a base graphl file
  if [[ ! -f "src/lib/graphql.ts" ]]; then
    echo "Creating graphql.ts..."
    cp -p ./src/templates/graphl.ts.example ./src/lib/graphql.ts
  fi

  # Create base vscode settings
  if [[ ! -f ".vscode/settings.json" ]]; then
    echo "Creating vscode settings..."
    mkdir -p .vscode
    cp -p ./src/templates/settings.json.example ./.vscode/settings.json
  fi

  echo "Dev files created!"
}

docker_build
copy_example_files

exit
