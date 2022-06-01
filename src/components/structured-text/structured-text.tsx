import { StructuredText as DatoStructuredText } from 'react-datocms';

import { Block } from 'components';

import type {
  StructuredTextContentProps,
  StructuredTextBlockProps,
  StructuredTextInlineRecordProps,
  StructuredTextLinkToRecordProps,
} from './types';

const StructuredText = ({ content }: StructuredTextContentProps): JSX.Element => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const renderInlineRecord = ({ record }: StructuredTextInlineRecordProps): JSX.Element => (
    <a className="u-todo">Inline record</a>
  );

  const renderLinkToRecord = ({
    record,
    children,
    transformedMeta,
  }: StructuredTextLinkToRecordProps): JSX.Element => <a className="u-todo">Link to record</a>;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const renderBlock = ({ record }: StructuredTextBlockProps): JSX.Element => (
    <Block record={record} />
  );

  return (
    <DatoStructuredText
      data={content}
      renderInlineRecord={renderInlineRecord}
      renderLinkToRecord={renderLinkToRecord}
      renderBlock={renderBlock}
    />
  );
};

export default StructuredText;
