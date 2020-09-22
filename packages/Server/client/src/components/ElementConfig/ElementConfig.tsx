import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tab, Tabs, TextField } from '@material-ui/core';
import { GridOnSharp } from '@material-ui/icons';
import { Store } from 'types/store';
import { makeGetElement, makeGetSelectedElement, makeIsValidElementName } from 'selectors/element';
import { updateElement, updateElementName } from 'actions/element';
import { GridLayoutConfig } from 'components/Grid/GridLayoutConfig/GridLayoutConfig';
import { GridParentStyle } from 'components/Grid/GridParentStyle';

import * as Styles from './ElementConfig.styles';

interface WidgetConfig {
  component: 'input';
  key: string;
  label: string;
}

const widgetConfigMap: { [key: string]: WidgetConfig[] } = {
  text: [{ component: 'input', key: 'children', label: 'Text' }],
};

export const ElementConfig = (): JSX.Element => {
  const dispatch = useDispatch();
  const getElement = React.useMemo(makeGetElement, []);
  const getSelectedElement = React.useMemo(makeGetSelectedElement, []);
  const isValidElementName = useSelector(React.useMemo(makeIsValidElementName, []));
  const selectedElement = useSelector(getSelectedElement);
  const [name, setName] = React.useState(selectedElement?.name);
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
    const newName = event?.target?.value;
    if (newName) {
      setName(newName);

      if (isValidElementName(newName) && selectedElement) {
        dispatch(updateElementName(selectedElement.name, selectedElement.type, newName));
      }
    }
  };

  if (selectedElement === null) {
    return <Styles.Container>No element selected</Styles.Container>;
  }

  const renderField = (config: WidgetConfig) => {
    if (selectedElement.type !== 'widget') return null;
    switch (config.component) {
      case 'input': {
        return (
          <TextField
            id={config.key}
            label={config.label}
            value={selectedElement.props[config.key] || ''}
            multiline
            rowsMax={4}
            onChange={(e) =>
              dispatch(
                updateElement(
                  selectedElement.name,
                  selectedElement.type,
                  config.key,
                  e.target.value,
                ),
              )
            }
          />
        );
      }
      default:
        return null;
    }
  };

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
        switch (selectedElement.component) {
          case 'text':
            return 'Text';
          default:
            return 'Unknown';
        }
      }
      default:
        return 'Unknown';
    }
  })();

  return (
    <Styles.Container>
      <Styles.Header>
        <GridOnSharp style={{ color: '#fff' }} />
        <Styles.ComponentName>{componentName}</Styles.ComponentName>
      </Styles.Header>
      <Styles.Name>
        <TextField
          id="name"
          label="Name"
          value={name}
          required
          onChange={handleOnNameChange}
          error={isValidElementName(name || '')}
        />
      </Styles.Name>
      <Tabs variant="fullWidth" value={tabIndex} onChange={(_, newIdx) => setTabIndex(newIdx)}>
        <Tab label="Config" />
        <Tab label="Style" />
      </Tabs>
      <Styles.Field>
        {tabIndex === 0 &&
          selectedElement.type === 'widget' &&
          widgetConfigMap[selectedElement.component].map((c) => renderField(c))}
        {tabIndex === 0 &&
          selectedElement.type === 'layout' &&
          selectedElement.layoutType === 'grid' && <GridLayoutConfig element={selectedElement} />}
        {tabIndex === 1 &&
          selectedElement?.type !== 'page' &&
          parentElement?.type === 'layout' &&
          parentElement?.layoutType === 'grid' && (
            <GridParentStyle element={selectedElement} parent={parentElement} />
          )}
      </Styles.Field>
    </Styles.Container>
  );
};
