import type { ReactNode } from 'react';

export type ContainerProps<Tag extends keyof JSX.IntrinsicElements> = {
  children: ReactNode;
  classNames?: string;
  tag?: ComponentType | keyof JSX.IntrinsicElements;
} & JSX.IntrinsicElements[Tag];
