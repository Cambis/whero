'use strict';

module.exports = async (client) => {
  // DatoCMS migration script

  // For more examples, head to our Content Management API docs:
  // https://www.datocms.com/docs/content-management-api

  // Create an HomePage model:
  // https://www.datocms.com/docs/content-management-api/resources/item-type/create

  const homePageModel = await client.itemTypes.create({
    name: 'Home page',
    apiKey: 'home_page',
    singleton: true,
    hint: 'The primary landing page for this website.',
  });

  // Create a Title field (required):
  // https://www.datocms.com/docs/content-management-api/resources/field/create

  const titleField = await client.fields.create(homePageModel.id, {
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

  const contentField = await client.fields.create(homePageModel.id, {
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

  const seoFieldSet = await client.fieldset.create(homePageModel.id, {
    title: 'SEO',
    hint: 'Please fill in these fields!',
    collapsible: true,
    startCollapsed: false,
  });

  const slugField = await client.fields.create(homePageModel.id, {
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

  const seoField = await client.fields.create(homePageModel.id, {
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

  // Create an HomePage record:
  // https://www.datocms.com/docs/content-management-api/resources/item/create

  const homePage = await client.items.create({
    itemType: homePageModel.id,
    title: 'Nau mai, haere mai, ki te Whero!',
    slug: 'home',
    seo: {
      title: 'Whero',
      description: 'NextJS DatoCMS Boilerplate.',
    },
  });
};
