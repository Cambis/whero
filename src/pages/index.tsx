import type { GetStaticPropsContext, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import type { QueryListenerOptions, TitleMetaLinkTag } from 'react-datocms';
import { renderMetaTags, useQuerySubscription } from 'react-datocms';

import { Layout, Container, Footer } from 'components';
import { sdk } from 'lib/datocms';
import type { HomePageQuery, HomePageQueryVariables } from 'lib/graphql';
import { HomePageDocument } from 'lib/graphql';

export const getStaticProps: GetStaticProps = async ({
  preview = false,
}: GetStaticPropsContext) => {
  const graphqlRequest = {
    query: HomePageDocument.loc?.source.body!,
    initialData: await sdk(preview).HomePage(),
    preview,
  };

  const subscription: QueryListenerOptions<HomePageQuery, HomePageQueryVariables> = preview
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
    },
  };
};

const HomePage = ({
  subscription,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const {
    data: { site, homePage },
  } = useQuerySubscription<HomePageQuery, HomePageQueryVariables>(subscription);

  const metaTags = [...homePage.seo, ...site.favicon] as TitleMetaLinkTag[];
  const { title } = homePage;

  return (
    <Layout preview={subscription.preview}>
      <Head>{renderMetaTags(metaTags)}</Head>
      <Container classNames="w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">Welcome to {title}</h1>

        <p className="mt-3 text-2xl">
          Get started by editing{' '}
          <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">src/pages/index.tsx</code>
        </p>

        <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <a
            href="https://nextjs.org/docs"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
            <p className="mt-4 text-xl">
              Find in-depth information about Next.js features and its API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Learn &rarr;</h3>
            <p className="mt-4 text-xl">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Examples &rarr;</h3>
            <p className="mt-4 text-xl">
              Discover and deploy boilerplate example Next.js projects.
            </p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Deploy &rarr;</h3>
            <p className="mt-4 text-xl">
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </Container>
      <Footer />
    </Layout>
  );
};

export default HomePage;
