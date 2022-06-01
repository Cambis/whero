/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Document, { Html, Head, Main, NextScript } from 'next/document';

const GTMJs = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANGER_ID}');`;

const bugherdJs = `(function(d, t) {
  var bh = d.createElement(t),
    s = d.getElementsByTagName(t)[0];
  bh.type = 'text/javascript';
  bh.src = 'https://www.bugherd.com/sidebarv2.js?apikey=${process.env.NEXT_PUBLIC_BUGHERD_KEY}';
  s.parentNode.insertBefore(bh, s);
  })(document, 'script');`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="Accept-CH" content="DPR, Width, Viewport-Width" />
          {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANGER_ID && (
            <>
              {/* <!-- Google Tag Manager --> */}
              <script
                dangerouslySetInnerHTML={{
                  __html: GTMJs,
                }}
              />
              {/* <!-- End Google Tag Manager --> */}
            </>
          )}
          {process.env.NEXT_PUBLIC_BUGHERD_KEY && (
            <>
              {/* <!-- Bugherd --> */}
              <script
                dangerouslySetInnerHTML={{
                  __html: bugherdJs,
                }}
              />
            </>
          )}
        </Head>
        <body>
          {process.env.NEXT_PUBLIC_GOOGLE_TAG_MANGER_ID && (
            <>
              {/* <!-- Google Tag Manager (noscript) --> */}
              <noscript
                dangerouslySetInnerHTML={{
                  __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANGER_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                }}
              />
              {/* <!-- End Google Tag Manager (noscript) --> */}
            </>
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
  };
};
