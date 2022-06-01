# Base stable node image that all the stages will inherit from
FROM node:16.15.0-alpine AS base

ENV PATH "./node_modules/.bin:$PATH"

WORKDIR /app

# Used in development
FROM base AS dev

RUN apk add --no-cache git

COPY ./docker/tukutuku/docker-entrypoint.sh /usr/bin/docker-entrypoint.sh
RUN chmod +x /usr/bin/docker-entrypoint.sh
ENTRYPOINT [ "/usr/bin/docker-entrypoint.sh" ]

USER 1000

EXPOSE 3000 8888

CMD [ "yarn", "dev" ]

# Used to build graphql types
FROM base AS graphql

RUN apk add --no-cache netcat-openbsd

COPY ./docker/tukutuku/docker-entrypoint-graphql.sh /usr/bin/docker-entrypoint.sh
RUN chmod +x /usr/bin/docker-entrypoint.sh
ENTRYPOINT [ "/usr/bin/docker-entrypoint.sh" ]

USER 1000

CMD [ "yarn", "codegen:watch" ]

# Installs dependencies for later stages
FROM base AS dependencies

USER 1000

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./

# Lints production code
FROM base AS lint

USER 1000

COPY --from=dependencies /app /app
RUN yarn lint

# Builds production code
FROM base AS builder

USER 1000

COPY --from=dependencies /app /app
RUN yarn build

# Serves production code
FROM nginx:1.17-alpine AS prod

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
