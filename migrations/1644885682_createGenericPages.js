'use strict';

module.exports = async (client) => {
  const genericPageModel = await client.itemTypes.create({
    name: 'Generic page',
    apiKey: 'generic_page',
    hint: 'A generic page that can be used for simple content.',
  });

  const titleField = await client.fields.create(genericPageModel.id, {
    label: 'Title',
    apiKey: 'title',
    fieldType: 'string',
    validators: {
      required: {},
    },
    appearance: {
      editor: 'single_line',
      parameters: {
        heading: true,
      },
      addons: [],
    },
  });

  const contentField = await client.fields.create(genericPageModel.id, {
    label: 'Content',
    apiKey: 'content',
    fieldType: 'structured_text',
    validators: {
      structuredTextBlocks: {
        itemTypes: [],
      },
      structuredTextLinks: {
        itemTypes: [],
      },
    },
  });

  const seoFieldSet = await client.fieldset.create(genericPageModel.id, {
    title: 'SEO',
    hint: 'Please fill in these fields!',
    collapsible: true,
    startCollapsed: false,
  });

  const slugField = await client.fields.create(genericPageModel.id, {
    label: 'Slug',
    apiKey: 'slug',
    fieldType: 'slug',
    validators: {
      required: {},
      slug_title_field: {
        title_field_id: titleField.id,
      },
    },
    appearance: {
      editor: 'slug',
      addons: [],
      parameters: {},
    },
    fieldset: seoFieldSet.id,
  });

  const seoField = await client.fields.create(genericPageModel.id, {
    label: 'SEO',
    apiKey: 'seo',
    fieldType: 'seo',
    validators: {
      required_seo_fields: {
        title: true,
        description: true,
        image: false,
        twitter_card: false,
      },
    },
    appearance: {
      editor: 'seo',
      addons: [],
      parameters: {},
    },
    fieldset: seoFieldSet.id,
  });

  const privacyPolicy = await client.items.create({
    itemType: genericPageModel.id,
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: {
      schema: 'dast',
      document: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'span',
                value:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              },
            ],
          },
        ],
      },
    },
    seo: {
      title: 'Privacy Policy',
      description: 'Lorem ipsum dolor sit amet.',
    },
  });

  const termsAndConditions = await client.items.create({
    itemType: genericPageModel.id,
    title: 'Terms and Conditions',
    slug: 'terms-and-conditions',
    content: {
      schema: 'dast',
      document: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'span',
                value:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              },
            ],
          },
        ],
      },
    },
    seo: {
      title: 'Terms and Conditions',
      description: 'Lorem ipsum dolor sit amet.',
    },
  });
};
