import type { NextPage } from 'next';
import Head from 'next/head';

import { Layout, Container, Footer, ContactForm } from 'components';

const ContactPage: NextPage = () => {
  return (
    <Layout preview={false}>
      <Head>
        <title>Whero</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <h1 className="text-6xl font-bold">Contact</h1>

        <p className="mt-3 text-2xl">This is an example page that contains a simple contact form</p>
        <ContactForm />
      </Container>
      <Footer />
    </Layout>
  );
};

export default ContactPage;
