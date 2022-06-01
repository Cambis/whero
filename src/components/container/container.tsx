import { forwardRef, RefObject } from 'react';

import cn from 'classnames';

import type { ContainerProps as Props } from './types';

const Container = forwardRef(
  <T extends keyof JSX.IntrinsicElements = 'div'>(
    { children, classNames, tag: Wrapper = 'div', ...props }: Props<T>,
    ref: RefObject<HTMLInputElement>,
  ) => {
    return (
      <Wrapper ref={ref} className={cn('container mx-auto', classNames)} {...props}>
        {children}
      </Wrapper>
    );
  },
);

Container.displayName = 'Container';

export default Container as <T extends keyof JSX.IntrinsicElements>(
  props: Props<T> & { ref?: RefObject<HTMLInputElement> },
) => JSX.Element;
