import type { Record } from 'datocms-structured-text-utils';

import type { BlockProps as Props } from './types';

const Block = ({ record }: Props): JSX.Element => {
  const components = {};

  const Component = components[record.__typename];

  if (Component) {
    return <Component {...(record as Record)} />;
  }

  return (
    <>
      <p className="u-todo">Don&apos;t know how to render a block!</p>
      <pre>{JSON.stringify(record, null, 2)}</pre>
    </>
  );
};

export default Block;
