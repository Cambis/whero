import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import Head from 'next/head';
import {
  QueryListenerOptions,
  renderMetaTags,
  TitleMetaLinkTag,
  useQuerySubscription,
} from 'react-datocms';

import { Container, Footer, Layout, StructuredText } from 'components';
import { sdk } from 'lib/datocms';
import {
  GenericPageBySlugDocument,
  GenericPageBySlugQuery,
  GenericPageBySlugQueryVariables,
} from 'lib/graphql';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: await sdk()
    .AllGenericPageSlugs()
    .then((data) => data.allGenericPages.map((page) => `/${page.slug}`)),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}: GetStaticPropsContext) => {
  let slug = '';

  if (Array.isArray(params.slug)) {
    slug = params.slug.join('/');
  } else {
    slug = params.slug;
  }

  const graphqlRequest = {
    query: GenericPageBySlugDocument.loc?.source.body!,
    initialData: await sdk(preview).GenericPageBySlug({ slug: slug ?? '' }),
    preview,
  };

  const subscription: QueryListenerOptions<
    GenericPageBySlugQuery,
    GenericPageBySlugQueryVariables
  > = preview
    ? {
        ...graphqlRequest,
        token: process.env.NEXT_DATOCMS_API_TOKEN,
        environment: process.env.NEXT_DATOCMS_ENVIRONMENT,
      }
    : {
        ...graphqlRequest,
        enabled: false,
      };

  return {
    props: {
      subscription,
      preview,
    },
  };
};

const GenericPage = ({
  subscription,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const {
    data: { site, genericPage },
  } = useQuerySubscription<GenericPageBySlugQuery, GenericPageBySlugQueryVariables>(subscription);

  const metaTags = [...genericPage.seo, ...site.favicon] as TitleMetaLinkTag[];
  const { title, content } = genericPage;

  return (
    <>
      <Layout preview={subscription.preview}>
        <Head>{renderMetaTags(metaTags)}</Head>
        <Container>
          <h1 className="title">{title}</h1>
          <StructuredText content={content} />
        </Container>
        <Footer />
      </Layout>
    </>
  );
};

export default GenericPage;
