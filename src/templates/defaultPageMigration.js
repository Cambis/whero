'use strict';

/**
 * Default page migration template
 *
 * USAGE: $ dato new migration 'create my pages' --migrationTemplate=./src/templates/defaultPageMigration.js
 *
 * Find and replace all instances of 'myPage' with the appropiate name etc.
 */

module.exports = async (client) => {
  const myPageModel = await client.itemTypes.create({
    name: 'My page',
    apiKey: 'my_page',
    hint: 'A generic page that can be used for simple content.',
  });

  const titleField = await client.fields.create(myPageModel.id, {
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

  const contentField = await client.fields.create(myPageModel.id, {
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

  const seoFieldSet = await client.fieldset.create(myPageModel.id, {
    title: 'SEO',
    hint: 'Please fill in these fields!',
    collapsible: true,
    startCollapsed: false,
  });

  const slugField = await client.fields.create(myPageModel.id, {
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

  const seoField = await client.fields.create(myPageModel.id, {
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
};
