import Image from 'next/image';

import { Container } from 'components';

const Footer = (): JSX.Element => (
  <footer className="flex h-24 w-full items-center justify-center border-t">
    <Container classNames="items-center justify-center text-center gap-2">
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{' '}
        <span className="logo">
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </a>
    </Container>
  </footer>
);

export default Footer;
