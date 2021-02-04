import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Layout } from '@ui-builder/types';

import { Store } from '../types/store';

const LayoutWrapper = styled.div<{ layout: Layout; isSelected: boolean }>`
  ${({ layout }) =>
    layout.layoutType === 'grid'
      ? `
        display: grid;
        grid-template-columns: ${layout.props.columns
          .map((l) => `${l.value || ''}${l.unit}`)
          .join(' ')};
        grid-template-rows: ${layout.props.rows.map((l) => `${l.value || ''}${l.unit}`).join(' ')};
        grid-column-gap: ${layout.props.columnGap}px;
        grid-row-gap: ${layout.props.rowGap}px;
        align-items: ${layout.props.rowAlignment};
        justify-content: ${layout.props.columnAlignment};
      `
      : ''}

  ${({ layout }) =>
    layout.layoutType === 'flex'
      ? `
        display: flex;
        flex-direction: ${layout.props.direction};
        align-items: ${layout.props.align};
        justify-content: ${layout.props.justify};
        flex-wrap: ${layout.props.wrap ? 'wrap' : 'no-wrap'};
      `
      : ''}

  ${({ layout }) =>
    layout.style.type === 'grid'
      ? `
        grid-row: ${layout.style.layout[0][0]} / ${layout.style.layout[1][0] + 1};
        grid-column: ${layout.style.layout[0][1]} / ${layout.style.layout[1][1] + 1};
      `
      : ''}

  ${({ layout }) =>
    layout.style.type === 'flex'
      ? `
        align-self: ${layout.style.align};
        justify-self: ${layout.style.justify};
        flex-grow: ${layout.style.grow};
      `
      : ''}

  ${({ layout }) => layout.style.css}

  ${({ theme, isSelected }) => (isSelected ? `border: 1px solid ${theme.colors.brand500};` : '')}
`;

export const LayoutBuilder: React.FC<any> = ({
  layout,
  children,
}: {
  children?: React.ReactNode;
  layout: Layout;
}) => {
  const isSelected = useSelector(
    (state: Store) =>
      state.development.selectedElement === layout.id ||
      state.development.hoverElement === layout.id,
  );
  return React.createElement(
    LayoutWrapper,
    { className: layout.style.classNames, layout, isSelected },
    children,
  );
};
