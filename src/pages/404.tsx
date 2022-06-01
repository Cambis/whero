import type { NextPage } from 'next';
import Head from 'next/head';

import { Layout, Container, Footer } from 'components';

const NotFound: NextPage = () => {
  return (
    <Layout preview={false}>
      <Head>
        <title>404 | Not Found</title>
        <meta name="description" content="404 not found" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <h1 className="title">Page Not Found</h1>
      </Container>
      <Footer />
    </Layout>
  );
};

export default NotFound;
