import * as React from 'react';
import { ElementTree } from 'components/ElementTree';
import { ElementConfig } from 'components/ElementConfig';
import { Preview } from 'components/Preview';
import { AddElementModal } from 'components/AddElementModal';

import * as Styles from './PageBuilder.styles';

interface Props {
  pageName: string;
}

export const PageBuilder = ({ pageName }: Props): JSX.Element => {
  return (
    <>
      <Styles.Container>
        <ElementTree pageName={pageName} />
        <Preview pageName={pageName} />
        <ElementConfig />
      </Styles.Container>
      <AddElementModal />
    </>
  );
};
