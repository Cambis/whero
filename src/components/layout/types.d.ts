import { ReactNode } from 'react';

export type LayoutProps = {
  preview: boolean;
  children: ReactNode;
  layoutKey?: string | number;
};
