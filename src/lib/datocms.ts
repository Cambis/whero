/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLClient } from 'graphql-request';

import { getSdk } from './graphql';

export type Variables = {
  [key: string]: number | string | boolean | string[];
};

const apiKey = process.env.NEXT_DATOCMS_API_TOKEN || process.env.STORYBOOK_DATOCMS_API_TOKEN;

export const client = new GraphQLClient('https://graphql.datocms.com', {
  headers: {
    authorization: `Bearer ${apiKey}`,
  },
});

/** Only use for dynamically built queries that can't using $variables */
export const request = async ({
  query,
  variables,
  preview,
}: {
  query: string;
  variables?: Variables;
  preview?: boolean;
}): Promise<any> => {
  let endpoint = 'https://graphql.datocms.com';

  if (process.env.NEXT_DATOCMS_ENVIRONMENT) {
    endpoint += `/environments/${process.env.NEXT_DATOCMS_ENVIRONMENT}`;
  }

  if (preview) {
    endpoint += `/preview`;
  }

  const client = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${apiKey}`,
    },
  });

  return client.request(query, variables);
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// getSdk has no explicit return type
export const sdk = (preview?: boolean) => {
  let endpoint = 'https://graphql.datocms.com';

  if (process.env.NEXT_DATOCMS_ENVIRONMENT) {
    endpoint += `/environments/${process.env.NEXT_DATOCMS_ENVIRONMENT}`;
  }

  if (preview) {
    endpoint += `/preview`;
  }

  const client = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${apiKey}`,
    },
  });

  return getSdk(client);
};
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
