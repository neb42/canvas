import * as React from 'react';
import { Value$Iterable } from '@ui-studio/types';
import { Input, Select } from '@faculty/adler-web-components';
import { useSelector } from 'react-redux';
import { OpenAPIV3 } from 'openapi-types';
import { getAvailableIteratorKeys } from 'selectors/element';

type Props = {
  value: Value$Iterable;
  schema: OpenAPIV3.SchemaObject;
  handleValueChange: (value: Value$Iterable) => any;
};

export const IterableValue = ({ value, schema, handleValueChange }: Props) => {
  const iterables = useSelector(getAvailableIteratorKeys)(value.widgetId, schema);

  const handleWidgetChange = ({ value: v }: any) => {
    handleValueChange({
      ...value,
      widgetId: v as string,
      propKey: '', // TODO prepopulate
      lookup: '',
    });
  };

  const handlePropKeyChange = ({ value: v }: any) => {
    handleValueChange({
      ...value,
      propKey: v as string,
      lookup: '',
    });
  };

  const handleLookupChange = (v: string) => {
    handleValueChange({
      ...value,
      lookup: v,
    });
  };

  const widgetOptions = iterables.map((it) => ({ label: it.widgetName, value: it.widgetId }));
  const widgetValue = {
    value: value.widgetId,
    label: iterables.find((it) => it.widgetId === value.widgetId)?.widgetName,
  };

  const propKeyOptions =
    iterables
      .find((it) => it.widgetId === value.widgetId)
      ?.propKeys.map((k) => ({ label: k, value: k })) ?? [];
  const propKeyValue = { label: value.propKey, value: value.propKey };

  React.useEffect(() => {
    handleValueChange({
      ...value,
      propKey: propKeyOptions[0].value,
    });
  }, [value.widgetId]);

  return (
    <>
      <Select
        label="Iterator widget"
        value={widgetValue}
        onChange={handleWidgetChange}
        options={widgetOptions}
      />
      <Select
        label="Iterator prop"
        value={propKeyValue}
        onChange={handlePropKeyChange}
        options={propKeyOptions}
      />
      <Input label="Property" onChange={handleLookupChange} value={value.lookup} />
    </>
  );
};
