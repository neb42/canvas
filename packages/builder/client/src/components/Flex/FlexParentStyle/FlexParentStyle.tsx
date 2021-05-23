import * as React from 'react';
import { useDispatch } from 'react-redux';
import Slider from '@faculty/adler-web-components/atoms/Slider/Slider';
import { Widget, FlexAlignment, IFlexStyle, CustomComponentInstance } from '@ui-studio/types';
import { updateStyle } from 'actions/styles';
import { AlignmentButton } from 'components/AlignmentButton';

import * as Styles from './FlexParentStyle.styles';

interface FlexParentStyleProps {
  element: Widget | CustomComponentInstance;
  parent: Widget | CustomComponentInstance;
}

export const FlexParentStyle = ({ element, parent }: FlexParentStyleProps): JSX.Element => {
  const dispatch = useDispatch();

  if (element.style.type !== 'flex') throw Error();
  if (parent.layout?.type !== 'flex') throw Error();

  const handleUpdateAlignment = (value: string) => {
    if (element.style.type !== 'flex') throw Error();

    const style: IFlexStyle = {
      ...element.style,
      align: value as FlexAlignment,
    };

    dispatch(updateStyle(style));
  };

  const handleUpdateGrow = (grow: number) => {
    if (element.style.type !== 'flex') throw Error();

    const style: IFlexStyle = {
      ...element.style,
      grow,
    };

    dispatch(updateStyle(style));
  };

  const { grow, align } = element.style;

  return (
    <Styles.Container>
      <Styles.Field>
        <Styles.FieldHeader>Grow</Styles.FieldHeader>
        <Slider
          value={grow}
          onChangeComplete={handleUpdateGrow}
          minValue={0}
          maxValue={10}
          step={1}
        />
      </Styles.Field>
      <Styles.Field>
        <Styles.FieldHeader>Alignment</Styles.FieldHeader>
        <AlignmentButton
          layoutType="flex"
          direction={parent.layout.direction}
          alignmentType="self"
          value={align}
          onChange={handleUpdateAlignment}
        />
      </Styles.Field>
    </Styles.Container>
  );
};
