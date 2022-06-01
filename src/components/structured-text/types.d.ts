import type { ReactNode } from 'react';

import type { StructuredText } from 'datocms-structured-text-utils';

export type StructuredTextContentProps = {
  content: StructuredText<Record>;
};

export type StructuredTextInlineRecordProps = {
  record: Record;
};

export type PageLinkRecord = {
  id: string;
  title: string;
  __typename: string;
  slug: string;
};

export type StructuredTextLinkToRecordProps = {
  record: PageLinkRecord;
  transformedMeta?: {
    target?: string;
  };
  children: ReactNode;
};

export type StructuredTextBlockProps = {
  record: {
    id: string;
    __typename: string;
  };
};
