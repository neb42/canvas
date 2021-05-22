import {
  WidgetProp,
  WidgetProp$CustomComponentConfig,
  WidgetProp$Iterable,
} from '@ui-studio/types';

import { Store } from './types/store';

export const getWidgetPropertyValue = (state: Store) => (
  widgetId: string,
  rootId: string | null,
  property: string,
) => {
  const widgetConfig = state.widget.config[widgetId];
  if (!widgetConfig) return null;
  const widgetValue = (() => {
    if (rootId) {
      return state.widget.value?.[rootId]?.[widgetId];
    }
    return state.widget.value?.[widgetId];
  })();
  if (widgetConfig.type === 'customComponentInstance') {
    const root = state.root.config[widgetConfig.customComponentId];
    if (root.type !== 'customComponent' || !root.exposedProperties) return null;
    return state.widget.value[widgetId][root.exposedProperties[property].widgetId][
      root.exposedProperties[property].property
    ];
  }
  return widgetValue?.[property] ?? null;
};

export const getVariableDefinitions = (state: Store) => state.variable.config;

const parseLookup = (variable: any, lookup: string) =>
  lookup.split('.').reduce((acc, cur) => (cur.length > 0 ? acc[cur] : acc), variable);

export const getVariableValue = (state: Store) => (variableId: string, lookup: string | null) => {
  let variable = state.variable.value[variableId];
  if (!variable) return null;

  if (state.variable.config[variableId].valueType === 'object' && typeof variable === 'string') {
    try {
      variable = JSON.parse(variable);
    } catch {}
  }

  if (lookup && lookup.length > 0) {
    if (
      JSON.stringify(Object.keys(variable).sort()) ===
      JSON.stringify(['error', 'loading', 'value'].sort())
    ) {
      try {
        return {
          ...variable,
          value: parseLookup(variable.value, lookup),
        };
      } catch {
        return { ...variable, error: true, value: null };
      }
    }
    try {
      return parseLookup(variable, lookup);
    } catch {
      return null;
    }
  }
  return variable;
};

export const getVariableArgs = (state: Store) => (variableId: string) => {
  const variable = getVariableDefinitions(state)[variableId];
  if (variable.type !== 'function') return [];

  return variable.args.map((a) => {
    if (a.type === 'static') {
      return a.value;
    }

    if (a.type === 'variable') {
      return getVariableValue(state)(a.variableId, null);
    }

    if (a.type === 'widget') {
      return getWidgetPropertyValue(state)(a.widgetId, null, a.property);
    }

    return null;
  });
};

export const getCustomComponentConfigProp = (state: Store) => (
  rootId: string | null,
  prop: WidgetProp$CustomComponentConfig,
  iteratorIndex: { [widgetId: string]: { [prop: string]: number } },
): any | null => {
  if (!rootId) return null;
  const p = state.widget.config[rootId].props[prop.configKey];
  return getProp(state)(rootId, null, p, iteratorIndex);
};

export const getProp = (state: Store) => (
  widgetId: string,
  rootId: string | null,
  prop: WidgetProp,
  iteratorIndex: { [widgetId: string]: { [prop: string]: number } },
): any | null => {
  if (prop.mode === 'list') {
    return prop.props.map((p) => getProp(state)(widgetId, rootId, p, iteratorIndex));
  }

  if (prop.mode === 'iterable') {
    return getIterableValue(state)(widgetId, rootId, prop, iteratorIndex);
  }

  if (prop.mode === 'complex') {
    return Object.keys(prop.props).reduce(
      (a, c) => ({ ...a, [c]: getProp(state)(widgetId, rootId, prop.props[c], iteratorIndex) }),
      {},
    );
  }

  if (prop.mode === 'customComponentConfig') {
    return getCustomComponentConfigProp(state)(rootId, prop, iteratorIndex);
  }

  if (prop.mode === 'variable') {
    if (prop.type === 'object') {
      return getVariableValue(state)(prop.variableId, prop.lookup);
    }
    return getVariableValue(state)(prop.variableId, null);
  }

  if (prop.mode === 'widget') {
    return getWidgetPropertyValue(state)(prop.widgetId, rootId, prop.lookup);
  }

  if (prop.mode === 'static') {
    if (prop.type === 'object') {
      try {
        return JSON.parse(prop.value);
      } catch {
        return null;
      }
    }
    return prop.value;
  }

  return null;
};

export const getIterableValue = (state: Store) => (
  sourceWidgetId: string,
  rootId: string | null,
  widgetProp: WidgetProp$Iterable,
  iteratorIndex: { [widgetId: string]: { [prop: string]: number } },
): any => {
  try {
    const position = iteratorIndex[widgetProp.widgetId][widgetProp.propKey];
    const widget = state.widget.config[widgetProp.widgetId];
    const iteratorValue = getProp(state)(
      widget.id,
      rootId,
      widget.props[widgetProp.propKey],
      iteratorIndex,
    );
    if (!Array.isArray(iteratorValue)) throw Error();
    const itemValue = iteratorValue[position];
    if (widgetProp.lookup && widgetProp.lookup.length > 0) return itemValue[widgetProp.lookup];
    return itemValue;
  } catch {
    return [];
  }
};
