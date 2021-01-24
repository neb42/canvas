import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tab, Tabs, TextField } from '@material-ui/core';
import { Store } from 'types/store';
import { makeGetElement, makeGetSelectedElement } from 'selectors/element';
import { updateElementName } from 'actions/element';
import { ElementIcon } from 'components/ElementIcon';
import { GridLayoutConfig } from 'components/Grid/GridLayoutConfig/GridLayoutConfig';
import { GridParentStyle } from 'components/Grid/GridParentStyle';
import { WidgetConfig } from 'components/WidgetConfig';
import { CSSInput } from 'components/CSSInput';
import { ClassNamesInput } from 'components/ClassNamesInput';
import { EventConfig } from 'components/EventConfig';

import * as Styles from './ElementConfig.styles';

interface WidgetConfig {
  component: 'input';
  key: string;
  label: string;
}

export const ElementConfig = (): JSX.Element => {
  const dispatch = useDispatch();
  const getElement = React.useMemo(makeGetElement, []);
  const getSelectedElement = React.useMemo(makeGetSelectedElement, []);
  const selectedElement = useSelector(getSelectedElement);
  const [name, setName] = React.useState(selectedElement?.name ?? '');
  const [tabIndex, setTabIndex] = React.useState(0);

  const parentName =
    !selectedElement || selectedElement.type === 'page' ? null : selectedElement.parent;
  const parentElement = useSelector((state: Store) => getElement(state, parentName));

  React.useEffect(() => {
    if (selectedElement && selectedElement.name !== name) {
      setName(selectedElement.name);
    }
  }, [selectedElement?.name]);

  const handleOnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event?.target?.value ?? '';
    setName(newName);
  };

  const handleOnNameBlur = () => {
    if (selectedElement) {
      dispatch(updateElementName(selectedElement.id, selectedElement.type, name));
    }
  };

  if (selectedElement === null) {
    return <Styles.Container>No element selected</Styles.Container>;
  }

  const componentName = (() => {
    switch (selectedElement.type) {
      case 'page':
        return 'Page';
      case 'layout': {
        switch (selectedElement.layoutType) {
          case 'grid':
            return 'Grid layout';
          case 'flex':
            return 'Flex layout';
          default:
            return 'Unknown';
        }
      }
      case 'widget': {
        return selectedElement.component;
      }
      default:
        return 'Unknown';
    }
  })();

  return (
    <Styles.Container>
      <Styles.Header>
        <ElementIcon element={selectedElement} color="#fff" />
        <Styles.ComponentName>{componentName}</Styles.ComponentName>
      </Styles.Header>
      <Styles.Name>
        <TextField
          id="name"
          label="Name"
          value={name}
          required
          onChange={handleOnNameChange}
          onBlur={handleOnNameBlur}
          error={name.length === 0}
        />
      </Styles.Name>
      <Tabs variant="fullWidth" value={tabIndex} onChange={(_, newIdx) => setTabIndex(newIdx)}>
        <Tab label="Config" />
        <Tab label="Style" />
        {selectedElement.type === 'widget' && <Tab label="Events" />}
      </Tabs>
      <Styles.Field>
        {tabIndex === 0 &&
          selectedElement.type === 'layout' &&
          selectedElement.layoutType === 'grid' && <GridLayoutConfig element={selectedElement} />}
        {tabIndex === 0 && selectedElement.type === 'widget' && (
          <WidgetConfig widget={selectedElement} />
        )}
        {tabIndex === 1 &&
          selectedElement?.type !== 'page' &&
          parentElement?.type === 'layout' &&
          parentElement?.layoutType === 'grid' && (
            <GridParentStyle element={selectedElement} parent={parentElement} />
          )}
        {tabIndex === 1 && <ClassNamesInput element={selectedElement} />}
        {tabIndex === 1 && <CSSInput element={selectedElement} />}
        {selectedElement.type === 'widget' && tabIndex === 2 && (
          <EventConfig widget={selectedElement} />
        )}
      </Styles.Field>
    </Styles.Container>
  );
};
