import type { GraphQLResponse } from 'graphql-request/dist/types';
import { NextRequest, NextResponse } from 'next/server';

const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Redirect to static page if default pages are not set up
  if (process.env.NODE_ENV !== 'production' && pathname === '/') {
    let endpoint = 'https://graphql.datocms.com';

    if (!process.env.NEXT_DATOCMS_API_TOKEN) {
      return NextResponse.rewrite(new URL('/static', req.url));
    }

    if (process.env.NEXT_DATOCMS_ENVIRONMENT) {
      endpoint += `/environments/${process.env.NEXT_DATOCMS_ENVIRONMENT}`;
    }

    const graphqlResponse: GraphQLResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: process.env.NEXT_DATOCMS_API_TOKEN,
      },
      body: JSON.stringify({
        query: `{ homePage { id } }`,
        variables: {},
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    if (graphqlResponse.errors) {
      return NextResponse.rewrite(new URL('/static', req.url));
    }
  }

  // Basic auth
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_BASIC_AUTH) {
    return NextResponse.next();
  }

  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1];
    const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':');
    const [authUser, authPwd] = process.env.NEXT_BASIC_AUTH.split(':');

    if (user === authUser && pwd === authPwd) {
      return NextResponse.next();
    }
  }

  return new Response('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
};

export default middleware;
