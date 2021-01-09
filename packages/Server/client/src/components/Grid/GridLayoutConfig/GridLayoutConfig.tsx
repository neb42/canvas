import * as React from 'react';
import { useDispatch } from 'react-redux';
import { IGridCell, Page, Layout, Widget } from '@ui-builder/types';
import { GridPreview } from 'components/Grid/GridPreview';
import { GridTemplateControls } from 'components/Grid/GridTemplateControls';
import { updateLayoutConfig } from 'actions/layout';

import * as Styles from './GridLayoutConfig.styles';

const defaultCell: IGridCell = { value: 1, unit: 'fr' };

interface IGridLayoutConfig {
  element: Page | Layout | Widget;
}

export const GridLayoutConfig = ({ element }: IGridLayoutConfig): JSX.Element => {
  const dispatch = useDispatch();
  const [columns, setColumns] = React.useState<IGridCell[]>(
    element?.props?.columns ?? [defaultCell],
  );
  const [rows, setRows] = React.useState<IGridCell[]>(element?.props?.rows ?? [defaultCell]);

  React.useEffect(() => {
    dispatch(updateLayoutConfig(element.id, 'columns', columns));
  }, [JSON.stringify(columns)]);

  React.useEffect(() => {
    dispatch(updateLayoutConfig(element.id, 'rows', rows));
  }, [JSON.stringify(rows)]);

  return (
    <Styles.Container>
      <GridPreview columns={columns} rows={rows} />
      <GridTemplateControls name="column" config={columns} updateConfig={setColumns} />
      <GridTemplateControls name="row" config={rows} updateConfig={setRows} />
    </Styles.Container>
  );
};