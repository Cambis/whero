import Link from 'next/link';

import { Container } from 'components';

const PreviewMode = (): JSX.Element => (
  <Container>
    <p className="u-mB-0 u-textCenter">
      This is page is showing draft content.{' '}
      <Link href="/api/preview/exit" prefetch={false}>
        Click here
      </Link>{' '}
      to exit preview mode.
    </p>
  </Container>
);

export default PreviewMode;
