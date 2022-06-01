import { PreviewMode } from 'components';

import type { LayoutProps as Props } from './types';

const Layout = ({ preview, children }: Props): JSX.Element => {
  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center justify-center">
        {children}
      </main>

      {preview && <PreviewMode />}
    </>
  );
};

export default Layout;
