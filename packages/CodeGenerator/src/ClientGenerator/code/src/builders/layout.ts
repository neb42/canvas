import * as React from 'react';
import styled from 'styled-components';
import { Layout } from '@ui-builder/types';

export const LayoutBuilder = ({
  layout,
  children,
}: {
  children?: React.ReactNode;
  layout: Layout;
}): React.FunctionComponentElement<any> => {
  const LayoutWrapper: React.FC<any> = styled.div`
    height: 100%;
    width: 100%;

    ${layout.layoutType === 'grid'
      ? `
        display: grid;
        grid-template-columns:{{ #columns }} {{ value }}{{ unit }}{{ /columns }};
        grid-template-rows:{{ #rows }} {{ value }}{{ unit }}{{ /rows }};
        grid-row-gap: 16px;
        grid-column-gap: 16px;
      `
      : ''}

    ${layout.layoutType === 'flex'
      ? `
        display: flex;
      `
      : ''}

      ${layout.style.type === 'grid'
      ? `
        grid-row: ${layout.style.layout[0][0]} / ${layout.style.layout[1][0] + 1};
        grid-column: ${layout.style.layout[0][1]} / ${layout.style.layout[1][1] + 1};
      `
      : ''}

      ${layout.style.css}
  `;

  return React.createElement(LayoutWrapper, { className: layout.style.classNames }, children);
};