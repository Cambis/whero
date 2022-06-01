require('@next/env').loadEnvConfig('.');

const endpoint = process.env.NEXT_DATOCMS_ENVIRONMENT
  ? `https://graphql.datocms.com/environments/${process.env.NEXT_DATOCMS_ENVIRONMENT}`
  : `https://graphql.datocms.com`;

module.exports = {
  schema: {
    [endpoint]: {
      headers: {
        Authorization: process.env.NEXT_DATOCMS_API_TOKEN,
      },
    },
  },
  documents: 'src/graphql/**/*.gql',
  extensions: {
    codegen: {
      overwrite: true,
      generates: {
        'src/lib/graphql.ts': {
          plugins: ['typescript', 'typescript-graphql-request', 'typescript-operations'],
          config: {
            dedupeFragments: true,
            pureMagicComment: true,
            exportFragmentSpreadSubTypes: true,
            namingConvention: 'keep',
          },
        },
      },
    },
  },
};
